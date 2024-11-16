import React, { useEffect, useRef, useState } from "react";
import OperatorsDashboard from "../layouts/OperatorsDashboard";
import moment from "moment";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { toast } from "react-toastify";
import { CiFileOn } from "react-icons/ci";
import Button from "../components/Button";
import axios from "axios";
import { BACKEND_URL } from "../../sonfig.service";
import { useNavigate } from "react-router-dom";
import { VscEmptyWindow } from "react-icons/vsc";
import LoaderSpinner from "../components/Loader";

const OperatorsDeclaration = () => {
  const [totalGames, setTotalGames] = useState();
  const [grossEarnings, setGrossEarnings] = useState("");
  const [paybackBonus, setPaybackBonus] = useState("");
  const [expenses, setExpenses] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [doc, setDoc] = useState("");
  const [openShops, setOpenShops] = useState("");
  const [loading, setLoading] = useState(false);
  const [taxableLoading, setTaxableLoading] = useState(false);
  const [taxableMonth, setTaxableMonth] = useState("");
  const [badNet, setBadNet] = useState(false);
  const [dataPacket, setDataPacket] = useState("");
  const [dataPacketFileName, setDataPacketFileName] = useState("");
  const navigate = useNavigate();
  const [convertedDate, setConvertedDate] = useState("");

  const convertDate = (dateString) => {
    const monthMap = {
      January: "01",
      February: "02",
      March: "03",
      April: "04",
      May: "05",
      June: "06",
      July: "07",
      August: "08",
      September: "09",
      October: "10",
      November: "11",
      December: "12",
    };
    const [month, year] = dateString.split("-");
    const monthNumber = monthMap[month];
    const newDate = `${year}-${monthNumber}-01`;
    setConvertedDate(newDate);
  };

  const sendDeclaration = () => {
    console.log(convertedDate);
    setLoading(true);

    const token = localStorage.getItem("kadir-user-token");

    if (
      totalGames === "" ||
      grossEarnings === "" ||
      paybackBonus === "" ||
      expenses === "" ||
      doc === "" ||
      openShops === "" ||
      dataPacket === ""
    ) {
      setLoading(false);
      toast.error("No field can be empty");
    } else {
      const data = {
        bonuses_paid: Number(paybackBonus.replace(/,/g, "")),
        expenses_amount: Number(expenses.replace(/,/g, "")),
        statement_of_account: doc,
        games_staked_amount: totalGames,
        gross_earnings: Number(grossEarnings.replace(/,/g, "")),
        open_shops: openShops,
        date: convertedDate,
        data_packets: dataPacket,
      };
      if (token) {
        axios
          .post(`${BACKEND_URL}/api/tax-submissions/`, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setLoading(false);
            console.log("Declaration res:::", res.data);
            toast.success("Your declaration has been sent successfully");
            setDoc("");
            setExpenses("");
            setGrossEarnings("");
            setTotalGames("");
            setPaybackBonus("");
            setOpenShops("");
            navigate("/operators-single-invoice", {
              state: {
                reference_code: res.data.reference_code,
              },
            });
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
            if (err.response) {
              console.log("Error response data:", err.response.data);
              toast.error(err.response.data.non_field_errors[0]);
            }
          });
      } else {
        setLoading(false);
        toast.error("Can't validate user, token not found");
      }
    }
  };

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const datapacketInputRef = useRef(null);

  const handleDataPacketClick = () => {
    datapacketInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log("Selected File:", selectedFile);
    setSelectedFileName(selectedFile.name);
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "text/plain",
    ];
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      console.log("Selected Document:", selectedFile);
      toast.success(`${selectedFile.name} has been selected`);
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        console.log(
          "Base64 representation of the selected document:",
          base64String
        );
        setDoc(base64String);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      toast.error("Invalid document type");
    }
  };

  const handleDataPacketChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log("Selected File:", selectedFile);
    setDataPacketFileName(selectedFile.name);
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "text/plain",
    ];
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      console.log("Selected Document:", selectedFile);
      toast.success(`${selectedFile.name} has been selected`);
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        console.log(
          "Base64 representation of the selected document:",
          base64String
        );
        setDataPacket(base64String);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      toast.error("Invalid document type");
    }
  };

  const handleInputChange = (event) => {
    const numericValue = event.target.value.replace(/[^0-9]/g, "");

    const formattedValue = Number(numericValue).toLocaleString("en-US");

    setGrossEarnings(formattedValue);
  };

  const handlePaybackChange = (event) => {
    const numericValue = event.target.value.replace(/[^0-9]/g, "");

    const formattedValue = Number(numericValue).toLocaleString("en-US");

    setPaybackBonus(formattedValue);
  };

  const handleExpensesChange = (event) => {
    const numericValue = event.target.value.replace(/[^0-9]/g, "");

    const formattedValue = Number(numericValue).toLocaleString("en-US");

    setExpenses(formattedValue);
  };

  const checkTaxableMonth = () => {
    setTaxableLoading(true);
    const token = localStorage.getItem("kadir-user-token");

    if (token) {
      axios
        .get(`${BACKEND_URL}/api/tax-form-month/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setTaxableLoading(false);
          console.log("taxable res:::", res.data);
          if (res.status >= 500) {
            setBadNet(true);
          }
          setTaxableMonth(res.data.next_taxable_month);
        })
        .catch((err) => {
          setTaxableLoading(false);
          console.log(err.message);
        });
    } else {
      setTaxableLoading(false);
      toast.error("Can not verify user for this action, please Login again");
    }
  };

  useEffect(() => {
    checkTaxableMonth();
    if (taxableMonth) {
      convertDate(taxableMonth);
    }
  }, [convertedDate, taxableMonth]);

  return (
    <OperatorsDashboard>
      <LoaderSpinner loading={loading} />
      {taxableLoading ? (
        <div className={`flex justify-center w-full`}>
          <div
            className="animate-spin rounded-full border-t-4 
        border-primary border-solid h-12 w-12 mt-[150px]"
          ></div>
        </div>
      ) : badNet ? (
        <div>Server out of bound</div>
      ) : (
        <div className={`bg-[#fff] rounded-[8px] p-[20px]`}>
          {taxableMonth === null ? (
            <div className={`flex justify-center`}>
              <div className={`space-y-[100px]`}>
                <div className={`flex justify-center`}>
                  <VscEmptyWindow
                    size={100}
                    className={`text-primary text-center`}
                  />
                </div>
                <p className={`md:text-[24px] text-[20px] text-center`}>
                  You have made a submission for this month
                </p>
                <Button
                  text={"See my invoices"}
                  onClick={() => navigate("/operators-invoice")}
                />
              </div>
            </div>
          ) : (
            <>
              {" "}
              <div
                className={`md:flex items-center md:space-x-[20px] space-y-[10px] md:space-y-0`}
              >
                <p className={`text-[30px] font-[600] text-primary`}>
                  {taxableMonth}
                </p>
                <div className={`flex items-center space-x-[10px]`}>
                  <IoMdInformationCircleOutline size={24} />
                  <p className={`text-gray-400`}>
                    Declarations should be submitted at the end of each month.{" "}
                  </p>
                </div>
              </div>
              <div
                className={`md:flex md:items-center mt-[30px] justify-between md:space-x-[40px] space-y-[20px] md:space-y-0`}
              >
                <div className={`flex-1 w-full`}>
                  <label htmlFor="">Total Games This Month</label>
                  <div>
                    <input
                      type="text"
                      className={`outline-none bg-[#F1F1F1] w-full p-[20px] rounded-[8px] mt-[10px]`}
                      value={totalGames}
                      onChange={(e) =>
                        setTotalGames(e.target.value.replace(/[^0-9]/g, ""))
                      }
                    />
                  </div>
                </div>
                <div className={`flex-1 w-full`}>
                  <label htmlFor="">Gross Earnings</label>
                  <div
                    className={`bg-[#F1F1F1] w-full rounded-[8px] mt-[10px] flex items-center pl-[20px]`}
                  >
                    <p>NGN</p>
                    <input
                      type="text"
                      className={`outline-none bg-transparent w-full p-[20px] rounded-[8px]`}
                      value={grossEarnings}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div
                className={`md:flex md:items-center mt-[30px] justify-between md:space-x-[40px] space-y-[20px] md:space-y-0`}
              >
                <div className={`flex-1 w-full`}>
                  <div className={`flex items-center space-x-[20px]`}>
                    <label htmlFor="">Total Payouts</label>
                    <div className={`flex items-center space-x-[10px]`}>
                      <IoMdInformationCircleOutline size={24} />
                      <p className={`text-gray-400 text-[12px]`}>
                        5% of payout will be taxed
                      </p>
                    </div>
                  </div>
                  <div
                    className={`bg-[#F1F1F1] w-full rounded-[8px] mt-[10px] flex items-center pl-[20px]`}
                  >
                    <p>NGN</p>
                    <input
                      type="text"
                      className={`outline-none bg-transparent w-full p-[20px] rounded-[8px]`}
                      value={paybackBonus}
                      onChange={handlePaybackChange}
                    />
                  </div>
                </div>
                <div className={`flex-1 w-full`}>
                  <label htmlFor="">Expenses</label>
                  <div
                    className={`bg-[#F1F1F1] w-full rounded-[8px] mt-[10px] flex items-center pl-[20px]`}
                  >
                    <p>NGN</p>
                    <input
                      type="text"
                      className={`outline-none bg-transparent w-full p-[20px] rounded-[8px]`}
                      value={expenses}
                      onChange={handleExpensesChange}
                    />
                  </div>
                </div>
              </div>
              <div
                className={`md:flex md:items-center mt-[30px] justify-between md:space-x-[40px] space-y-[20px] md:space-y-0`}
              >
                <div className={`flex-1 w-full`}>
                  <label htmlFor="">Upload Bank Statement</label>
                  <div
                    className={`bg-[#F1F1F1] mt-[10px] p-[20px] rounded-[8px] cursor-pointer flex items-center justify-between`}
                    onClick={handleButtonClick}
                  >
                    <p>{selectedFileName ? selectedFileName : "Select File"}</p>
                    <CiFileOn size={24} />
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    accept=".pdf, .doc, .docx, .txt"
                  />
                </div>

                <div className={`flex-1 w-full`}>
                  <label htmlFor="">Total Shops Open</label>
                  <div>
                    <input
                      type="text"
                      className={`outline-none bg-[#F1F1F1] w-full p-[20px] rounded-[8px] mt-[10px]`}
                      value={openShops}
                      onChange={(e) =>
                        setOpenShops(e.target.value.replace(/[^0-9]/g, ""))
                      }
                    />
                  </div>
                </div>
              </div>
              <div
                className={`md:flex md:items-center mt-[30px] justify-between md:space-x-[40px] space-y-[20px] md:space-y-0`}
              >
                <div className={`flex-1 w-full`}>
                  <div className={`flex items-center space-x-[10px]`}>
                    <label htmlFor="">Upload Your Games Data</label>
                    <div className={`flex items-center space-x-[10px]`}>
                      <IoMdInformationCircleOutline size={24} />
                      <p className={`text-gray-400`}>
                        File containing the full data of all games taken
                      </p>
                    </div>
                  </div>
                  <div
                    className={`bg-[#F1F1F1] mt-[10px] p-[20px] rounded-[8px] cursor-pointer flex items-center justify-between`}
                    onClick={handleDataPacketClick}
                  >
                    <p>
                      {dataPacketFileName ? dataPacketFileName : "Select File"}
                    </p>
                    <CiFileOn size={24} />
                  </div>

                  <input
                    type="file"
                    ref={datapacketInputRef}
                    style={{ display: "none" }}
                    onChange={handleDataPacketChange}
                    accept=".pdf, .doc, .docx, .txt"
                  />
                </div>
              </div>
              <div className={`flex`}>
                <div className={`w-full`}>
                  <div className={`mt-[35px]`}>
                    <Button
                      text={"Submit Declaration"}
                      onClick={sendDeclaration}
                      loading={loading}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </OperatorsDashboard>
  );
};

export default OperatorsDeclaration;
