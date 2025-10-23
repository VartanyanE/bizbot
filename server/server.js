import "dotenv/config";
import express from "express";
import cors from "cors";
import db from "./db.js";
import { templates, getTemplate } from "./templates.js";
import { generateText } from "./utils/openai.js";
import { sendToZapier } from "./utils/zapier.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 5050;

// License middleware
function requireLicense(req, res, next) {
  const key = req.header("X-License-Key");
  if (!key) return res.status(401).json({ error: "Missing X-License-Key" });

  if (key === "DEV-KEY") return next();

  db.get(
    "SELECT * FROM licenses WHERE key = ? AND status = 'active'",
    [key],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row)
        return res.status(403).json({ error: "License invalid or inactive" });
      req.licenseKey = key;
      next();
    }
  );
}

// Register license (stub)
app.post("/api/license/register", (req, res) => {
  const { key, product_id, owner_email } = req.body || {};
  if (!key || !product_id)
    return res.status(400).json({ error: "key and product_id required" });

  db.run(
    `INSERT OR IGNORE INTO licenses (key, product_id, owner_email, status)
     VALUES (?, ?, ?, 'active')`,
    [key, product_id, owner_email || null],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true });
    }
  );
});

// Get templates
app.get("/api/templates", requireLicense, (req, res) => {
  res.json({ templates });
});

// Create workflow
app.post("/api/workflows", requireLicense, (req, res) => {
  const { name, template_key, config } = req.body || {};
  const t = getTemplate(template_key);
  if (!t) return res.status(400).json({ error: "Unknown template_key" });

  db.run(
    `INSERT INTO workflows (license_key, name, template_key, config_json)
     VALUES (?, ?, ?, ?)`,
    [
      req.licenseKey || "DEV-KEY",
      name || t.name,
      template_key,
      JSON.stringify(config || {}),
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true, workflow_id: this.lastID });
    }
  );
});

// Run workflow
app.post("/api/workflows/:id/run", requireLicense, (req, res) => {
  const { id } = req.params;
  const { input } = req.body || {};

  db.get(
    "SELECT * FROM workflows WHERE id = ? AND license_key = ?",
    [id, req.licenseKey || "DEV-KEY"],
    async (err, workflow) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!workflow)
        return res.status(404).json({ error: "Workflow not found" });

      const t = getTemplate(workflow.template_key);
      if (!t) return res.status(400).json({ error: "Template missing" });

      const system = "You are a professional business automation assistant.";
      const user = `${
        t.prompt
      }\n\nHere is the user input JSON:\n${JSON.stringify(input, null, 2)}`;

      try {
        const llm = await generateText({ system, user });
        const zap = await sendToZapier({
          workflow_id: workflow.id,
          llm_output: llm,
          input,
        });

        db.run(
          `INSERT INTO runs (workflow_id, input_json, output_json)
           VALUES (?, ?, ?)`,
          [workflow.id, JSON.stringify(input), JSON.stringify({ llm, zap })],
          (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ ok: true, llm, zap });
          }
        );
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    }
  );
});

app.listen(PORT, () =>
  console.log(`✅ BizBot server running on http://localhost:${PORT}`)
);
