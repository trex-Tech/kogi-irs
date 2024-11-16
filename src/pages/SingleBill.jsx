import React, { useEffect, useState } from "react";
import Dashoard from "../layouts/Dashoard";
import { IoChevronBack } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import Button, { OutlinedButton } from "../components/Button";
import { convertCurrency } from "../helpers/CurrencyFormatter";
import { CiFileOn } from "react-icons/ci";
import { BACKEND_URL } from "../../sonfig.service";
import axios from "axios";
import StatusChipComponent from "../components/StatusChipComponent";

const SingleBill = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reference_code } = location.state;
  const [declineModal, setDeclineModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState();
  const [approveLoading, setApproveLoading] = useState(false);
  const [reason, setReason] = useState("");

  const getFormDetails = () => {
    setLoading(true);
    const token = localStorage.getItem("kadir-user-token");

    if (token) {
      axios
        .get(`${BACKEND_URL}/api/tax-submissions/${reference_code}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setLoading(false);
          console.log("form details:::", res.data);
          setFormData(res.data);
          // setDeclarationData(res.data.results);
        });
    } else {
      setLoading(false);
      toast.error("User not authenticated to view this.");
    }
  };

  const approveForm = (status, reason_for_rejection) => {
    setApproveLoading(true);

    const token = localStorage.getItem("kadir-user-token");

    const data = {
      status: status,
      reason_for_rejection: reason_for_rejection,
    };

    if (token) {
      axios
        .patch(
          `${BACKEND_URL}/api/approve-tax-submission/${reference_code}/`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setApproveLoading(false);
          console.log("approve response:::", res.data);
          getFormDetails();
        })
        .catch((err) => {
          setApproveLoading(false);
          console.log(er.message);
        });
      setDeclineModal(false);
    }
  };

  useEffect(() => {
    getFormDetails();
  }, []);

  return (
    <Dashoard>
      <div>
        <div
          className={`md:flex items-center justify-between space-y-[20px] md:space-y-0`}
        >
          <div className={`flex`}>
            <div
              className={`bg-[#cccccc4a] p-[20px] rounded-full cursor-pointer`}
              onClick={() => navigate(-1)}
            >
              <IoChevronBack size={24} color="#053A19" />
            </div>
          </div>
          {/* <Button
            text={"Create Demand Notice"}
            onClick={() => navigate(`/admin-bills/${betId}/demand-notice`)}
          /> */}
          {formData?.status === "Approved" ||
          formData?.status === "Declined" ? null : (
            <div className={`flex items-center space-x-[20px]`}>
              <Button
                text={"Approve Tax Form"}
                loading={approveLoading}
                onClick={() => approveForm("Approved", "")}
              />

              <OutlinedButton
                text={"Decline Tax Form"}
                onClick={() => setDeclineModal(true)}
              />
            </div>
          )}
        </div>

        <div
          className={`bg-white p-[20px] mt-[20px] rounded-[8px] md:flex md:justify-between space-y-[20px] md:space-y-0`}
        >
          {loading ? (
            <div className={`flex justify-center w-full`}>
              <div
                className="animate-spin rounded-full border-t-4 
            border-primary border-solid h-12 w-12 mt-[150px]"
              ></div>
            </div>
          ) : (
            <>
              {" "}
              <div className={`space-y-[25px]`}>
                <div className={`space-y-[10px]`}>
                  <p className={`text-[18px] font-[600]`}>
                    Total Games This Month
                  </p>
                  <p className={`text-[16px] font-[500]`}>
                    {formData?.games_staked_amount}
                  </p>
                </div>
                <div className={`space-y-[10px]`}>
                  <p className={`text-[18px] font-[600]`}>
                    Monthly Gross Earnings
                  </p>
                  <p className={`text-[16px] font-[500]`}>
                    {convertCurrency(formData?.gross_earnings)}
                  </p>
                </div>
                <div className={`space-y-[10px]`}>
                  <p className={`text-[18px] font-[600]`}>
                    Monthly Payback Bonus
                  </p>
                  <p className={`text-[16px] font-[500]`}>
                    {convertCurrency(formData?.bonuses_paid)}
                  </p>
                </div>
                <div className={`space-y-[10px]`}>
                  <p className={`text-[18px] font-[600]`}>Monthly Expenses</p>
                  <p className={`text-[16px] font-[500]`}>
                    {convertCurrency(formData?.expenses_amount)}
                  </p>
                </div>
                <div className={`space-y-[10px]`}>
                  <p className={`text-[18px] font-[600]`}>Open Shops</p>
                  <p className={`text-[16px] font-[500]`}>
                    {formData?.open_shops}
                  </p>
                </div>
              </div>
              <div className={`space-y-[20px]`}>
                <div className={`space-y-[10px]`}>
                  <p className={`text-[18px] font-[600]`}>Payment Status</p>

                  <StatusChipComponent status={formData?.payment_status} />
                </div>

                <div className={`space-y-[10px]`}>
                  <p className={`text-[18px] font-[600]`}>
                    Investigation Status
                  </p>

                  <StatusChipComponent status={formData?.status} />
                </div>

                <div>
                  <a
                    href={formData?.data_packets}
                    download={formData?.data_packets}
                    target="_blank"
                  >
                    <Button
                      text={
                        <div className={`flex items-center space-x-[10px]`}>
                          <CiFileOn size={24} /> <p>Download Game Data</p>
                        </div>
                      }
                      // onClick={() => downloadFile(formData?.statement_of_account)}
                    />
                  </a>
                </div>
                <div>
                  <a
                    href={formData?.statement_of_account}
                    download={formData?.statement_of_account}
                    target="_blank"
                  >
                    <Button
                      text={
                        <div className={`flex items-center space-x-[10px]`}>
                          <CiFileOn size={24} /> <p>Download Bank Statement</p>
                        </div>
                      }
                      // onClick={() => downloadFile(formData?.statement_of_account)}
                    />
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {declineModal && (
        <div
          className={`top-0 left-0 absolute bg-[#0008] 
          w-full h-[100vh] flex justify-center items-center px-[16px] md:p-0`}
        >
          <div className={`bg-white md:p-[32px] p-[20px] rounded-[8px]`}>
            <p className={`md:text-[30px] text-[24px] font-[600]`}>
              Decline Tax Form
            </p>
            <p className={`md:w-[450px] text-[#707070c2]`}>
              Please write out the reason for declining this tax form, so the
              company will know what needs to be changed.
            </p>

            <div>
              <textarea
                value={reason}
                name=""
                id=""
                cols="30"
                rows="6"
                className={`outline-none bg-[#cccccc79] 
                w-full my-[10px] rounded-[6px] p-[10px]`}
                onChange={(e) => setReason(e.target.value)}
              ></textarea>

              <div className={`flex items-center space-x-[40px]`}>
                <div className={`flex-1`}>
                  <Button
                    text={"Decline"}
                    onClick={() => approveForm("Unapproved", reason)}
                  />
                </div>
                <div className={`flex-1`}>
                  <OutlinedButton
                    text={"Cancel"}
                    onClick={() => setDeclineModal(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Dashoard>
  );
};

export default SingleBill;
