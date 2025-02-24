// components/InfoBar.js
import React from "react";

const InfoBar = ({ isMain }) => {
  return (
    <>
      {isMain ? (
        <div className={`infoBar`}>
          <div className={`point driveThru`}></div>
          {/* Red point */}
          <span className={`label`}>DRIVE THRU</span>
          <span className={`label`}>PICK POINT</span>
          <div className={`point pickPoint`}></div>
          {/* Blue point */}
        </div>
      ) : (
        <div className="infoBarSecound">
          <div className="option">
            <div className="circle red"></div>
            <span className="label">FLASH</span>
          </div>
          <div className="option">
            <div className="circle orange"></div>
            <span className="label">BULLET</span>
          </div>
          <div className="option">
            <div className="circle green"></div>
            <span className="label">EXPRESS</span>
          </div>
          <div className="option">
            <div className="circle blue"></div>
            <span className="label">STANDARD</span>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoBar;
