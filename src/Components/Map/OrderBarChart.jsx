import React from "react";

const ProgressTracker = ({ steps, currentStep }) => {
  // Calculate the left position for the pointer based on the current step
  const pointerPosition = `${(currentStep * 100 / (steps.length))}%`;
  console.log("currentStep", currentStep)
  return (
    <div className="progress-tracker">
      <div className="progress" style={{ height: "20px" }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: "100%" }}
          aria-valuenow="100"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
        {steps.map((step, index) => (
          <div
            key={step}
            className={`step ${index + 1 === currentStep ? "active" : ""}`}
            style={{
              //width: `${100 / steps.length}%`,
              position: "absolute",
              left: `${(index + 1) * (100 / steps.length) /*+ (index == steps.length - 1 ? 10 : 14)*/
                }%`,
            }}
          >
            <span className="step-number" style={{ zIndex: "100" }}>
              {index + 1}
            </span>
          </div>
        ))}
        <div
          className="pointer"
          style={{
            left: pointerPosition,
            position: "absolute",
            marginTop: "20px",
          }}
        >
          <div className="arrow-up" style={{ marginleft: '10px' }}></div>
        </div>
      </div>
      <style jsx>{`
        .progress-tracker { position: relative; }
        .progress-tracker .progress-bar {
          background-color: #ffc107; // Bootstrap warning color
          position: relative;
        }
        .progress-tracker .step .step-number {
          position: absolute;
          top: -30px !important; // Adjust based on the height of the step number
          width: 30px;
          height: 30px;
          line-height: 28px;
          border: 2px solid #ddd;
          border-radius: 50%;
          background-color: #fff;
          color: #333;
          text-align: center;
          transform: translateX(-50%);
          z-index: 1;
        }
        .progress-tracker .step.active .step-number {
          border-color: #28a745; // Bootstrap success color
          color: #28a745;
        }
        .progress-tracker .pointer {
          position: absolute;
          top: 0;
          transition: all 0.5s ease-in-out;
          z-index: 2;
        }
        .progress-tracker .pointer .arrow-up {
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-bottom: 10px solid red; // Arrow color
          position: absolute;
          left: 0;
          transform: translateX(-50%);
        }
      `}</style>
    </div>
  );
};

export default ProgressTracker;

// Usage Example:
// <ProgressTracker steps={['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5', 'Step 6']} currentStep={3} />
