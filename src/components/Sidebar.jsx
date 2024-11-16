import React, { useState } from "react";
import Logo from "../assets/logo.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import { LogoutModal } from "./Modals";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [logoutModal, setLogoutModal] = useState(false);

  return (
    <div
      className={`h-[100vh] p-[20px] font-poppins w-[20%] flex flex-col fixed`}
    >
      <div className={`flex justify-center`}>
        <img src={Logo} alt="" className={`w-[200px]`} />
      </div>
      <div className={`space-y-[20px] mt-[20px]`}>
        <div
          className={`hover:bg-[#cccccc2e] cursor-pointer p-[20px] rounded-[8px] ${
            location.pathname === "/admin-overview" && `bg-[#ccc]`
          }`}
          onClick={() => navigate("/admin-overview")}
        >
          <p>Overview</p>
        </div>
        <div
          className={`hover:bg-[#cccccc2e] cursor-pointer p-[20px] rounded-[8px] ${
            location.pathname === "/admin-invoices" && `bg-[#ccc]`
          }`}
          onClick={() => navigate("/admin-invoices")}
        >
          <p>Invoices</p>
        </div>
        <div
          className={`hover:bg-[#cccccc2e] cursor-pointer p-[20px] rounded-[8px] ${
            location.pathname === "/admin-bills" && `bg-[#ccc]`
          }`}
          onClick={() => navigate("/admin-bills")}
        >
          <p>Investigations</p>
        </div>

        <div
          className={`hover:bg-[#cccccc2e] cursor-pointer p-[20px] rounded-[8px] ${
            location.pathname === "/admin-agent-bills" && `bg-[#ccc]`
          }`}
          onClick={() => navigate("/admin-agent-bills")}
        >
          <p>Agent Investigations</p>
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

export default Sidebar;
