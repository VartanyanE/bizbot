import React, { useState } from "react";
import axios from "axios";

const API = "/api";

export default function Runner({ license, workflow }) {
  const [input, setInput] = useState("{}");
  const [output, setOutput] = useState("");

  const runWorkflow = async () => {
    try {
      const payload = JSON.parse(input);
      const res = await axios.post(
        `${API}/workflows/${workflow.id}/run`,
        { input: payload },
        { headers: { "X-License-Key": license } }
      );
      setOutput(JSON.stringify(res.data, null, 2));
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="card">
      <h2>Run Workflow</h2>
      <textarea
        rows="6"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='{"lead_name": "Sam", "lead_email": "sam@example.com"}'
      />
      <button onClick={runWorkflow}>Run</button>
      {output && <pre className="output">{output}</pre>}
    </div>
  );
}
