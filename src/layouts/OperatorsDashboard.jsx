import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import HeaderOperator from "../components/HeaderOperator";
import SidebarOperator from "../components/SidebarOperator";

const OperatorsDashboard = ({ children }) => {
  return (
    <div className={`flex h-[100vh] w-[100vw] overflow-y-scroll`}>
      <div className={`hidden md:flex w-[20%]`}>
        <SidebarOperator />
      </div>
      <div className={`md:w-[80%] w-full bg-[#F8F8F8]`}>
        <HeaderOperator />
        <div className={`p-[20px] mt-[0px] font-poppins `}>{children}</div>
      </div>
    </div>
  );
};

export default OperatorsDashboard;
