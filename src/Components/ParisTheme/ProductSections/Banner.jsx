import React from "react";

const Banner = () => {
  return (
    <>
      <div className="banners">
        <div
          className="container-fluid my-5"
          style={{
            backgroundImage: "url('https://content.wepik.com/statics/166222367/preview-page0.jpg')", 
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
            height: "400px"
          }}
        ></div>
      </div>
    </>
  );
};

export default Banner;
