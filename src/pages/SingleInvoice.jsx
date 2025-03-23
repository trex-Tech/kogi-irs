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
import LoaderSpinner from "../components/Loader";
import { toast } from "react-toastify";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import InvoiceLogo from "../assets/logo.jpg";
import InvoiceTop from "../assets/invoice-top.png";
import InvoiceBottom from "../assets/invoice-bottom.png";
import InvoiceFaded from "../assets/invoice-faded.png";
import No from "../assets/no.png";
import InvoiceTag from "../assets/invoice-tag.png";
import InvoiceQR from "../assets/invoice-qr.jpg";
import { toWords } from "number-to-words";

const SingleInvoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reference_code } = location.state;
  const [data, setData] = useState();
  const [paymentLink, setPaymentLink] = useState(null);
  console.log(paymentLink);
  const [loading, setLoading] = useState(false);
  const [pdfState, setPdfState] = useState(false);
  const componentRef = useRef(null);

  const [userData, setUserData] = useState(null);

  const getUserData = async () => {
    const userData = localStorage.getItem("kadir-user-data");
    if (userData !== null) {
      const parsedUserData = JSON.parse(userData);
      console.log("parsed user data:::", parsedUserData);
      setUserData(parsedUserData);
    }
  };

  const handlePaymentClick = () => {
    window.location.href = paymentLink;
  };

  const editNavigate = () => {
    navigate(`/operators-edit-declaration/${reference_code}`);
  };

  const fetchData = () => {
    setLoading(true);
    const token = localStorage.getItem("kadir-user-token");

    if (token) {
      axios
        .get(`${BACKEND_URL}/api/invoice-list/${reference_code}`, {
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
      setLoading(true);

      axios
        .post(`${BACKEND_URL}/api/generate-payment-link/${reference_code}/`, {
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
  };

  const downloadAsPdf = () => {
    setPdfState(true);
    if (componentRef.current) {
      toPng(componentRef.current)
        .then((dataUrl) => {
          const pdf = new jsPDF("p", "mm", "a4"); // 'p' for portrait, 'a4' for the page size

          // Get the dimensions of A4 page in pixelss
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();

          // Create an image and get the original dimensions
          const img = new Image();
          img.src = dataUrl;
          img.onload = () => {
            const imgWidth = img.width;
            const imgHeight = img.height;

            // Calculate the aspect ratio of the image
            const aspectRatio = imgWidth / imgHeight;

            // Calculate the height of the image when scaled to fit the width of the page
            const scaledHeight = pageWidth / aspectRatio;

            // If the image's scaled height is greater than the page's height, fit it by height instead
            let xOffset = 0;
            let yOffset = 0;
            if (scaledHeight > pageHeight) {
              const scaledWidth = pageHeight * aspectRatio;
              xOffset = (pageWidth - scaledWidth) / 2;
              pdf.addImage(dataUrl, "PNG", xOffset, 0, scaledWidth, pageHeight);
            } else {
              yOffset = (pageHeight - scaledHeight) / 2;
              pdf.addImage(dataUrl, "PNG", 0, yOffset, pageWidth, scaledHeight);
            }

            pdf.save(
              `${data?.company?.business_name}_${data?.reference_code}.pdf`
            );
            setPdfState(false);
            toast.success("Invoice Downloaded");
          };
        })
        .catch((error) => {
          console.error("oops, something went wrong!", error);
          setPdfState(false);
          toast.error("Something went wrong during download.");
        });
    }
  };

  useEffect(() => {
    fetchData();
    getUserData();
  }, []);

  return (
    <OperatorsDashboard>
      <LoaderSpinner loading={loading} />
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
          <div className={`flex items-center justify-between`}>
            <p className={`text-[30px]`}>
              Invoice for {moment().format("MMMM")}
            </p>
            <div className={`flex items-center space-x-[20px]`}>
              <p className={`text-[20px]`}>Payment Status:</p>
              <p
                className={`${
                  data?.payment_status !== "Paid"
                    ? "text-[#a23b3b]"
                    : "text-[#3ed140]"
                } text-[16px]`}
              >
                {data?.payment_status}
              </p>
            </div>
            <div className={`flex items-center space-x-[20px]`}>
              <p className={`text-[20px]`}>Investigation Status:</p>
              <p
                className={`${
                  data?.status === "Pending"
                    ? "text-[#a23b3b]"
                    : "text-[#3ed140]"
                } text-[16px]`}
              >
                {data?.status}
              </p>
            </div>
          </div>

          {/* <div
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
                  Date Billed: {moment(data?.created_at).format("ddd-mmm-yyy")}
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
                  <p>Gaming Taxation</p>
                </div>
                <div
                  className={`py-[16px] bg-[#4463b0] w-full text-white basis-[40%] p-[10px] text-right`}
                >
                  <p>₦ {data?.amount_due.toLocaleString()}</p>
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
          </div> */}

          <div className="bg-white p-[100px] relative z-50" ref={componentRef}>
            <img
              src={InvoiceTop}
              alt=""
              className={`absolute top-0 left-0 w-full`}
            />
            <img
              src={InvoiceBottom}
              alt=""
              className={`absolute bottom-0 right-0 w-full`}
            />
            {/* <img
              src={InvoiceFaded}
              alt=""
              className={`absolute top-[50%] left-[25%] w-[600px] z-[1] opacity-[0.06]`}
            /> */}
            <header className="flex justify-between mt-[80px]">
              <div className={`flex items-center justify-between w-full`}>
                <h1 className="text-[28px] font-[600]">INVOICE</h1>
                <div>
                  <div className={`flex justify-center`}>
                    <img src={InvoiceLogo} alt="" className={`w-[150px]`} />
                  </div>
                  <div className={`flex items-center space-x-[10px]`}>
                    {/* <img src={No} alt="" /> */}
                    <p>Revenue Code:</p>
                    <p className={`text-[30px] text-gray-800 font-[900]`}>
                      1202002904
                    </p>
                  </div>
                  <p className={`mt-[10px]`}>
                    Invoice Date: {moment(data?.date).format("MMMM DD yyyy")}
                  </p>
                </div>
              </div>
              <div>{/* Logo and details */}</div>
            </header>
            <section className="my-[50px] w-full">
              <div className="flex items-center justify-between">
                <div>
                  {/* Bill To */}
                  <p className={`font-[800] text-[24px]`}>BILL TO:</p>
                  <p>{data?.company?.business_name}</p>
                  <p className={`text-[12px]`}>
                    {data?.company?.business_address}
                  </p>
                  <p className={`text-[12px] text-[#4e95ff]`}>
                    {data?.company?.email}
                  </p>
                  Payer ID:{" "}
                  <strong>
                    {data?.company?.id ===
                    "e4c1f5e8-0395-41d3-b1c0-2cba347aa3da"
                      ? "KADIRS110001005"
                      : data?.company?.id ===
                        "9d2fef59-c773-48db-8cc3-06e4d5c6e5d9"
                      ? "KADIRS110001004"
                      : ""}
                  </strong>
                </div>
                <div>
                  {/* From */}
                  <p className={`font-[800] text-[24px]`}>FROM:</p>
                  <p>
                    Kogi State Internal
                    <br /> Revenue Service,
                  </p>
                  <p>Kogi State</p>
                </div>

                {/* <div>
                  <img src={InvoiceQR} alt="" className={`w-[200px]`} />
                </div> */}
              </div>
            </section>
            <section>
              <table className="w-full border-[2px] border-[#16376b]">
                <thead className={`bg-[#16376b] text-white uppercase`}>
                  <tr className={`p-[20px]`}>
                    <th className={`p-[30px]`}>Item</th>
                    <th>Description</th>
                    <th>QTY</th>
                    <th>RATE(NGN)</th>
                    <th>AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={`text-[18px]`}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      1.
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 flex justify-center">
                      ({data?.type}) Gaming Taxation - Total Tax Payout
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      1
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 ">
                      <p>₦ {data?.amount_due.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 flex justify-center">
                      <p>₦ {data?.amount_due.toLocaleString()}</p>
                    </td>
                    {/* Repeat for other columns */}
                  </tr>
                  {/* Repeat rows as necessary */}
                </tbody>
              </table>
            </section>
            <div className={`mb-[100px]`}>
              <footer className="flex justify-end  relative">
                <img
                  src={InvoiceTag}
                  alt=""
                  className={`w-[180px] absolute left-0`}
                />
                <div
                  className={`bg-[#16376b] text-white p-[10px] uppercase text-[30px] flex items-center space-x-[40px]`}
                >
                  <p>Total</p>
                  <p>NGN {data?.amount_due.toLocaleString()}</p>
                </div>
              </footer>

              <div className={`mt-[150px]`}>
                <p className={`capitalize text-[16px] font-[500]`}>
                  <span className={`text-[28px] font-[700]`}>
                    Amount in words:
                  </span>{" "}
                  {data && toWords(data?.amount_due)}
                </p>

                <div className={`flex items-center space-x-[10px] mt-[100px]`}>
                  {/* <a
                    href="https://www.quickteller.com/kadunastategaming"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <p>https://www.quickteller.com/kadunastategaming</p>
                  </a> */}
                  <a
                    href="https://paykaduna.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <p>wwww.paykaduna.com/</p>
                  </a>
                  <a href="https://mailto:info@paykaduna.com">
                    <p>info@paykaduna.com</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className={`flex items-center justify-center space-x-[30px]`}>
            <div
              className={`flex items-center justify-center ${
                pdfState ? `hidden` : `visible`
              }`}
            >
              {/* <div
                className={`bg-[#4463b0] text-white p-[12px] rounded-[8px] cursor-pointer`}
                onClick={() => downloadAsPdf()}
              >
                <p>Download Internal Invoice</p>
              </div> */}
            </div>
            {data?.payment_status === "Pending" && (
              <div className={`flex`}>
                <button
                  className="bg-[#4463b0]  text-white font-bold py-2 px-4 rounded w-[100%]"
                  onClick={handlePaymentClick}
                >
                  Download External Invoice
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </OperatorsDashboard>
  );
};

export default SingleInvoice;
