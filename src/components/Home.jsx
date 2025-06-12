import { useEffect, useState } from "react";
import { NavLink, Navigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [checking, setChecking] = useState(true);
  const [fbTokenValid, setFbTokenValid] = useState(false);
  const [appCredsEntered, setAppCredsEntered] = useState(false);
  // Check if Facebook login (app credentials) is done

  useEffect(() => {
    // Only check FB token if app creds are entered
     setAppCredsEntered(localStorage.getItem("user"));
     console.log("App credentials entered:", appCredsEntered);
    if (appCredsEntered) {
      axios
        .get("http://localhost:5000/auth/facebook/pages", { withCredentials: true })
        .then((response) => {
          console.log("FB token is valid, response:", response);
          setFbTokenValid(true);
          setChecking(false);
        })
        .catch((error) => {
          console.log("FB token is NOT valid, error:", error.response || error);
          setFbTokenValid(false);
          setChecking(false);
        });
    } else {
      setChecking(false);
    }
  }, [appCredsEntered]);

  if (checking) {
    return <div>Loading...</div>;
  }

  // If app credentials are entered and FB token is valid, go directly to Homepage
  if (appCredsEntered && fbTokenValid) {
    return <Navigate to="/Homepage" />;
  }

  // If app credentials are entered but FB token is NOT valid, show Facebook login button
  if (appCredsEntered && !fbTokenValid) {
    return (
      <div className="App">
        <NavLink to="/schedulePost">
          <button>
            Login with Facebook (Session Expired)
          </button>
        </NavLink>
      </div>
    );
  }

  // If app credentials are NOT entered, show Facebook login button
  return (
    <div className="App">
      <NavLink to="/schedulePost">
        <button>
          Login with Facebook to Schedule Post
        </button>
      </NavLink>
    </div>
  );
}