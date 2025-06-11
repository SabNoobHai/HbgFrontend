import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch,useSelector } from "react-redux";
import { setUser } from "../store/pagesSlice";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [jwtToken, setJwtToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();
    const selector = useSelector((state) => state.pages.user);
    
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/userauth/login", {
        username,
        password,
      });
      if (res.data.token) {
        setJwtToken(res.data.token);
        setIsLoggedIn(true);
        console.log("Login successful, JWT Token:", res.data.user);
        dispatch(setUser(res.data.user)); // Store user data in Redux
        localStorage.setItem("user", JSON.stringify(res.data.user)); 
         window.location.href = 'http://localhost:5173/Home'; // Redirect to Home page after login
      }
    } catch (err) {
      alert("Invalid login");
    }
  };
useEffect(() => {
  console.log("Selector updated:", selector);
}, [selector]);
  const infoBoxStyle = {
    background: "#ffffffcc",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
    width: "300px",
    textAlign: "center",
    margin: "10px"
  };

  if (isLoggedIn) {
    return (
      <div style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        fontFamily: "sans-serif"
      }}>
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={infoBoxStyle}>
            <h3>JWT Token</h3>
            <p style={{ wordBreak: "break-all" }}>{jwtToken}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#000"
    }}>
      <form onSubmit={handleLogin} style={{
        background: "#ffffffcc",
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
        width: "100%",
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <div style={{
          width: "80px",
          height: "80px",
          backgroundColor: "#e0e0e0",
          borderRadius: "50%",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "40px",
          color: "#7d2ae8"
        }}>👤</div>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        <button type="submit" style={{
          width: "100%",
          padding: "12px",
          marginTop: "15px",
          backgroundColor: "#9b59b6",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer"
        }}>Sign In</button>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px",
          fontSize: "12px",
          width: "100%"
        }}>
          <label>
            <input type="checkbox" style={{ marginRight: "5px" }} /> Remember me
          </label>
          <a href="#" style={{ textDecoration: "underline", color: "#7d2ae8" }}>
            Forgot password?
          </a>
        </div>

        <div style={{ marginTop: "20px", fontSize: "14px" }}>
          Not a member?
          <a href="#" style={{
            padding: "5px 12px",
            border: "1px solid #7d2ae8",
            borderRadius: "12px",
            textDecoration: "none",
            color: "#7d2ae8",
            marginLeft: "5px"
          }}>Create account</a>
        </div>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  border: "1px solid #333",
  borderRadius: "6px",
  fontSize: "14px",
  backgroundColor: "#333",
  color: "#fff"
};