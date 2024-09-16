import React, { Component } from "react";
import "./CSS/Loginsignup.css";

class LoginSignup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authMode: "Login", // Toggle between "Login" and "Sign Up"
      formData: {
        name: "",
        ph_no: "",
        email: "",
        password: "",
      },
      error: null,
    };
  }

  changeHandler = (e) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [e.target.name]: e.target.value,
      },
    });
  };

  submitForm = async (url) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.state.formData),
      });
      const responseData = await response.json();

      if (responseData.success) {
        localStorage.setItem("auth-token", responseData.token);
        window.location.replace("/");
      } else {
        this.setState({ error: responseData.error });
      }
    } catch (error) {
      console.error("Error:", error);
      this.setState({ error: "An error occurred. Please try again." });
    }
  };

  login = async (e) => {
    e.preventDefault();

    // Check for empty fields
    const { email, password } = this.state.formData;
    if (!email || !password) {
      this.setState({ error: "Please fill in both email and password." });
      return;
    }

    // Proceed with login request
    this.submitForm("https://e-commerce-9u9h.onrender.com/login");
  };

  signup = async (e) => {
    e.preventDefault();

    // Check for empty fields
    const { name, ph_no, email, password } = this.state.formData;
    if (!name || !ph_no || !email || !password) {
      this.setState({ error: "Please fill in all fields." });
      return;
    }

    // Proceed with signup request
    this.submitForm("https://e-commerce-9u9h.onrender.com/signup");
  };

  toggleAuthMode = () => {
    this.setState({
      authMode: this.state.authMode === "Login" ? "Sign Up" : "Login",
      error: null, // Clear error message when toggling
    });
  };

  render() {
    return (
      <div className="loginsignup">
        <div className="loginsignup-container">
          <h1>{this.state.authMode}</h1>
          {this.state.error && <p className="error">{this.state.error}</p>}
          <div className="loginsignup-fields">
            {this.state.authMode === "Sign Up" && (
              <>
                <input
                  name="name"
                  value={this.state.formData.name}
                  onChange={this.changeHandler}
                  type="text"
                  placeholder="Your name"
                />
                <input
                  name="ph_no"
                  value={this.state.formData.ph_no}
                  onChange={this.changeHandler}
                  type="number"
                  placeholder="Phone Number"
                />
              </>
            )}
            <input
              name="email"
              value={this.state.formData.email}
              onChange={this.changeHandler}
              type="email"
              placeholder="Email address"
            />
            <input
              name="password"
              value={this.state.formData.password}
              onChange={this.changeHandler}
              type="password"
              placeholder="Password"
            />
            <button
              onClick={
                this.state.authMode === "Login" ? this.login : this.signup
              }
            >
              {this.state.authMode}
            </button>
            <button onClick={this.toggleAuthMode}>
              {this.state.authMode === "Login"
                ? "Switch to Sign Up"
                : "Switch to Login"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginSignup;
