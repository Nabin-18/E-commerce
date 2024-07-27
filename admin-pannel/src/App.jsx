import React from "react";
import Navbar from "./component/navbar/Navbar";
import Admin from "./pages/admin/Admin";
import AdminLogin from "./component/AdminLogin";
import { Route,Routes } from "react-router-dom";


const App = () => {
  return (
    <>
      <Navbar />
      
      
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

    </>
  );
};

export default App;
