import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdMenu } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import Logo from "../assets/logo.jpg";
import "./Header.css";
import { LogoutModal } from "./Modals";

const HeaderOperator = () => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const firstSlashIndex = location.pathname.indexOf("/");
  const secondSlashIndex = location.pathname.indexOf("/", firstSlashIndex + 1);
  const thirdSlashIndex = location.pathname.indexOf("/", firstSlashIndex + 2);
  const [logoutModal, setLogoutModal] = useState(false);
  const [userData, setUserData] = useState();

  // console.log("location:::", location);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const getUserData = async () => {
    const userData = localStorage.getItem("kadir-user-data");
    if (userData !== null) {
      const parsedUserData = JSON.parse(userData);
      // console.log("parsed user data:::", parsedUserData);
      setUserData(parsedUserData);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div
      className={`p-[20px] py-[30px] border-t-[5px] border-t-primary 
      w-full shadow-md flex items-center justify-between bg-white font-poppins`}
    >
      <div>
        {location.pathname === "/operators-overview" && (
          <div>
            <p className={`text-[#667085]`}>Overview</p>
            <p className={`text-[20px] font-[600] text-primary`}>Analytics</p>
          </div>
        )}
        {location.pathname === "/operators-send-declaration" && (
          <div>
            <p className={`text-[#667085]`}>Taxations</p>
            <p className={`text-[20px] font-[600] text-primary`}>
              Send your Monthly Declarations of Affairs
            </p>
          </div>
        )}
        {location.pathname === "/operators-invoice" && (
          <div>
            <p className={`text-[#667085]`}>Invoice</p>
            <p className={`text-[20px] font-[600] text-primary`}>
              Make your Payments
            </p>
          </div>
        )}
        {location.pathname === "/operator-profile" && (
          <div>
            <p className={`text-[#667085]`}>Profile</p>
            <p className={`text-[20px] font-[600] text-primary`}>
              View and Manage your profile
            </p>
          </div>
        )}
        {location.pathname === "/operators-single-invoice" && (
          <div>
            <p className={`text-[#667085]`}>Invoice</p>
            <p className={`text-[20px] font-[600] text-primary`}>
              Invoice Details
            </p>
          </div>
        )}
        {location.pathname === "/operator-send-agent-declaration" && (
          <div>
            <p className={`text-[#667085]`}>Taxation</p>
            <p className={`text-[20px] font-[600] text-primary`}>
              Send your Agents Declaration of Affairs
            </p>
          </div>
        )}
        {secondSlashIndex !== -1 && (
          <div>
            <p className={`text-[#667085]`}>Taxations</p>
            <p className={`text-[20px] font-[600] text-primary`}>
              {location.pathname.includes("demand-notice")
                ? "Send Demand Notice"
                : "Taxation Details"}
            </p>
          </div>
        )}
      </div>

      <div>
        <p className={`hidden md:flex`}>Hello, {userData?.business_name}</p>

        <div className={`md:hidden`}>
          <MdMenu size={32} color="#053A19" onClick={toggleSidebar} />
        </div>
      </div>

      <div className={`sidebar ${isSidebarOpen ? "open" : ""} z-20`}>
        <div className={`sidebar-content`}>
          <div className={`bg-[#fff] w-[70%] h-[100vh] p-[34px]`}>
            <div
              className={`flex justify-between items-center`}
              onClick={toggleSidebar}
            >
              <img src={Logo} alt="" className={`w-[150px]`} />
              <IoMdClose size={24} color="#053A19" />
            </div>
            <div className={`mt-[30px] space-y-[40px]`}>
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
                  location.pathname === "/operators-send-declaration" &&
                  `bg-[#ccc]`
                }`}
                onClick={() => navigate("/operators-send-declaration")}
              >
                <p>Send Declaration</p>
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
                  location.pathname === "/operator-profile" && `bg-[#ccc]`
                }`}
                onClick={() => navigate("/operator-profile")}
              >
                <p>Profile</p>
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

export default HeaderOperator;
