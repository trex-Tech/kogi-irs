import React, { useEffect, useState } from "react";
import Dashoard from "../layouts/Dashoard";
import Logo from "../assets/logo.jpg";
import { useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { convertCurrency } from "../helpers/CurrencyFormatter";
import Button from "../components/Button";

const DemandNotice = () => {
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const numericValue = event.target.value.replace(/[^0-9]/g, "");

    const formattedValue = Number(numericValue).toLocaleString("en-US");

    setAmount(formattedValue);
  };

  return (
    <Dashoard>
      <div className={`flex items-center justify-between`}>
        <div
          className={`bg-[#cccccc4a] p-[20px] rounded-full cursor-pointer`}
          onClick={() => navigate(-1)}
        >
          <IoChevronBack size={24} color="#053A19" />
        </div>
      </div>
      <div
        className={`bg-white p-[20px] mt-[20px] rounded-[8px] md:flex
         md:justify-between md:space-x-[30px] space-y-[20px] md:space-y-0`}
      >
        <div className={`flex-1`}>
          <p className={`text-[24px]`}>Total Taxation Amount</p>
          <div
            className={`flex items-center bg-[#ccc4] rounded-[6px] pl-[10px] mt-[20px] h-[60px]`}
          >
            <p>NGN</p>
            <input
              type="text"
              className={`outline-none bg-transparent p-[10px] rounded-[6px] w-full h-full`}
              placeholder="Enter amount"
              value={amount}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className={`flex-1`}>
          <div className={`bg-[#cccccc4f] p-[20px] rounded-[8px]`}>
            <div className={`flex items-center justify-evenly`}>
              <img src={Logo} alt="" className={`w-[200px]`} />
              <p>to</p>
              <p className={`text-[20px] text-primary font-[600]`}>Bet 9ja</p>
            </div>

            <div className={`px-[20px] mt-[20px]`}>
              <ul className="list-disc space-y-[5px]">
                <li className="list-disc">Total Games - 1034</li>
                <li className="list-disc">
                  Gross Earnings - {convertCurrency(563883)}
                </li>
                <li className="list-disc">
                  Payback Bonus - {convertCurrency(563883)}
                </li>
                <li className="list-disc">
                  Monthly Expenses - {convertCurrency(563883)}
                </li>
              </ul>

              <div className={`mt-[20px]`}>
                <p className={`text-[20px]`}>
                  Total Tax -{" "}
                  <span className={`text-primary font-[600] text-[40px]`}>
                    {convertCurrency(amount.replace(/,/g, ""))}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className={`mt-[20px]`}>
            <Button
              text={"Send Demand Notice"}
              disabled={amount === "" || amount === "0"}
            />
          </div>
        </div>
      </div>
    </Dashoard>
  );
};

export default DemandNotice;
