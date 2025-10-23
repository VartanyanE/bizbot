import React from "react";

export default function TemplateList({ templates, onSelect }) {
  if (!templates.length) {
    return <div className="card">No templates loaded yet.</div>;
  }

  return (
    <div>
      <h2>Available Templates</h2>
      {templates.map((t) => (
        <div key={t.key} className="card">
          <div className="title">{t.name}</div>
          <p>{t.description}</p>
          <button onClick={() => onSelect(t)}>Select</button>
        </div>
      ))}
    </div>
  );
}
