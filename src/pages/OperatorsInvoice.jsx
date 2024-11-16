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
import LoaderSpinner from "../components/Loader";

const OperatorsInvoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [refCode, setRefCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [dueInfo, setDueInfo] = useState();
  const [listLoading, setListLoading] = useState(false);
  const [paymentList, setPaymentList] = useState();
  const [userData, setUserData] = useState(null);
  const [paymentLink, setPaymentLink] = useState(null);

  console.log("Due info from state:::", dueInfo);
  const handlePaymentClick = () => {
    window.location.href = paymentLink;
  };
  console.log("pay", paymentLink);
  const getUserData = async () => {
    const userData = localStorage.getItem("kadir-user-data");
    if (userData !== null) {
      const parsedUserData = JSON.parse(userData);
      console.log("parsed user data:::", parsedUserData);
      setUserData(parsedUserData);
    }
  };

  const fetchData = () => {
    setLoading(true);
    const token = localStorage.getItem("kadir-user-token");

    if (token) {
      axios
        .get(`${BACKEND_URL}/api/agent-invoice-list/${refCode}`, {
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
    setLoading(true);
    if (location.state?.reference_code) {
      setRefCode(location.state.reference_code);

      const token = localStorage.getItem("kadir-user-token");

      if (token) {
        if (refCode) {
          axios
            .get(`${BACKEND_URL}/api/invoice-list/${refCode}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
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
      }
    } else {
      setLoading(false);
    }
  }, [refCode, location]);

  useEffect(() => {
    setListLoading(true);
    const token = localStorage.getItem("kadir-user-token");
    if (token) {
      axios
        .get(`${BACKEND_URL}/api/invoice-list/`, {
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
        .post(`${BACKEND_URL}/api/generate-payment-link/${refCode}/`, {
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
  console.log(dueInfo);

  return (
    <OperatorsDashboard>
      <LoaderSpinner loading={loading} />
      <div
        className={`md:flex md:justify-between md:space-x-[40px] space-y-[20px] md:space-y-0`}
      >
        {refCode !== "" && (
          <>
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
                      Total Games - {dueInfo?.games_staked_amount}
                    </li>
                    <li className="list-disc">
                      Gross Earnings -{" "}
                      {convertCurrency(dueInfo?.gross_earnings)}
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
                  <div className={`flex`}>
                    <button
                      className="bg-primary hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-[100%]"
                      onClick={handlePaymentClick}
                    >
                      Proceed to Payment
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className={`space-y-[20px] mt-[20px]`}>
              <p className={`text-[30px]`}>
                Invoice for {moment().format("MMMM")}
              </p>

              <div className={`bg-[#fff] rounded-[8px] p-[32px]`}>
                <div className={`flex items-center justify-between`}>
                  <img src={Logo} alt="" className={`w-[200px]`} />
                  <div className={`text-right`}>
                    <p className={`text-[24px] w-[300px]`}>
                      Kaduna State Internal
                      <br /> Revenue Service
                    </p>
                    <p className={`text-[12px]`}>
                      Address 17, Some street, Area, State
                    </p>
                    <p>Revenue Code: 1202002904</p>
                  </div>
                </div>
                <div className={`w-full h-[1px] bg-gray-500 my-[20px]`} />

                <div className={`flex justify-between my-[30px]`}>
                  <div>
                    <p className={`text-[12px]`}>BILLED TO: </p>
                    <p>{dueInfo?.company?.business_name}</p>
                    <p className={`text-[12px]`}> Payer ID: KADIRS17838293</p>
                    <p className={`text-[12px]`}>
                      {dueInfo?.company?.business_address}
                    </p>
                    <p className={`text-[12px] text-[#4e95ff]`}>
                      {dueInfo?.company?.email}
                    </p>
                  </div>

                  <div className={`text-right`}>
                    <p className={`text-[#4e95ff]`}>
                      BILL ID: <br />
                      {dueInfo?.reference_code}
                    </p>
                    <p>
                      Date Billed:{" "}
                      {moment(dueInfo?.created_at).format("ddd-mmm-yyy")}
                    </p>
                    <p
                      className={`${
                        dueInfo?.payment_status !== "Paid"
                          ? "text-[#a23b3b]"
                          : "text-[#3ed140]"
                      } text-[28px]`}
                    >
                      {dueInfo?.payment_status}
                    </p>
                  </div>
                </div>

                <div
                  className={` bg-[#e5e5e5] ${
                    pdfState ? `my-[10px]` : `my-[20px]`
                  }`}
                >
                  <div
                    className={`flex items-center justify-between font-[700] p-[16px]`}
                  >
                    <p>S/N</p>
                    <p>DESCRIPTION</p>
                    <p>AMOUNT</p>
                  </div>

                  <div
                    className={`border-t border-t-[#aeaeae] flex justify-between `}
                  >
                    <div
                      className={`py-[16px] bg-[#4463b0] w-full text-white basis-[10%] p-[10px]`}
                    >
                      <p>1</p>
                    </div>
                    <div className={`basis-[60%] p-[10px] text-center`}>
                      <p>Gaming Taxation</p>
                    </div>
                    <div
                      className={`py-[16px] bg-[#4463b0] w-full text-white basis-[40%] p-[10px] text-right`}
                    >
                      <p>₦ {dueInfo?.amount_due}</p>
                    </div>
                  </div>
                </div>

                <div
                  className={`flex items-center justify-center ${
                    pdfState ? `hidden` : `visible`
                  }`}
                >
                  <div
                    className={`bg-[#4463b0] text-white p-[12px] rounded-[8px] cursor-pointer`}
                    onClick={() => downloadAsPdf()}
                  >
                    <p>Download Invoice</p>
                  </div>
                </div>

                <div className={`${pdfState ? `visible` : `hidden`}`}>
                  <p>Thank You!</p>
                </div>
              </div>
              {dueInfo?.payment_status === "Pending" && (
                <div className={`flex`}>
                  <button
                    className="bg-[#4463b0]  text-white font-bold py-2 px-4 rounded w-[100%]"
                    onClick={handlePaymentClick}
                  >
                    Proceed to Payment
                  </button>
                </div>
              )}
            </div>
          </>
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
                      navigate("/operators-single-invoice", {
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

export default OperatorsInvoice;
