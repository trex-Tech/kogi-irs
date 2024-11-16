import React, { useEffect, useRef, useState } from "react";
import OperatorsDashboard from "../layouts/OperatorsDashboard";
import { useLocation, useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import Button from "../components/Button";
import { convertCurrency } from "../helpers/CurrencyFormatter";
import Logo from "../assets/logo.jpg";
import moment from "moment";
import { BACKEND_URL } from "../../sonfig.service";
import axios from "axios";
import PaystackButtonComponent from "../components/PaystackButton";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { toast } from "react-toastify";

const AgentInvoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reference_code } = location.state;
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [paymentLink, setPaymentLink] = useState(null);
  const [pdfState, setPdfState] = useState(false);
  const componentRef = useRef(null);

  console.log("Due info from state:::", userData);

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

      axios
        .post(
          `${BACKEND_URL}/api/generate-agent-payment-link/${reference_code}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
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
  };

  const downloadAsPdf = () => {
    setPdfState(true);
    if (componentRef.current) {
      toPng(componentRef.current)
        .then((dataUrl) => {
          const pdf = new jsPDF();
          pdf.addImage(dataUrl, "PNG", 0, 0);
          pdf.save(data?.company?.business_name + data?.reference_code);
          setPdfState(false);
          toast.success("Invoice Downloaded");
        })
        .catch((error) => {
          console.error("oops, something went wrong!", error);
        });
    }
  };

  useEffect(() => {
    fetchData();
    getUserData();
  }, []);

  return (
    <OperatorsDashboard>
      <div className={`flex items-center justify-between`}>
        <div
          className={`bg-[#cccccc4a] p-[20px] rounded-full cursor-pointer`}
          onClick={() => navigate(-1)}
        >
          <IoChevronBack size={24} color="#053A19" />
        </div>
      </div>

      {loading ? (
        <div className={`flex justify-center w-full`}>
          <div
            className="animate-spin rounded-full border-t-4 
    border-primary border-solid h-12 w-12 mt-[150px]"
          ></div>
        </div>
      ) : (
        <div className={`space-y-[20px] mt-[20px]`}>
          <div className={`space-y-[20px] mt-[20px]`}>
            <p className={`text-[30px]`}>
              Invoice for {moment().format("MMMM")}
            </p>

            <div
              className={`bg-[#fff] rounded-[8px] ${
                pdfState ? `p-[8px]` : `p-[32px]`
              }`}
              ref={componentRef}
            >
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
                  <p>{data?.company?.business_name}</p>
                  <p className={`text-[12px]`}> Payer ID: KADIRS17838293</p>
                  <p className={`text-[12px]`}>
                    {data?.company?.business_address}
                  </p>
                  <p className={`text-[12px] text-[#4e95ff]`}>
                    {data?.company?.email}
                  </p>
                </div>

                <div className={`text-right`}>
                  <p className={`text-[#4e95ff]`}>
                    BILL ID: <br />
                    {data?.reference_code}
                  </p>
                  <p>
                    Date Billed:{" "}
                    {moment(data?.created_at).format("ddd-mmm-yyy")}
                  </p>
                  <p
                    className={`${
                      data?.payment_status !== "Paid"
                        ? "text-[#a23b3b]"
                        : "text-[#3ed140]"
                    } text-[28px]`}
                  >
                    {data?.payment_status}
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
                    <p>Agent Gaming Taxation</p>
                  </div>
                  <div
                    className={`py-[16px] bg-[#4463b0] w-full text-white basis-[40%] p-[10px] text-right`}
                  >
                    <p>₦ {data?.amount_due}</p>
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
            {data?.payment_status === "Pending" && (
              <div className={`flex`}>
                <button
                  className="bg-primary  text-white font-bold py-2 px-4 rounded w-[100%]"
                  onClick={handlePaymentClick}
                >
                  Proceed to Payment
                </button>
              </div>
            )}
          </div>
          {data?.payment_status === "Pending" && (
            <div className={`flex`}>
              {/* <Button text={"Make Payment"} /> */}
              <button
                className="bg-primary  text-white font-bold py-2 px-4 rounded w-[100%]"
                onClick={handlePaymentClick}
              >
                Proceed to Payment
              </button>
            </div>
          )}
        </div>
      )}
    </OperatorsDashboard>
  );
};

export default AgentInvoice;
