"use client";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import I18NextContext from "@/Helper/I18NextContext";
import { FaCheckCircle, FaCircleNotch, FaTruck, FaBoxOpen } from "react-icons/fa";

const TrackingPage = () => {
  const router = useRouter();
  const { i18Lang } = useContext(I18NextContext);

  const status = 3; // This should be dynamic (1: ORDER PLACED, 2: PROCESSING, 3: IN TRANSIT, 4: DELIVERED)
  const stages = [
    { id: 1, label: "ORDER PLACED", date: "01st of April 2025", icon: <FaCheckCircle /> },
    { id: 2, label: "PROCESSING", date: "02nd of April 2025", icon: <FaCircleNotch /> },
    { id: 3, label: "IN TRANSIT", date: "03rd of April 2025", icon: <FaTruck /> },
    { id: 4, label: "DELIVERED", date: "04th of April 2025", icon: <FaBoxOpen /> },
  ];

  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(1);
  const [animatingLine, setAnimatingLine] = useState(null); // This will handle the animated lines between stages

  useEffect(() => {
    if (status === 1) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 33) setDirection(-1);
          if (prev <= 0) setDirection(1);
          return prev + direction * 0.5;
        });
      }, 50);
      setAnimatingLine(1);
      return () => clearInterval(interval);
    } else if (status === 2) {
      let progressValue = 0;
      const interval = setInterval(() => {
        if (progressValue >= 66) {
          clearInterval(interval);
          setAnimatingLine(2);
        } else {
          progressValue += 0.5;
          setProgress(progressValue);
        }
      }, 20);
      return () => clearInterval(interval);
    } else if (status === 3) {
      let progressValue = 66;
      const interval = setInterval(() => {
        if (progressValue >= 100) {
          clearInterval(interval);
          setAnimatingLine(3);
        } else {
          progressValue += 0.5;
          setProgress(progressValue);
        }
      }, 20);
      return () => clearInterval(interval);
    } else {
      setProgress(100);
      setAnimatingLine(4);
    }
  }, [status, direction]);

  return (
    <div className="container-fluid">
      <div className="row d-flex my-3 justify-content-center">
        <div className="col-lg-8 col-12">
          <div className="row">
            <div className="col-12 d-flex justify-content-between">
              <div className="header text-sm mb-2" style={{ fontSize: "x-large", fontWeight: "600" }}>
                Track Your Order
              </div>
              <a href={`/${i18Lang}/theme/paris`} type="button">Back</a>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-container d-flex align-items-center position-relative my-4 w-100">
            <div className="progress-line position-absolute w-100 bg-warning" style={{ height: "5px", zIndex: 1, borderRadius: "2px", left: 0, right: 0 }}></div>
            {/* Animate progress bar */}
            <div className="progress-line position-absolute bg-success" style={{
              height: "5px", zIndex: 2, width: `${progress}%`, transition: "width 0.3s linear", borderRadius: "2px", left: 0
            }}></div>
            {stages.map((stage, index) => (
              <div key={stage.id} className="position-absolute text-center" style={{
                left: `${(index / (stages.length - 1)) * 100}%`, transform: "translateX(-50%)", zIndex: 3
              }}>
                <div className={`progress-point d-flex align-items-center justify-content-center rounded-circle 
                  ${status >= stage.id ? "bg-success text-white" : "bg-secondary text-white"}`}
                  style={{
                    width: "40px", height: "40px", fontSize: "20px", transition: "background 0.3s ease-in-out",
                    border: status >= stage.id ? "2px solid #28a745" : "2px solid #6c757d"
                  }}>
                  {stage.icon}
                </div>
              </div>
            ))}
            {/* Animating lines between stages */}
            {animatingLine > 0 && (
              <div className={`progress-line position-absolute bg-info`} style={{
                height: "5px", zIndex: 3, left: `${(animatingLine - 1) / (stages.length - 1) * 100}%`,
                right: `${(4 - animatingLine) / (stages.length - 1) * 100}%`, animation: "line-animate 3s infinite linear"
              }}></div>
            )}
          </div>

          {/* Stages with Dates */}
          <div className="row">
            {stages.map((stage) => (
              <div key={stage.id} className="col-lg-3 col-md-6 col-12">
                <div className={`card border text-center p-3 ${status >= stage.id ? "border-success" : "border-secondary"}`}>
                  <h4 style={{ fontWeight: "bold", color: status >= stage.id ? "green" : "gray" }}>
                    {stage.label}
                  </h4>
                  <p className="m-0 mt-3 text-secondary">{stage.date}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Details Section */}
          <div className="order-details mt-4">
            <h5>Ordered Items</h5>
            <div className="ordered-items">
              {/* Example of ordered items - this should be dynamic based on the order */}
              <div className="item">
                <p>Product 1</p>
                <p>Quantity: 2</p>
              </div>
              <div className="item">
                <p>Product 2</p>
                <p>Quantity: 1</p>
              </div>
            </div>
            <div className="order-summary mt-3">
              <p><strong>Total Price:</strong> $200</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
