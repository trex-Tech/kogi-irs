import React, { useEffect, useState } from "react";
import OperatorsDashboard from "../layouts/OperatorsDashboard";
import axios from "axios";
import { BACKEND_URL } from "../../sonfig.service";
import { IoMdInformationCircleOutline } from "react-icons/io";
import Button from "../components/Button";
import { VscEmptyWindow } from "react-icons/vsc";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AgentsDeclaration = () => {
  const [taxableLoading, setTaxableLoading] = useState(false);
  const [taxableMonth, setTaxableMonth] = useState("");
  const [payoutValue, setPayoutValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [convertedDate, setConvertedDate] = useState("");
  const navigate = useNavigate();

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

  console.log(convertedDate);

  const handlePaybackChange = (event) => {
    const numericValue = event.target.value.replace(/[^0-9]/g, "");

    const formattedValue = Number(numericValue).toLocaleString("en-US");

    setPayoutValue(formattedValue);
  };

  const checkTaxableMonth = () => {
    setTaxableLoading(true);
    const token = localStorage.getItem("kadir-user-token");

    if (token) {
      axios
        .get(`${BACKEND_URL}/api/agent-tax-form-month/`, {
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

  const sendDeclaration = () => {
    setLoading(true);
    convertDate(taxableMonth);
    console.log("date", convertedDate);
    const newdate = convertDate(taxableMonth);
    console.log(newdate);

    const token = localStorage.getItem("kadir-user-token");

    if (payoutValue === "") {
      setLoading(false);
      toast.error("No field can be empty");
    } else {
      const data = {
        total_agent_payout: Number(payoutValue.replace(/,/g, "")),
        date: convertedDate,
      };
      if (token) {
        axios
          .post(`${BACKEND_URL}/api/agent-tax-submissions/`, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setLoading(false);
            console.log("Declaration res:::", res.data);
            toast.success("Your declaration has been sent successfully");
            setPayoutValue("");
            navigate(`/agents-invoice`, {
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
              toast.error("Failed to send");
            }
          });
      } else {
        setLoading(false);
        toast.error("Can't validate user, token not found");
      }
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
      {taxableLoading ? (
        <div className={`flex justify-center w-full`}>
          <div
            className="animate-spin rounded-full border-t-4 
      border-primary border-solid h-12 w-12 mt-[150px]"
          ></div>
        </div>
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
                  onClick={() => navigate("/agents-invoice")}
                />
              </div>
            </div>
          ) : (
            <>
              <div
                className={`md:flex items-center md:space-x-[20px] space-y-[10px] md:space-y-0`}
              >
                <p className={`text-[30px] font-[600] text-primary`}>
                  {taxableMonth}
                </p>
                <div className={`flex items-center space-x-[10px]`}>
                  <IoMdInformationCircleOutline size={24} />
                  <p className={`text-gray-400`}>
                    5% of your agent tax declarations will be deducted.
                  </p>
                </div>
              </div>

              <div className={`flex w-full mt-[40px]`}>
                <div className={`flex-1`}>
                  <div className={`flex items-center space-x-[20px]`}>
                    <label htmlFor="">Total Agent Payouts</label>
                  </div>
                  <div
                    className={`bg-[#F1F1F1] w-full rounded-[8px] mt-[10px] flex items-center pl-[20px]`}
                  >
                    <p>NGN</p>
                    <input
                      type="text"
                      className={`outline-none bg-transparent w-full p-[20px] rounded-[8px]`}
                      value={payoutValue}
                      onChange={handlePaybackChange}
                    />
                  </div>
                </div>
                <div className={`flex-1`}></div>
              </div>
              <div className={`flex`}>
                <div className={`w-full flex-1`}>
                  <div className={`mt-[35px]`}>
                    <Button
                      text={"Submit Declaration"}
                      onClick={sendDeclaration}
                      loading={loading}
                    />
                  </div>
                </div>
                <div className={`flex-1`} />
              </div>
            </>
          )}
        </div>
      )}
    </OperatorsDashboard>
  );
};

export default AgentsDeclaration;
