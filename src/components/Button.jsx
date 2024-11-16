import React from "react";

const Button = ({ text, onClick, disabled, loading }) => {
  return (
    <div
      className={`bg-[#0B391C] text-white text-center 
              py-[18px] rounded-[6px] font-[500] cursor-pointer px-[18px] flex justify-center ${
                disabled && `bg-gray-300 text-gray-500 cursor-not-allowed`
              }`}
      onClick={disabled ? null : onClick}
    >
      {loading ? (
        <div className="animate-spin rounded-full border-t-4 border-white border-solid h-6 w-6"></div>
      ) : (
        <p>{text}</p>
      )}
    </div>
  );
};

export const OutlinedButton = ({ text, disabled, onClick, loading }) => {
  return (
    <div
      className={`bg-transparent text-primary text-center 
              py-[18px] rounded-[6px] font-[500] cursor-pointer px-[18px] border border-primary ${
                disabled && `bg-gray-300 text-gray-500 cursor-not-allowed`
              }`}
      onClick={disabled ? null : onClick}
    >
      {loading ? (
        <div className="animate-spin rounded-full border-t-4 border-white border-solid h-6 w-6"></div>
      ) : (
        <p>{text}</p>
      )}
    </div>
  );
};

export default Button;
