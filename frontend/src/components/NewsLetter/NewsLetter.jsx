import React from "react";
import "./NewsLetter.css";

function NewsLetter() {
  const [result, setResult] = React.useState("");
  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "89a752d5-00b1-4e26-afd2-1412db12b90e");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
     <form onSubmit={onSubmit}>
    <div className="start">
      <div className="newsletter">
    
        <h1>Get Exclusive Offers On Your Email</h1>
        <p>Subscribe to our newsletter and stay Up</p>
        <div className="input-field">
          <input type="text" name="name" placeholder="Enter your name" required />
          <input type="email" name="email" placeholder="Your email Id" required />
        
          <textarea name="message" placeholder="Enter your comment here" ></textarea>

          <button>Subscribe</button>
         <span>{result}</span>
        </div>
    
      </div>
    </div>
     </form>
  );
}

export default NewsLetter;
