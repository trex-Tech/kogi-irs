import React from "react";

const StatusChipComponent = ({ status }) => {
  return (
    <div
      className={`${status === "In-review" && `bg-[#d386221a]`} ${
        status === "Pending" && `bg-[#d386221a]`
      } ${status === "InActive" && `bg-[#d386221a] text-[#D38622]`} ${
        status === "Approved" && `bg-[#0897631a] text-[#019938]`
      } ${status === "Rework" && `bg-[#9797971a] text-[#666D80]`} ${
        status === "Declined" && `bg-[#de12381a] text-[#DE1238]`
      } ${status === "Active" && `bg-[#0897631a] text-[#019938]`} ${
        status === "Complete" && `bg-[#9797971a] text-[#666D80]`
      } ${
        status === "Assigned" && `bg-[#0897631a] text-[#019938]`
      } text-center rounded-[8px] py-[8px]`}
    >
      <p>{status}</p>
    </div>
  );
};

export default StatusChipComponent;
