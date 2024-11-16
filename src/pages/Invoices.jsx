import React, { useRef, useState, useEffect } from "react";
import Dashoard from "../layouts/Dashoard";
import Logo from "../assets/logo.jpg";
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";
import axios from "axios";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../../sonfig.service";

const Invoices = () => {
  const [modal, setModal] = useState(false);
  const [modalId, setModalId] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState();
  const [inputModal, setInputModal] = useState(false);
  const [amount, setAmount] = useState();
  const [pdfState, setPdfState] = useState(false);
  const [invoiceList, setInvoiceList] = useState();

  const BASE_URL = BACKEND_URL;
  const token = localStorage.getItem("kadir-user-token");
  console.log(token);

  const fetchData = async (endpoint, params = {}) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/temp-invoice/`, {
        params: params,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      setInvoiceList(response.data.results);

      return response.data;
    } catch (error) {
      console.error("Error fetching data from backend:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const componentRef = useRef(null);

  const openGenerateModal = () => {
    setModal(true);
  };

  const downloadAsPng = () => {
    if (componentRef.current) {
      toPng(componentRef.current)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "template.png";
          link.click();
        })
        .catch((error) => {
          console.error("oops, something went wrong!", error);
        });
    }
  };

  const downloadAsPdf = () => {
    setPdfState(true);
    updateInvoiceAmount(selectedInvoice.reference_code, amount);
    if (componentRef.current) {
      toPng(componentRef.current)
        .then((dataUrl) => {
          const pdf = new jsPDF();
          pdf.addImage(dataUrl, "PNG", 0, 0);
          pdf.save(
            selectedInvoice.company_name + selectedInvoice.reference_code
          );
          setPdfState(false);
          toast.success("Invoice generated");
          setModal(false);
          fetchData();
        })
        .catch((error) => {
          console.error("oops, something went wrong!", error);
        });
    }
  };

  // const invoiceList = [
  //   {
  //     id: 1,
  //     company_name: "Company 1",
  //     payer_id: "KADIRS17838293",
  //     payer_address: "9 funsho william avenue, Surulere, Lagos",
  //     email: "legal@bet9ja.com",
  //   },
  //   {
  //     id: 2,
  //     company_name: "Company 2",
  //     payer_id: "KADIRS17838293",
  //     payer_address: "9 funsho william avenue, Surulere, Lagos",
  //     email: "legal@bet9ja.com",
  //   },
  //   {
  //     id: 3,
  //     company_name: "Company 3",
  //     payer_id: "KADIRS17838293",
  //     payer_address: "9 funsho william avenue, Surulere, Lagos",
  //     email: "legal@bet9ja.com",
  //   },
  //   {
  //     id: 4,
  //     company_name: "Company 4",
  //     payer_id: "KADIRS17838293",
  //     payer_address: "9 funsho william avenue, Surulere, Lagos",
  //     email: "legal@bet9ja.com",
  //   },
  // ];

  const handleInputChange = (event) => {
    const numericValue = event.target.value.replace(/[^0-9]/g, "");

    const formattedValue = Number(numericValue).toLocaleString("en-US");

    setAmount(formattedValue);
  };
  const updateInvoiceAmount = async (invoiceId, amountDue) => {
    console.log("amount due sent:::", amountDue);
    try {
      const response = await axios.patch(
        `${BASE_URL}/api/update-inv/${invoiceId}/`,
        {
          amount_due: amountDue,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error updating invoice amount:", error);
      throw error;
    }
  };

  return (
    <Dashoard>
      <div className={``}>
        <div className={`space-y-[20px]`}>
          {invoiceList?.map((invoice) => (
            <div
              key={invoice.id}
              className={`border border-gray-300 p-[16px] 
                rounded-[8px] flex items-center justify-between`}
            >
              <p>{invoice.company_name}</p>

              {invoice?.amount_due ? (
                <div
                  className={`bg-primary text-white p-[12px] rounded-[8px] cursor-pointer`}
                  onClick={() => {
                    setModalId(invoice.id);
                    setSelectedInvoice(invoice);
                    openGenerateModal();
                  }}
                >
                  <p>View</p>
                </div>
              ) : (
                <div
                  className={`bg-primary text-white p-[12px] rounded-[8px] cursor-pointer`}
                  onClick={() => {
                    setModalId(invoice.id);
                    setSelectedInvoice(invoice);
                    openGenerateModal();
                  }}
                >
                  <p>Generate</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {modal && (
          <div className={`fixed top-0 left-0 w-full h-full z-10`}>
            <div
              className={`bg-[#00000098] h-full w-full flex justify-center items-center`}
            >
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
                    <p>{selectedInvoice.company_name}</p>
                    <p className={`text-[12px]`}> Payer ID: KADIRS17838293</p>
                    <p className={`text-[12px]`}>
                      {selectedInvoice.company_address}
                    </p>
                    <p className={`text-[12px] text-[#4e95ff]`}>
                      {selectedInvoice.company_email}
                    </p>
                  </div>

                  <div className={`text-right`}>
                    <p className={`text-[#4e95ff]`}>
                      BILL ID: <br />
                      {selectedInvoice.reference_code}
                    </p>
                    <p>Date Billed: {selectedInvoice.created_a}</p>
                    <p className={`text-[#a23b3b]`}>Not Paid</p>
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
                      <p>{selectedInvoice?.description}</p>
                    </div>
                    <div
                      className={`py-[16px] bg-[#4463b0] w-full text-white basis-[40%] p-[10px] text-right`}
                    >
                      {selectedInvoice?.amount_due ? (
                        <p>₦ {selectedInvoice?.amount_due}</p>
                      ) : (
                        <p>₦ {amount}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className={`flex items-center justify-between ${
                    pdfState ? `hidden` : `visible`
                  }`}
                >
                  <div
                    className={`bg-transparent border border-primary text-primary p-[12px] rounded-[8px] cursor-pointer`}
                    onClick={() => {
                      setModal(false);
                      setAmount(0);
                    }}
                  >
                    <p>Cancel</p>
                  </div>
                  {selectedInvoice?.amount_due ? (
                    <div>
                      <div
                        className={`bg-primary text-white p-[12px] rounded-[8px] cursor-pointer`}
                        //onClick={() => setInputModal(true)}
                      >
                        <p>View</p>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`bg-primary text-white p-[12px] rounded-[8px] cursor-pointer`}
                      onClick={() => setInputModal(true)}
                    >
                      <p>Generate</p>
                    </div>
                  )}
                </div>

                <div className={`${pdfState ? `visible` : `hidden`}`}>
                  <p>Thank You!</p>

                  <div
                    className={`mt-[20px] border-l-2 border-l-[#4463b0] p-[3px] text-[12px]`}
                  >
                    <p>NOTICE:</p>
                    <p className={`text-[8px]`}>
                      3% daily interest on failure to pay by 14th of the month
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {inputModal && (
          <div className={`fixed top-0 left-0 w-full h-full z-20`}>
            <div
              className={`w-full h-full bg-[#00000076] flex justify-center items-center`}
            >
              <div className={`bg-[#fff] p-[32px] rounded-[8px]`}>
                <p>Input Tax Amount</p>
                <div
                  className={`flex items-center border border-primary p-[10px] 
                    space-x-[10px] rounded-[8px] my-[20px]`}
                >
                  <p>₦</p>
                  <input
                    type="text"
                    name=""
                    id=""
                    className={`outline-none`}
                    value={amount}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={`space-y-[20px]`}>
                  <div
                    className={`bg-primary text-white p-[12px] rounded-[8px] cursor-pointer flex justify-center`}
                    onClick={() => {
                      if (amount === 0 || amount === undefined) {
                        alert("Please set amount");
                      } else {
                        setInputModal(false);

                        downloadAsPdf();
                      }
                    }}
                  >
                    <p>Generate and Download</p>
                  </div>
                  <div
                    className={`bg-transparent border border-primary text-primary 
                        p-[12px] rounded-[8px] cursor-pointer flex justify-center`}
                    onClick={() => setInputModal(false)}
                  >
                    <p>Cancel</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Dashoard>
  );
};

export default Invoices;
