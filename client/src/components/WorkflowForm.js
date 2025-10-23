import React, { useState } from "react";
import axios from "axios";

const API = "/api";

export default function WorkflowForm({ license, template, setWorkflow }) {
  const [name, setName] = useState(`My ${template.key}`);

  const createWorkflow = async () => {
    try {
      const res = await axios.post(
        `${API}/workflows`,
        {
          name,
          template_key: template.key,
          config: {},
        },
        { headers: { "X-License-Key": license } }
      );
      setWorkflow({ id: res.data.workflow_id, template });
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create workflow");
    }
  };

  return (
    <div className="card">
      <h2>{template.name}</h2>
      <p>{template.description}</p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Workflow name"
      />
      <button onClick={createWorkflow}>Create Workflow</button>
    </div>
  );
}
