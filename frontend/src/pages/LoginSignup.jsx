import React from 'react'
import './CSS/Loginsignup.css'

function LoginSignup() {
  return (
    <div className='loginsignup' >
      <div className="loginsignup-container">
        <h1>Sign Up</h1>
        <div className="loginsignup-fields">
          <input type="text" placeholder='Your name' />
          <input type="email" placeholder='Email address' />
          <input type="password" placeholder='Password' />
          <button>Continue</button>
          <p className="loginsignup-login">Already have an account ?
            <span> Login here</span>

          </p>
          <div className="loginsignup-agree">
            <input type="checkbox" name='' id='' />
            <p>By Continue,I agree to the terms & privacy policy of the company </p>

          </div>
        </div>

      </div>

    </div>
  )
}

export default LoginSignup