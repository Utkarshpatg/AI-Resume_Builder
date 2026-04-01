import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // 🔥 dummy login
    navigate("/dashboard");
  };

  return (
    <div className="center">
      <div className="card">
        <h2>Login to Your Account</h2>

        <label>Email</label>
        <input type="text" />

        <label>Password</label>
        <input type="password" />

        <button className="primary" onClick={handleLogin}>
          Login
        </button>

        <p>
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign up</span>
        </p>
      </div>
    </div>
  );
}

export default Login;