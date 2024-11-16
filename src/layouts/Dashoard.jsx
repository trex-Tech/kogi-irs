import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header.jsx";

const Dashoard = ({ children }) => {
  return (
    <div className={`flex h-[100vh] w-[100vw] overflow-y-scroll`}>
      <div className={`hidden md:flex w-[20%]`}>
        <Sidebar />
      </div>
      <div className={`md:w-[80%] w-full bg-[#F8F8F8] h-full`}>
        <Header />
        <div className={`p-[20px] mt-[0px] font-poppins `}>{children}</div>
      </div>
    </div>
  );
};

export default Dashoard;
