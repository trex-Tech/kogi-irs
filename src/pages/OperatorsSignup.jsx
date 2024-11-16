import React, { useRef, useState } from "react";
import BG from "../assets/bg.webp";
import Logo from "../assets/logo.jpg";
import { useNavigate } from "react-router-dom";
import Button, { OutlinedButton } from "../components/Button";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { toast } from "react-toastify";
import axios from "axios";
import { BACKEND_URL } from "../../sonfig.service";
import { computeHMACSHA256Base64 } from "../helpers/utils";

const OperatorSignup = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [values, setValues] = useState({
    email: "",
    password: "",
    director_first_name: "",
    director_last_name: "",
    business_name: "",
    phone_number: "",
    business_address: "",
    cac_number: "",
    document: "",
    numberOfAgents: "",
    middleName: "0",
    tin: "9922346",
    IcNumber: "913337",
  });
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log("Selected File:", selectedFile);

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "text/plain",
    ];
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      console.log("Selected Document:", selectedFile);
      setSelectedFileName(selectedFile.name);
      toast.success(`${selectedFile.name} has been selected`);
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        setValues({ ...values, document: base64String });
        console.log(
          "Base64 representation of the selected document:",
          base64String
        );
      };
      reader.readAsDataURL(selectedFile);
    } else {
      toast.error("Invalid document type");
    }
  };

  // const RegisterOperator = () => {
  //   setLoading(true);

  //   if (
  //     values.email === "" ||
  //     values.director_first_name === "" ||
  //     values.director_last_name === "" ||
  //     values.business_name === "" ||
  //     values.business_address === "" ||
  //     values.phone_number === "" ||
  //     values.cac_number === "" ||
  //     values.password === "" ||
  //     values.document === "" ||
  //     values.numberOfAgents === "" ||
  //     values.tin === "" ||
  //     values.IcNumber === ""
  //   ) {
  //     toast.error("No field can be empty");
  //     setLoading(false);
  //   } else {
  //     const data = {
  //       email: values.email,
  //       password: values.password,
  //       director_first_name: values.director_first_name,
  //       director_last_name: values.director_last_name,
  //       business_name: values.business_name,
  //       phone_number: "+234" + values.phone_number,
  //       business_address: values.business_address,
  //       cac_number: values.cac_number,
  //       document: values.document,
  //       no_of_agents: values.numberOfAgents,
  //       tin: values.tin,
  //       IcNumber: values.IcNumber,
  //     };
  //     const data_2 = {
  //       addressLine1: values.business_address,
  //       confirmPassword: values.password,
  //       email: values.email,
  //       firstName: values.director_first_name,
  //       genderId: 1,
  //       lastName: values.director_last_name,
  //       IgaId: 16,
  //       password: values.password,
  //       phoneNumber: values.phone_number,
  //       userType: "Corporate",
  //       middleName: "0",
  //       tin: values.tin,
  //       IcNumber: values.IcNumber,
  //     };
  //     axios
  //       .post(`${BACKEND_URL}/accounts/register/`, data)
  //       .then((res) => {
  //         setLoading(false);
  //         console.log("Signup res:::", res.data);
  //         localStorage.setItem(
  //           "kadir-user-data",
  //           JSON.stringify(res.data.user)
  //         );
  //         navigate("/operator-login");
  //       })
  //       .catch((err) => {
  //         setLoading(false);
  //         if (err.response) {
  //           console.log("Error response data:", err.response.data);
  //           if (err.response.data.business_name) {
  //             toast.error(err.response.data.business_name);
  //           }
  //           if (err.response.data.phone_number) {
  //             toast.error(err.response.data.phone_number);
  //           }
  //           if (err.response.data.email) {
  //             toast.error(err.response.data.email);
  //           }
  //         }
  //       });
  //   }
  // };

  const RegisterOperator = async () => {
    setLoading(true);

    if (
      values.email === "" ||
      values.director_first_name === "" ||
      values.director_last_name === "" ||
      values.business_name === "" ||
      values.business_address === "" ||
      values.phone_number === "" ||
      values.cac_number === "" ||
      values.password === "" ||
      values.document === "" ||
      values.numberOfAgents === "" ||
      values.tin === "" ||
      values.IcNumber === ""
    ) {
      toast.error("No field can be empty");
      setLoading(false);
      return; // Early return to stop further execution
    }

    const data = {
      email: values.email,
      password: values.password,
      director_first_name: values.director_first_name,
      director_last_name: values.director_last_name,
      business_name: values.business_name,
      phone_number: "+234" + values.phone_number,
      business_address: values.business_address,
      cac_number: values.cac_number,
      document: values.document,
      no_of_agents: values.numberOfAgents,
    };

    const data_2 = {
      addressLine1: values.business_address,
      confirmPassword: values.password,
      email: values.email,
      firstName: values.director_first_name,
      genderId: 1,
      lastName: values.director_last_name,
      IgaId: 16,
      password: values.password,
      phoneNumber: values.phone_number,
      userType: "Corporate",
      middleName: "0",
      // tin: values.tin,
      // IcNumber: values.IcNumber,
      LgaId: 16,
    };

    try {
      const signature = computeHMACSHA256Base64(data_2);
      console.log("Computed signature:", signature);

      const response = await axios.post(
        "https://testingapi.paykaduna.com/api/ESBills/RegisterTaxPayer",
        data_2,
        {
          headers: {
            "X-Api-Signature": signature,
          },
        }
      );

      console.log("First endpoint response:", response);
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

      const res_data = response.data;
      console.log("res_data:", res_data);
      const userRegistration = response.data.userRegistration;
      const user = response.data.user;
      const userType = response.data.userType;

      data.tpui = userRegistration.tpui;
      data.external_id = userRegistration.id;
      data.external_user_id = user.id;
      console.log("Data to send to second endpoint:", res_data);

      const res = await axios.post(`${BACKEND_URL}/accounts/register/`, data);

      setLoading(false);
      console.log("Signup res:::", res.data);
      localStorage.setItem("kadir-user-data", JSON.stringify(res.data.user));
      navigate("/operator-login");
    } catch (err) {
      setLoading(false);
      console.error("Error during request:", err);
      if (err.response) {
        console.log("Error response data:", err.response.data);
        if (err.response.data.business_name) {
          toast.error(err.response.data.business_name);
        }
        if (err.response.data.phone_number) {
          toast.error(err.response.data.phone_number);
        }
        if (err.response.data.email) {
          toast.error(err.response.data.email);
        }
      }
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
        <div
          className={`bg-white p-[30px] px-[40px] rounded-[8px] h-[90%] overflow-y-scroll space-y-[20px]`}
        >
          <div className={`flex justify-center`}>
            <img src={Logo} alt="" />
          </div>

          <div>
            <OutlinedButton
              text={"Login as Operator"}
              onClick={() => navigate("/operator-login")}
            />
          </div>
          <p className={`text-center text-[20px]`}>Or</p>

          <p
            className={`text-center mt-[30px] text-[18px] md:text-[30px] font-[600]`}
          >
            Create an Operator Account
          </p>

          <div className={`space-y-[20px] mt-[40px]`}>
            <div>
              <label htmlFor="">Email address</label>
              <input
                type="email"
                className={`w-full outline-none border border-gray-400 p-[10px] rounded-[6px]`}
                placeholder="Email Address"
                value={values.email}
                onChange={(e) =>
                  setValues({ ...values, email: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="">Director's First Name</label>
              <input
                type="text"
                className={`w-full outline-none border border-gray-400 p-[10px] rounded-[6px]`}
                placeholder="Director's first name"
                value={values.director_first_name}
                onChange={(e) =>
                  setValues({ ...values, director_first_name: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="">Director's Last Name</label>
              <input
                type="text"
                className={`w-full outline-none border border-gray-400 p-[10px] rounded-[6px]`}
                placeholder="Director's last name"
                value={values.director_last_name}
                onChange={(e) =>
                  setValues({ ...values, director_last_name: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="">Business Name</label>
              <input
                type="text"
                className={`w-full outline-none border border-gray-400 p-[10px] rounded-[6px]`}
                placeholder="Business name"
                value={values.business_name}
                onChange={(e) =>
                  setValues({ ...values, business_name: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="">Phone Number</label>
              <input
                type="text"
                className={`w-full outline-none border border-gray-400 p-[10px] rounded-[6px]`}
                placeholder="Phone number"
                value={values.phone_number}
                onChange={(e) =>
                  setValues({ ...values, phone_number: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="">Business Address</label>
              <input
                type="text"
                className={`w-full outline-none border border-gray-400 p-[10px] rounded-[6px]`}
                placeholder="Business address"
                value={values.business_address}
                onChange={(e) =>
                  setValues({ ...values, business_address: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="">CAC Number</label>
              <input
                type="text"
                className={`w-full outline-none border border-gray-400 p-[10px] rounded-[6px]`}
                placeholder="Cac number"
                value={values.cac_number}
                onChange={(e) =>
                  setValues({ ...values, cac_number: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="">Number of Agents</label>
              <input
                type="text"
                className={`w-full outline-none border border-gray-400 p-[10px] rounded-[6px]`}
                placeholder="Number of agents"
                value={values.numberOfAgents}
                onChange={(e) =>
                  setValues({
                    ...values,
                    numberOfAgents: e.target.value.replace(/[^0-9]/g, ""),
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="">Upload CAC Document</label>
              <div
                className={`border border-gray-400 p-[10px] rounded-[6px] cursor-pointer`}
                onClick={handleButtonClick}
              >
                <p>{selectedFileName ? selectedFileName : "Select File"}</p>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept=".pdf, .doc, .docx, .txt"
              />
            </div>
            <div className={``}>
              <label htmlFor="">Password</label>
              <div
                className={`flex items-center border border-gray-400 rounded-[6px] w-full pr-[10px]`}
              >
                <input
                  type={visible ? "text" : "password"}
                  className={`w-full outline-none p-[10px] rounded-[6px]`}
                  placeholder="Password"
                  value={values.password}
                  onChange={(e) =>
                    setValues({ ...values, password: e.target.value })
                  }
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
            </div>
            <Button
              text={"Sign Up"}
              onClick={() => RegisterOperator()}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorSignup;
