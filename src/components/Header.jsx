import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdMenu } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import Logo from "../assets/logo.jpg";
import "./Header.css";
import { LogoutModal } from "./Modals";

const Header = () => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const firstSlashIndex = location.pathname.indexOf("/");
  const secondSlashIndex = location.pathname.indexOf("/", firstSlashIndex + 1);
  const thirdSlashIndex = location.pathname.indexOf("/", firstSlashIndex + 2);
  const [logoutModal, setLogoutModal] = useState(false);

  // console.log("location:::", location);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={`p-[20px] py-[30px] border-t-[5px] border-t-[#053A19] 
      w-full shadow-md flex items-center justify-between bg-white font-poppins`}
    >
      <div>
        {location.pathname === "/admin-overview" && (
          <div>
            <p className={`text-[#667085]`}>Overview</p>
            <p className={`text-[20px] font-[600] text-[#053A19]`}>Analytics</p>
          </div>
        )}
        {location.pathname === "/admin-bills" && (
          <div>
            <p className={`text-[#667085]`}>Taxations</p>
            <p className={`text-[20px] font-[600] text-[#053A19]`}>
              Investigate Declaration of Taxations
            </p>
          </div>
        )}
        {location.pathname === "/admin-invoices" && (
          <div>
            <p className={`text-[#667085]`}>Taxations</p>
            <p className={`text-[20px] font-[600] text-[#053A19]`}>
              Send Invoices to Due Departments
            </p>
          </div>
        )}
        {location.pathname === "/admin-agent-bills" && (
          <div>
            <p className={`text-[#667085]`}>Taxations</p>
            <p className={`text-[20px] font-[600] text-[#053A19]`}>
              Investigate Agent Declaration of Taxations
            </p>
          </div>
        )}
        {secondSlashIndex !== -1 && (
          <div>
            <p className={`text-[#667085]`}>Taxations</p>
            <p className={`text-[20px] font-[600] text-[#053A19]`}>
              {location.pathname.includes("demand-notice")
                ? "Send Demand Notice"
                : "Taxation Details"}
            </p>
          </div>
        )}
      </div>

      <div>
        <p className={`hidden md:flex`}>Hello, Admin</p>

        <div className={`md:hidden`}>
          <MdMenu size={32} color="#053A19" onClick={toggleSidebar} />
        </div>
      </div>

      <div className={`sidebar ${isSidebarOpen ? "open" : ""} z-20`}>
        <div className={`sidebar-content`}>
          <div className={`bg-[#fff] w-[70%] h-full p-[34px]`}>
            <div
              className={`flex justify-between items-center`}
              onClick={toggleSidebar}
            >
              <img src={Logo} alt="" className={`w-[150px]`} />
              <IoMdClose size={24} color="#053A19" />
            </div>
            <div className={`mt-[30px] space-y-[40px]`}>
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
                  location.pathname === "/admin-bills" && `bg-[#ccc]`
                }`}
                onClick={() => navigate("/admin-bills")}
              >
                <p>Investigations</p>
              </div>
              <div className={`flex flex-col justify-end h-full`}>
                <div
                  className={`p-[20px] cursor-pointer hover:bg-[#cccccc2e] rounded-[8px]`}
                  onClick={() => setLogoutModal(true)}
                >
                  <p className={``}>Log out</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {logoutModal && <LogoutModal onCancel={() => setLogoutModal(false)} />}
      </div>
    </div>
  );
};

export default Header;
