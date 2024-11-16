import React, { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const LoaderSpinner = ({ loading }) => {
  const [color] = useState("#000");

  const overlayStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  };

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "#0D361B",
  };

  return (
    <>
      {loading && (
        <div style={overlayStyles}>
          <ClipLoader
            color={color}
            loading={loading}
            cssOverride={override}
            size={60}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
    </>
  );
};

export default LoaderSpinner;
