import { useState } from "react";
import "../App.css";

function Builder() {
  const [data, setData] = useState({
    name: "",
    email: "",
    skills: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="app">
      {/* LEFT */}
      <div className="left">
        <h2>Create Resume</h2>

        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="skills" placeholder="Skills" onChange={handleChange} />
      </div>

      {/* RIGHT */}
      <div className="right">
        <h2>Preview</h2>

        <div className="resume">
          <h3>{data.name || "Your Name"}</h3>
          <p>{data.email || "email@example.com"}</p>

          <h4>Skills</h4>
          <ul>
            {data.skills
              ? data.skills.split(",").map((s, i) => <li key={i}>{s}</li>)
              : <li>No skills added</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Builder;