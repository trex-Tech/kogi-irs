import React, { useEffect, useState } from "react";
import Dashoard from "../layouts/Dashoard";
import { useNavigate } from "react-router-dom";
import StatusChipComponent from "../components/StatusChipComponent";
import axios from "axios";
import { BACKEND_URL } from "../../sonfig.service";
import { toast } from "react-toastify";
import moment from "moment";

const AdminBills = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [declarationData, setDeclarationData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const getDeclarations = () => {
    setLoading(true);
    const token = localStorage.getItem("kadir-user-token");

    if (token) {
      axios
        .get(`${BACKEND_URL}/api/tax-submissions/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setLoading(false);
          console.log("declarations:::", res.data);
          setDeclarationData(res.data.results);
        });
    } else {
      setLoading(false);
      toast.error("User not authenticated to view this.");
    }
  };

  const filteredData = declarationData.filter((data) => {
    const companyMatches = data.company.business_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const formIdMatches = data.reference_code
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const statusMatches =
      filterStatus === "all" || data.status.toLowerCase() === filterStatus;

    return companyMatches || formIdMatches;
  });

  useEffect(() => {
    getDeclarations();
  }, []);

  return (
    <Dashoard>
      <div>
        <div>
          <div className="flex space-x-4 mb-4">
            <input
              type="text"
              placeholder="Search by company name or form ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`px-4 py-2 border rounded-md outline-none w-[400px]`}
            />
            {/* <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-2 border rounded-md outline-none`}
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="unapproved">Unapproved</option>
              <option value="pending">Pending</option>
            </select> */}
          </div>
          {loading ? (
            <div className={`flex justify-center w-full`}>
              <div
                className="animate-spin rounded-full border-t-4 
              border-primary border-solid h-12 w-12 mt-[150px]"
              ></div>
            </div>
          ) : (
            <table className="w-full bg-white">
              <thead className="bg-[#F1F1F1]">
                <tr>
                  <th
                    scope="col"
                    className={`px-6 py-[24px] text-xs font-bold text-left 
                  text-gray-500 md:table-cell lg:table-cell 
                  xl:table-cell 2xl:table-cell `}
                    // key={item.id}
                  >
                    Betting Company
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-[24px] text-xs font-bold text-left 
                  text-gray-500 md:table-cell lg:table-cell 
                  xl:table-cell 2xl:table-cell `}
                    // key={item.id}
                  >
                    Form ID
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-[24px] text-xs font-bold text-left 
                  text-gray-500 md:table-cell lg:table-cell 
                  xl:table-cell 2xl:table-cell `}
                    // key={item.id}
                  >
                    Payment Status
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-[24px] text-xs font-bold text-left 
                  text-gray-500 md:table-cell lg:table-cell 
                  xl:table-cell 2xl:table-cell `}
                    // key={item.id}
                  >
                    Investigation Status
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-[24px] text-xs font-bold text-left 
                  text-gray-500 md:table-cell lg:table-cell 
                  xl:table-cell 2xl:table-cell `}
                    // key={item.id}
                  >
                    Date Submitted
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-[24px] text-xs font-bold text-left 
                  text-gray-500 md:table-cell lg:table-cell 
                  xl:table-cell 2xl:table-cell `}
                    // key={item.id}
                  ></th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((data) => (
                  <tr className={`border-b`}>
                    <td className={`px-6 py-[24px] text-[14px] font-normal`}>
                      {data.company.business_name}
                    </td>
                    <td className={`px-6 py-[24px] text-[14px] font-normal`}>
                      {data.reference_code}
                    </td>
                    <td className={`px-6 py-[24px] text-[14px] font-normal`}>
                      <StatusChipComponent status={data.payment_status} />
                    </td>
                    <td className={`px-6 py-[24px] text-[14px] font-normal`}>
                      <StatusChipComponent status={data.status} />
                    </td>
                    <td className={`px-6 py-[24px] text-[14px] font-normal`}>
                      {moment(data.createdAt).format("DD MMMM, YYYY")}
                      <br />
                      <span className={`text-blackSubText`}>
                        At {moment(data.createdAt).format("hh:mm a")}
                      </span>
                      {/* {data.createdAt} */}
                    </td>
                    <td
                      className={`px-6 py-[24px] text-[14px] font-normal cursor-pointer underline`}
                      onClick={() => {
                        navigate(`/admin-bills/${data.reference_code}`, {
                          state: {
                            reference_code: data.reference_code,
                          },
                        });
                      }}
                    >
                      View details
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Dashoard>
  );
};

export default AdminBills;
