import React, { useState } from "react";
import axios from "axios";
import TemplateList from "./components/TemplateList";
import WorkflowForm from "./components/WorkflowForm";
import Runner from "./components/Runner";
import "./styles.css";

const API = "/api";

export default function App() {
  const [license, setLicense] = useState("DEV-KEY");
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [workflow, setWorkflow] = useState(null);

  const loadTemplates = async () => {
    try {
      const res = await axios.get(`${API}/templates`, {
        headers: { "X-License-Key": license },
      });
      setTemplates(res.data.templates);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to load templates");
    }
  };

  return (
    <div className="container">
      <h1>BizBot — Guided Automation Assistant</h1>

      <div className="card">
        <label>License Key:</label>
        <input
          value={license}
          onChange={(e) => setLicense(e.target.value)}
          placeholder="Enter license key"
        />
        <button onClick={loadTemplates}>Load Templates</button>
      </div>

      {!selectedTemplate && (
        <TemplateList templates={templates} onSelect={setSelectedTemplate} />
      )}

      {selectedTemplate && !workflow && (
        <WorkflowForm
          license={license}
          template={selectedTemplate}
          setWorkflow={setWorkflow}
        />
      )}

      {workflow && <Runner license={license} workflow={workflow} />}
    </div>
  );
}
