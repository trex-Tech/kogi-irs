import React, { useState } from "react";
import BG from "../assets/bg.webp";
import Logo from "../assets/logo.jpg";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { toast } from "react-toastify";
import axios from "axios";
import { BACKEND_URL } from "../../sonfig.service";

const OperatorLogin = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const AdminLogin = () => {
    setLoading(true);
    if (email === "" || password === "") {
      setLoading(false);
      toast.error("No field can be empty");
    } else {
      const data = {
        contact: email,
        password: password,
      };
      axios
        .post(`${BACKEND_URL}/accounts/login/`, data)
        .then((res) => {
          setLoading(false);
          console.log("Login res:::", res.data);
          localStorage.setItem("kadir-user-token", res.data.token);
          localStorage.setItem(
            "kadir-user-data",
            JSON.stringify(res.data.user)
          );
          navigate("/operators-send-declaration");
        })
        .catch((err) => {
          setLoading(false);
          if (err.response) {
            console.log("Error response data:", err.response.data);
            toast.error(err.response.data.error);
          }
        });
    }
  };

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
            Hello Operator. Welcome back
          </p>

          <div className={`space-y-[20px] mt-[40px]`}>
            <input
              type="email"
              className={`w-full outline-none border border-gray-400 p-[10px] rounded-[6px]`}
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div
              className={`flex items-center border border-gray-400 rounded-[6px] w-full pr-[10px]`}
            >
              <input
                type={visible ? "text" : "password"}
                className={`w-full outline-none p-[10px] rounded-[6px]`}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div>
                {visible ? (
                  <IoEyeOff
                    size={24}
                    className={`cursor-pointer`}
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <IoEye
                    size={24}
                    className={`cursor-pointer`}
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>
            </div>
            <Button
              text={"Login"}
              onClick={() => AdminLogin()}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorLogin;
