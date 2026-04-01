import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <h1 className="title">AI Resume Builder</h1>
      <p className="desc">
        Create professional resumes in minutes with AI-assisted content generation.
        Land your dream job faster.
      </p>

      <div className="btns">
        <button onClick={() => navigate("/signup")} className="primary">
          Get Started
        </button>

        <button onClick={() => navigate("/login")} className="secondary">
          Login
        </button>
      </div>
    </div>
  );
}

export default Home;