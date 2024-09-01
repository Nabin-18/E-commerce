import React from "react";
import Navbar from "./component/navbar/Navbar";
import AdminLogin from "./component/AdminLogin";
import { Route, Routes } from "react-router-dom";
import Addproduct from "./component/addproduct/Addproduct";
import Listproduct from "./component/listproduct/Listproduct";



const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<AdminLogin />} />
      
        <Route path="/addproduct" element={<Addproduct />} />
        
        <Route path="/listproduct" element={<Listproduct />} />
        
       
      </Routes>
        
    </>
  );
};

export default App;
