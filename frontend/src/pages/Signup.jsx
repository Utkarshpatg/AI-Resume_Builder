import { useNavigate } from "react-router-dom";
import "../App.css";

function Signup() {
  const navigate = useNavigate();

  const handleSignup = () => {
    // 🔥 abhi dummy signup
    navigate("/dashboard");
  };

  return (
    <div className="center">
      <div className="card">
        <h2>Create an Account</h2>

        <label>Name</label>
        <input type="text" />

        <label>Email</label>
        <input type="text" />

        <label>Password</label>
        <input type="password" />

        <button className="primary" onClick={handleSignup}>
          Sign Up
        </button>

        <p>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Signup;