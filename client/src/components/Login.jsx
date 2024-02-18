import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import useSignin from "react-auth-kit/hooks/useSignIn";
import { GoogleLogin } from "@react-oauth/google";
// context
import { KeeperContext } from "../context/KeeperContext";

function Login() {
  // variables
  const { setShowRegister } = useContext(KeeperContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const url = process.env.REACT_APP_URL || "http://localhost:5000";
  const navigate = useNavigate();
  const signIn = useSignin();

  // helper functions
  // logging in a user
  async function handleSubmit(event) {
    event.preventDefault();
    const body = {
      email,
      password,
    };

    try {
      const check = await axios.get(`${url}/users/${email}`);

      if (check.data) {
        setError("");
        const response = await axios.post(`${url}/login`, body);

        if (response.data.message === "success") {
          setError("");
          const decodedToken = jwtDecode(response.data.token);

          signIn({
            auth: {
              token: response.data.token,
              type: "Bearer",
            },
            userState: {
              uid: decodedToken.id,
              name: decodedToken.name,
              email: decodedToken.email,
            },
          });

          navigate("/home");
        } else setError("Invalid email or password.");
      } else setError("Invalid email or password.");
    } catch (err) {
      console.log(err);
    }
  }

  // login through google auth
  async function googleSignin(body) {
    try {
      const check = await axios.get(`${url}/users/${body.email}`);

      if (check.data) {
        setError("");
        const response = await axios.post(`${url}/login/google`, body);

        if (response.data.message === "success") {
          const decodedToken = jwtDecode(response.data.token);
          signIn({
            auth: {
              token: response.data.token,
              type: "Bearer",
            },
            userState: {
              uid: decodedToken.id,
              name: decodedToken.name,
              email: decodedToken.email,
            },
          });

          navigate("/home");
        } else alert("Failed to login. Try again.");
      } else setError("Invalid email.");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="my-5 text-light">
      <form
        style={{ maxWidth: "450px", backdropFilter: "blur(15px)" }}
        className="border rounded p-5 mx-auto"
        onSubmit={(e) => handleSubmit(e)}
      >
        <p className="h3 text-center">Login</p>

        {error && <p className="text-warning mb-1">{error}</p>}

        <div className="mb-3">
          <label htmlFor="email" className="form-label mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            className={error ? "form-control border-danger border-2" : "form-control"}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="form-label mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            className={error ? "form-control border-danger border-2" : "form-control"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <button type="submit" className="btn btn-success w-100 my-3">
            Login
          </button>
          <p className="mb-2">Create an account</p>
          <button
            type="button"
            className="btn btn-primary w-100"
            onClick={() => setShowRegister(true)}
          >
            Register
          </button>
        </div>

        <div className="mt-3 text-center">
          <p className="mb-1">Or</p>

          <div className="d-inline-block">
            <GoogleLogin
              text="signin_with"
              logo_alignment="center"
              onSuccess={(res) => {
                const credential = jwtDecode(res.credential);
                const body = { email: credential.email };
                googleSignin(body);
              }}
              onError={() => {
                console.log("login failed.");
                alert("Login failed. Try again.");
              }}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
