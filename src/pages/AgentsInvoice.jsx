import React, { useEffect, useState } from "react";
import OperatorsDashboard from "../layouts/OperatorsDashboard";
import moment from "moment";
import Logo from "../assets/logo.jpg";
import { convertCurrency } from "../helpers/CurrencyFormatter";
import Button from "../components/Button";
import { FaEye } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../sonfig.service";
import PaystackButtonComponent from "../components/PaystackButton";

const AgentsInvoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [refCode, setRefCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [dueInfo, setDueInfo] = useState();
  const [data, setData] = useState();
  const [listLoading, setListLoading] = useState(false);
  const [paymentList, setPaymentList] = useState();
  const [userData, setUserData] = useState(null);
  const [paymentLink, setPaymentLink] = useState(null);

  console.log("Due info from state:::", dueInfo);

  const handlePaymentClick = () => {
    window.location.href = paymentLink;
  };

  const getUserData = async () => {
    const userData = localStorage.getItem("kadir-user-data");
    if (userData !== null) {
      const parsedUserData = JSON.parse(userData);
      console.log("parsed user data:::", parsedUserData);
      setUserData(parsedUserData);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (location.state?.reference_code) {
      setRefCode(location.state.reference_code);

      const token = localStorage.getItem("kadir-user-token");

      if (token) {
        axios
          .get(
            `${BACKEND_URL}/api/agent-invoice-list/${location.state?.reference_code}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            setLoading(false);
            console.log("Ref Code res:::", res.data);
            setDueInfo(res.data);
          })
          .catch((err) => {
            setLoading(false);
            console.log("ref code err:::", err.message);
          });
      }
    } else {
      setLoading(false);
    }
  }, [refCode, location]);
  const fetchData = () => {
    setLoading(true);
    const token = localStorage.getItem("kadir-user-token");

    if (token) {
      axios
        .get(`${BACKEND_URL}/api/agent-invoice-list/${reference_code}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setLoading(false);
          console.log("Single invoice res:::", res.data);
          setData(res.data);
        })
        .catch((err) => {
          setLoading(false);
          console.log("ref code err:::", err.message);
        });
    }
  };

  useEffect(() => {
    setListLoading(true);
    const token = localStorage.getItem("kadir-user-token");
    if (token) {
      axios
        .get(`${BACKEND_URL}/api/agent-invoice-list/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setListLoading(false);
          console.log("List res:::", res.data);
          setPaymentList(res.data.results);
        })
        .catch((err) => {
          setListLoading(false);
          console.log(err.message);
        });

      axios
        .post(`${BACKEND_URL}/api/generate-agent-payment-link/${refCode}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setLoading(false);
          console.log("payment_link", res.data);
          setPaymentLink(res.data.payment_url);
        })
        .catch((err) => {
          setLoading(false);
          console.log("ref code err:::", err.message);
        });
    }

    getUserData();
  }, [refCode]);

  return (
    <OperatorsDashboard>
      <div
        className={`md:flex md:justify-between md:space-x-[40px] space-y-[20px] md:space-y-0`}
      >
        {refCode !== "" && (
          <div className={`flex-1 md:order-2 md:pl-5 space-y-[20px]`}>
            <p className={`text-[30px]`}>
              Invoice for {moment().format("MMMM")}
            </p>

            <div className={`bg-[#cccccc4f] p-[20px] rounded-[8px]`}>
              <div className={`flex items-center justify-between`}>
                <img src={Logo} alt="" className={`w-[200px]`} />
                <div className={`space-y-[20px]`}>
                  {dueInfo?.payment_status === "Pending" ? (
                    <div
                      className={`border border-red-300 p-[5px] px-[20px] rounded-[6px] text-red-400`}
                    >
                      <p className={`text-center`}>Unpaid</p>
                    </div>
                  ) : (
                    <div
                      className={`border border-green-300 p-[5px] px-[20px] rounded-[6px] text-green-400`}
                    >
                      <p className={`text-center`}>Paid</p>
                    </div>
                  )}
                  <p className={`text-[20px]`}>
                    Investigation -{" "}
                    <span
                      className={`${
                        dueInfo?.status === "Approved" && `text-green-500`
                      } ${dueInfo?.status === "Pending" && `text-orange-500`}
                    ${dueInfo?.status === "Rejected" && `text-red-500`}`}
                    >
                      {dueInfo?.status}
                    </span>
                  </p>
                </div>
              </div>

              <div className={`px-[20px] mt-[20px]`}>
                <ul className="list-disc space-y-[5px]">
                  <li className="list-disc">
                    Total Agent Payout - {dueInfo?.total_agent_payout}
                  </li>
                  <li className="list-disc">
                    Gross Earnings - {convertCurrency(dueInfo?.gross_earnings)}
                  </li>
                  <li className="list-disc">
                    Payouts - {convertCurrency(dueInfo?.bonuses_paid)}
                  </li>
                  <li className="list-disc">
                    Monthly Expenses -{" "}
                    {convertCurrency(dueInfo?.expenses_amount)}
                  </li>
                  <li className="list-disc">
                    Tax on payout - {convertCurrency(dueInfo?.tax_on_payout)}
                  </li>
                </ul>

                <div className={`mt-[20px]`}>
                  <p className={`text-[20px]`}>
                    Total Tax -{" "}
                    <span className={`text-primary font-[600] text-[40px]`}>
                      {/* {convertCurrency(amount.replace(/,/g, ""))} */}
                      {convertCurrency(dueInfo?.amount_due)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div>
              {dueInfo?.payment_status === "Pending" && (
                <button
                  className="bg-primary hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-[100%]"
                  onClick={handlePaymentClick}
                >
                  Proceed to Payment
                </button>
              )}
            </div>
          </div>
        )}

        <div className={`flex-1 md:order-1`}>
          <p className={`text-[30px]`}>Payment History Box</p>
          {listLoading ? (
            <div className={`flex justify-center w-full`}>
              <div
                className="animate-spin rounded-full border-t-4 
          border-primary border-solid h-12 w-12 mt-[150px]"
              ></div>
            </div>
          ) : (
            <div
              className={`bg-white p-[20px] rounded-[8px] mt-[20px] space-y-[30px]`}
            >
              {paymentList?.length < 1 ? (
                <p>You do not have any Payment History yet.</p>
              ) : (
                paymentList?.map((item) => (
                  <div
                    className={`flex items-center justify-between 
           hover:bg-[#cccccc40] cursor-pointer p-[20px] rounded-[6px]`}
                    onClick={() =>
                      navigate("/agents-single-invoice", {
                        state: {
                          reference_code: item.reference_code,
                        },
                      })
                    }
                  >
                    <p>{item.month_year}</p>
                    <FaEye size={22} />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </OperatorsDashboard>
  );
};

export default AgentsInvoice;
