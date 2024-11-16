import { useNavigate } from "react-router-dom";
import Button, { OutlinedButton } from "./Button";

export const LogoutModal = ({ onCancel }) => {
  const navigate = useNavigate();
  return (
    <div className={`relative`}>
      <div
        className={`fixed z-[1000] bg-[#11111180] w-[100vw] h-[100vh] 
    top-0 left-0 flex justify-center items-center font-inter px-[20px] md:px-0`}
      >
        <div className={`bg-[#fff] p-[20px] md:p-[40px] rounded-md relative`}>
          <p className={`text-[20px] md:text-[28px]`}>
            Are you sure you want to log out?
          </p>
          <p>You can always log back in at any time.</p>

          <div className={`flex space-x-[20px] mt-[40px]`}>
            <div className={`flex-1`}>
              <Button
                text={"Logout"}
                onClick={() => {
                  localStorage.removeItem("kadir-user-token");
                  localStorage.removeItem("kadir-user-data");
                  navigate("/");
                }}
              />
            </div>
            <div className={`flex-1`}>
              <OutlinedButton text={"Cancel"} onClick={onCancel} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
