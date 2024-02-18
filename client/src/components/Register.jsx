import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import useSignin from "react-auth-kit/hooks/useSignIn";
import { GoogleLogin } from "@react-oauth/google";
// context
import { KeeperContext } from "../context/KeeperContext";

function Register() {
  // variables
  const { setShowRegister } = useContext(KeeperContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const url = process.env.REACT_APP_URL || "http://localhost:5000";
  const [error, setError] = useState("");
  const [passError, setPassError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const navigate = useNavigate();
  const signIn = useSignin();

  // helper functions
  // registering a user
  async function handleSubmit(event) {
    event.preventDefault();
    const body = {
      name,
      email,
      password,
    };

    try {
      const check = await axios.get(`${url}/users/${email}`);

      if (!check.data) {
        setEmailError(false);
        setError("");

        if (password === password2) {
          setPassError(false);
          setError("");

          const response = await axios.post(`${url}/register`, body);

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
          }
        } else {
          setError("Passwords don't match.");
          setPassError(true);
        }
      } else {
        setError("Email already taken.");
        setEmailError(true);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // registering a user through google auth
  async function googleSingup(body) {
    try {
      const check = await axios.get(`${url}/users/${body.email}`);

      if (!check.data) {
        setEmailError(false);
        setError("");
        const response = await axios.post(`${url}/register/google`, body);

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
        } else alert("Can't register. Try again.");
      } else {
        setError("Email already taken.");
        setEmailError(true);
      }
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
        <p className="h3 text-center">Create Account</p>

        {error && <p className="text-warning mb-1">{error}</p>}

        <div className="mb-3">
          <label htmlFor="name" className="form-label mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Name"
            className="form-control"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            className={
              emailError ? "form-control border-danger border-2" : "form-control"
            }
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
            className={passError ? "form-control border-danger border-2" : "form-control"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password2" className="form-label mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="password2"
            placeholder="Password"
            className={passError ? "form-control border-danger border-2" : "form-control"}
            required
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </div>

        <div>
          <p className="mb-2">
            By creating an account you agree to our terms and policies.
          </p>
          <button type="submit" className="btn btn-success w-100 mb-3">
            Create account
          </button>
          <p className="mb-2">Already a user?</p>
          <button
            type="button"
            className="btn btn-primary w-100"
            onClick={() => setShowRegister(false)}
          >
            Login
          </button>
        </div>

        <div className="mt-3 text-center">
          <p className="mb-1">Or</p>

          <div className="d-inline-block">
            <GoogleLogin
              text="signup_with"
              logo_alignment="center"
              onSuccess={(res) => {
                const credentials = jwtDecode(res.credential);
                const body = {
                  name: credentials.given_name.toLowerCase(),
                  email: credentials.email,
                  google_id: credentials.sub,
                };

                googleSingup(body);
              }}
              onError={() => {
                console.log("error registering.");
                alert("Can't register.");
              }}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default Register;
