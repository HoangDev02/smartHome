import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/api/apiUser";
import { registerSuccess, registerFailed } from "../../redux/authSlice";
import "./register.css";
import Helmet from "../helmet/Helmet";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Thông báo lỗi
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.register.currentUser);
  
  const handleRegister = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setErrorMessage("Password must contain at least 6 characters");
      return;
    }
    const newUser = {
      email: email,
      password: password,
      username: username,
    };
    registerUser(newUser, dispatch, navigate, registerSuccess, registerFailed);
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  return (
    <Helmet title={"Sign up"}>
    <section className="register-container">
      <h2 className="register-title">Sign up</h2>
      {errorMessage && <div className="register-error-message">{errorMessage}</div>}
      <form onSubmit={handleRegister} className="register-form">
        <label className="bg-white">Email</label>
        <input
          type="text"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
          required
        />
        <label className="bg-white">Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          onChange={(e) => setUserName(e.target.value)}
          className="form-control"
          required
        />
        <label className="bg-white">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
          required
        />
        <button type="submit" className="register-button">
          Create account
        </button>
      </form>
    </section>
    </Helmet>
  );
};

export default Register;
