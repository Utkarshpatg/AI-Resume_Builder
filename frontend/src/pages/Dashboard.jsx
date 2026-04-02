import { useNavigate } from "react-router-dom";
import "../App.css";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="center">
      <div className="card">
        <h2>Welcome to Dashboard 🎉</h2>
        <p>Your resume builder is ready.</p>

        <button
          className="primary"
          onClick={() => navigate("/builder")}
        >
          Create Resume
        </button>

        <button
          className="secondary"
          style={{ marginTop: "10px" }}
          onClick={() => navigate("/")}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;