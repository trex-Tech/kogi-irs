import React, { useState } from "react";
import Logo from "../assets/logo.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import { LogoutModal } from "./Modals";

const SidebarOperator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [logoutModal, setLogoutModal] = useState(false);

  return (
    <div
      className={`h-[100vh] p-[20px] font-poppins w-[20%] flex flex-col fixed`}
    >
      <div className={`flex justify-center`}>
        <img src={Logo} alt="" className={`w-[70px]`} />
      </div>
      <div className={`space-y-[20px] mt-[20px]`}>
        {/* <div
          className={`hover:bg-[#cccccc2e] cursor-pointer p-[20px] rounded-[8px] ${
            location.pathname === "/operators-overview" && `bg-[#ccc]`
          }`}
          onClick={() => navigate("/operators-overview")}
        >
          <p>Overview</p>
        </div> */}
        <div
          className={`hover:bg-[#cccccc2e] cursor-pointer p-[20px] rounded-[8px] ${
            location.pathname === "/operators-send-declaration" && `bg-[#ccc]`
          }`}
          onClick={() => navigate("/operators-send-declaration")}
        >
          <p>Send Declaration</p>
        </div>
        <div
          className={`hover:bg-[#cccccc2e] cursor-pointer p-[20px] rounded-[8px] ${
            location.pathname === "/operator-send-agent-declaration" &&
            `bg-[#ccc]`
          }`}
          onClick={() => navigate("/operator-send-agent-declaration")}
        >
          <p>Send Agent Declaration</p>
        </div>
        <div
          className={`hover:bg-[#cccccc2e] cursor-pointer p-[20px] rounded-[8px] ${
            location.pathname === "/operators-invoice" && `bg-[#ccc]`
          }`}
          onClick={() => navigate("/operators-invoice")}
        >
          <p>Invoice</p>
        </div>

        <div
          className={`hover:bg-[#cccccc2e] cursor-pointer p-[20px] rounded-[8px] ${
            location.pathname === "/agents-invoice" && `bg-[#ccc]`
          }`}
          onClick={() => navigate("/agents-invoice")}
        >
          <p>Agent Invoice</p>
        </div>

        <div
          className={`hover:bg-[#cccccc2e] cursor-pointer p-[20px] rounded-[8px] ${
            location.pathname === "/operator-profile" && `bg-[#ccc]`
          }`}
          onClick={() => navigate("/operator-profile")}
        >
          <p>Profile</p>
        </div>
      </div>
      <div className={`flex flex-col justify-end h-full`}>
        <div
          className={`p-[20px] cursor-pointer hover:bg-[#cccccc2e] rounded-[8px]`}
          onClick={() => setLogoutModal(true)}
        >
          <p className={``}>Log out</p>
        </div>
      </div>

      {logoutModal && <LogoutModal onCancel={() => setLogoutModal(false)} />}
    </div>
  );
};

export default SidebarOperator;
