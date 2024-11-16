import React from "react";
import BG from "../assets/bg.webp";
import Logo from "../assets/logo.jpg";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const Choice = () => {
  const navigate = useNavigate();

  return (
    <div
      className={`bg-cover bg-no-repeat bg-center h-[100vh] font-poppins`}
      style={{ backgroundImage: `url(${BG})` }}
    >
      <div
        className={`absolute top-0 left-0 bg-[#000000c8] w-full 
        h-full flex items-center justify-center px-[20px] md:px-0`}
      >
        <div className={`bg-white p-[30px] px-[40px] rounded-[8px]`}>
          <div className={`flex justify-center`}>
            <img src={Logo} alt="" />
          </div>

          <p
            className={`text-center mt-[30px] text-[18px] md:text-[30px] font-[600]`}
          >
            Welcome to KGIRS Gaming
          </p>

          <div className={`space-y-[20px] mt-[40px]`}>
            <Button
              text={"I am an Operator"}
              onClick={() => navigate("/operators-signup")}
            />
            <Button
              text={"I am an Admin"}
              onClick={() => navigate("/admin-login")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Choice;
