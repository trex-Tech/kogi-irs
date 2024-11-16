import React, { useEffect, useState } from "react";
import Dashoard from "../layouts/Dashoard";
import { GiTakeMyMoney } from "react-icons/gi";
import { convertCurrency } from "../helpers/CurrencyFormatter";
import { MdOutlinePayments } from "react-icons/md";
import { FcDebt } from "react-icons/fc";
import axios from "axios";
import { BACKEND_URL } from "../../sonfig.service";
import { FaShopLock, FaPeopleGroup } from "react-icons/fa6";
import Button from "../components/Button";

const AdminOverview = () => {
  const [dashboardData, setDashboardData] = useState();
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = () => {
    setLoading(true);

    const token = localStorage.getItem("kadir-user-token");

    if (token) {
      axios
        .get(`${BACKEND_URL}/api/admin-dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setLoading(false);
          console.log("admin dashboard res:::", res.data);
          setDashboardData(res.data);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <Dashoard>
      <div className={`space-y-[40px]`}>
        <div
          className={`md:flex items-center justify-between md:space-x-[40px] space-y-[20px] md:space-y-0`}
        >
          <div
            className={`bg-white shadow-md p-[20px] 
            ounded-[8px] space-y-[20px] flex-1 relative pb-[100px] rounded-[8px] z-10`}
          >
            <div
              className={`flex justify-center absolute 
              bg-white bottom-[-10px] right-[-20px] rounded-full p-[10px] shadow-md`}
            >
              <FaPeopleGroup size={80} color="#053A19" />
            </div>
            <p className={`text-center text-[22px] text-primary font-[600]`}>
              Number of Operators
            </p>
            <p className={`text-center text-[30px] font-[600]`}>
              {dashboardData?.number_of_operators}
            </p>
          </div>
          <div
            className={`bg-white shadow-md p-[20px] 
            ounded-[8px] space-y-[20px] flex-1 relative pb-[100px] rounded-[8px]`}
          >
            <div
              className={`flex justify-center absolute 
              bg-white bottom-[-10px] right-[-20px] rounded-full p-[10px] shadow-md`}
            >
              <GiTakeMyMoney size={80} color="#053A19" />
            </div>
            <p className={`text-center text-[22px] text-primary font-[600]`}>
              Total Invoice Generated
            </p>
            <p className={`text-center text-[30px] font-[600]`}>
              {convertCurrency(dashboardData?.total_invoice_generated)}
            </p>
          </div>
          <div
            className={`bg-white shadow-md p-[20px] 
            ounded-[8px] space-y-[20px] flex-1 relative pb-[100px] rounded-[8px]`}
          >
            <div
              className={`flex justify-center absolute 
              bg-white bottom-[-10px] right-[-20px] rounded-full p-[10px] shadow-md`}
            >
              <MdOutlinePayments size={80} color="#053A19" />
            </div>
            <p className={`text-center text-[22px] text-primary font-[600]`}>
              Pending Invoice
            </p>
            <p className={`text-center text-[30px] font-[600]`}>
              {convertCurrency(dashboardData?.total_invoice_pending)}
            </p>
          </div>
        </div>

        <div
          className={`md:flex items-center justify-between md:space-x-[40px] space-y-[20px] md:space-y-0`}
        >
          <div
            className={`bg-white shadow-md p-[20px] 
            ounded-[8px] space-y-[20px] flex-1 rounded-[8px]`}
          >
            <p className={`text-center text-[22px] text-primary font-[600]`}>
              Approved Investigations
            </p>
            <p className={`text-center text-[30px] font-[600]`}>
              {dashboardData?.total_approved_tax_forms}
            </p>
            <Button text={"See Investigations"} />
          </div>
          <div
            className={`bg-white shadow-md p-[20px] 
            ounded-[8px] space-y-[20px] flex-1 rounded-[8px]`}
          >
            <p className={`text-center text-[22px] text-primary font-[600]`}>
              Pending Investigations
            </p>
            <p className={`text-center text-[30px] font-[600]`}>
              {dashboardData?.total_pending_tax_forms}
            </p>
            <Button text={"See Investigations"} />
          </div>
          <div
            className={`bg-white shadow-md p-[20px] 
            ounded-[8px] space-y-[20px] flex-1 rounded-[8px]`}
          >
            <p className={`text-center text-[22px] text-primary font-[600]`}>
              Rejected Investigations
            </p>
            <p className={`text-center text-[30px] font-[600]`}>
              {dashboardData?.total_unapproved_tax_forms}
            </p>
            <Button text={"See Investigations"} />
          </div>
        </div>
      </div>
    </Dashoard>
  );
};

export default AdminOverview;
