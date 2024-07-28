import React from "react";
import "./CSS/Loginsignup.css";

function LoginSignup() {
  const [state, setState] = React.useState("Login");
  const [formData, setFormData] = React.useState({
    name: "",
    password: "",
    email: "",
  });
  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const login = async () => {
    console.log("login function called", formData);

    let responseData;

    await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));
    if (responseData.success) {
      console.log("User created successfully");
      localStorage.setItem("auth-token", responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.error);
    }
  };
  const signup = async () => {
    console.log("signup function called", formData);
    let responseData;

    await fetch("http://localhost:4000/signup", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));
    if (responseData.success) {
      console.log("User created successfully");
      localStorage.setItem("auth-token", responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.error);
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" ? (
            <input
              name="name"
              value={formData.name}
              onChange={changeHandler}
              type="text"
              placeholder="Your name"
            />
          ) : (
            <></>
          )}
          <input
            name="email"
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder="Email address"
          />
          <input
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder="Password"
          />
          <button
            onClick={() => {
              state === "Login" ? login() : signup();
            }}
          >
            Continue
          </button>
          {state === "Sign Up" ? (
            <p className="loginsignup-login">
              Already have an account ?
              <span
                onClick={() => {
                  setState("Login");
                }}
              >
                {" "}
                Login here
              </span>
            </p>
          ) : (
            <p className="loginsignup-login">
              Create an account ?
              <span
                onClick={() => {
                  setState("Sign Up");
                }}
              >
                {" "}
                Click here
              </span>
            </p>
          )}

          <div className="loginsignup-agree">
            <input type="checkbox"  />
            <p>
              By Continue,I agree to the terms & privacy policy of the company{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;
