import React, { useEffect, useState } from "react";
import OperatorsDashboard from "../layouts/OperatorsDashboard";
import Button from "../components/Button";
import { CiFileOn } from "react-icons/ci";
import axios from "axios";
import { BACKEND_URL } from "../../sonfig.service";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

const OperatorProfile = () => {
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [numberOfAgents, setNumberOfAgents] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  const getUserData = async () => {
    const userData = localStorage.getItem("kadir-user-data");
    if (userData !== null) {
      const parsedUserData = JSON.parse(userData);
      //   console.log("parsed user data:::", parsedUserData);
      setUserData(parsedUserData);
    }
  };

  const getProfile = async () => {
    setLoading(true);
    const token = localStorage.getItem("kadir-user-token");
    if (token !== null) {
      axios
        .get(`${BACKEND_URL}/accounts/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setLoading(false);
          console.log(res.data);
          setUserData(res.data);
        });
    }
  };

  const updateNumber = async () => {
    setUpdateLoading(true);

    const token = localStorage.getItem("kadir-user-token");
    if (token !== null) {
      const data = {
        no_of_agents: numberOfAgents,
      };
      axios
        .patch(`${BACKEND_URL}/accounts/update-profile/`, data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUpdateLoading(false);
          if (res.status === 200 || res.status === 201) {
            console.log(res.data);
            toast.success("Updated successfully");
            setUpdateModal(false);
            getProfile();
          } else {
            toast.error(res.data.message);
          }
        });
    }
  };

  useEffect(() => {
    getUserData();
    getProfile();
  }, []);

  return (
    <OperatorsDashboard>
      <div
        className={`bg-white p-[20px] mt-[20px] rounded-[8px]
        md:flex md:justify-between space-y-[20px] md:space-y-0`}
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
            <div className={`space-y-[25px]`}>
              <div className={`space-y-[10px]`}>
                <p className={`text-[18px] font-[600]`}>Name of Company</p>
                <p className={`text-[16px] font-[500]`}>
                  {userData?.business_name}
                </p>
              </div>

              <div className={`space-y-[10px]`}>
                <p className={`text-[18px] font-[600]`}>Name of Director</p>
                <p className={`text-[16px] font-[500]`}>
                  {userData?.director_first_name} {userData?.director_last_name}
                </p>
              </div>

              <div className={`space-y-[10px]`}>
                <p className={`text-[18px] font-[600]`}>Email</p>
                <p className={`text-[16px] font-[500]`}>{userData?.email}</p>
              </div>

              <div className={`space-y-[10px]`}>
                <p className={`text-[18px] font-[600]`}>Phone Number</p>
                <p className={`text-[16px] font-[500]`}>
                  {userData?.phone_number}
                </p>
              </div>

              <div className={`space-y-[10px]`}>
                <p className={`text-[18px] font-[600]`}>
                  Number of Available Agents
                </p>
                <p className={`text-[16px] font-[500]`}>
                  {userData?.no_of_agents}
                </p>
              </div>
            </div>

            <div className={`space-y-[20px]`}>
              <div>
                <a
                  href={userData?.document}
                  download={userData?.document}
                  target="_blank"
                >
                  <Button
                    text={
                      <div className={`flex items-center space-x-[10px]`}>
                        <CiFileOn size={24} /> <p>Download CAC</p>
                      </div>
                    }
                    // onClick={() => downloadFile(formData?.statement_of_account)}
                  />
                </a>
              </div>
              <div>
                <a
                  // href={formData?.statement_of_account}
                  // download={formData?.statement_of_account}
                  target="_blank"
                >
                  <Button
                    text={
                      <div className={`flex items-center space-x-[10px]`}>
                        <p>Update Number of Agent</p>
                      </div>
                    }
                    onClick={() => setUpdateModal(true)}
                  />
                </a>
              </div>
            </div>
          </>
        )}

        {updateModal && (
          <div className={`absolute top-0 left-0 w-[100vw] h-[100vh]`}>
            <div
              className={`w-full h-full bg-[#00000081] flex justify-center items-center`}
            >
              <div
                className={`bg-[#fff] p-[20px] rounded-[8px] w-[90%] md:w-[500px] space-y-[20px]`}
              >
                <div className={`flex justify-end`}>
                  <IoClose
                    size={30}
                    className={`cursor-pointer`}
                    onClick={() => setUpdateModal(false)}
                  />
                </div>
                <p className={`text-center md:text-[22px] font-[600]`}>
                  Update Available Number of Agents
                </p>
                <input
                  type="text"
                  className={`w-full outline-none border border-gray-400 p-[10px] rounded-[6px]`}
                  placeholder="Number of agents"
                  value={numberOfAgents}
                  onChange={(e) =>
                    setNumberOfAgents(e.target.value.replace(/[^0-9]/g, ""))
                  }
                />
                <Button
                  text={"Update"}
                  loading={updateLoading}
                  onClick={() => updateNumber()}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </OperatorsDashboard>
  );
};

export default OperatorProfile;
