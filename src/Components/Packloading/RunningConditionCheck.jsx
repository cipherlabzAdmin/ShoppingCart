import axios from "axios";
import { Field } from "formik";
import React, { useState } from "react";
import { toast } from "react-toastify";

const baseUrl = process?.env?.API_BASE_URL;

const RunningConditionCheck = ({ routeId }) => {
  const [isEngineOil, setIsEngineOil] = useState(false);
  const [isAir, setIsAir] = useState(false);
  const [isWater, setIsWater] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isBodyCondition, setIsBodyCondition] = useState(false);
  // CSS Grid style for the Running Condition Check section
  const runningConditionCheckStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", // creates as many columns as needed with a minimum width of 120px
    gridGap: "0.5rem",
    alignItems: "center",
  };

  // Style for the section heading that spans all columns
  const headingStyle = {
    gridColumn: "1 / -1", // spans all columns
    background: "#333",
    color: "#fff",
    padding: "0.5rem",
    margin: "0 0 1rem 0",
    textAlign: "center",
  };

  const handleChange = (item, bool) => {
    switch (item) {
      case 1:
        setIsEngineOil(bool);
        break;
      case 2:
        setIsAir(bool);
        break;
      case 3:
        setIsWater(bool);
        break;
      case 4:
        setIsBreak(bool);
      case 5:
        setIsBodyCondition(bool);
        break;
      default:
        return;
    }
  };
  const handleSubmit = async () => {
    console.log(routeId);
    if(routeId === null){
      toast.error("Please Select Vehicle Number");
      return;
    }
    try {
      const response = await axios({
        method: "POST",
        url: `${baseUrl}services/ecommerce/deliveryRoute/Update`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          Id: parseInt(routeId),
          IsEngineOil: isEngineOil,
          IsAir: isAir,
          IsWater: isWater,
          IsBrake: isBreak,
          IsCondition: isBodyCondition,
        }),
      });
      if(response.data.success){
        toast.success("Running Condition Check Updated Successsfully");
      }
    } catch (error) {
      console.error("Failed to fetch deliveryRoute endpoint:", error);
    } 
  };

  return (
    <div>
      <div className="header ">Running Condition Check</div>
      <form>
        <div style={runningConditionCheckStyle}>
          <div className="d-flex justify-content-between">
            <label htmlFor="engineOil">
              <Field
                type="checkbox"
                className="mt-1 mx-1"
                id="engineOil"
                checked={isEngineOil}
                name="isEngineOil"
                onChange={(e) => handleChange(1, e.target.checked)}
              />{" "}
              Engine Oil
            </label>
          </div>
          <div className="d-flex justify-content-between">
            <label htmlFor="air">
              <Field
                type="checkbox"
                className="mt-1 mx-1"
                id="air"
                name="isAir"
                checked={isAir}
                onChange={(e) => handleChange(2, e.target.checked)}
              />{" "}
              Air
            </label>
          </div>
          <div className="d-flex justify-content-between">
            <label htmlFor="water">
              <Field
                type="checkbox"
                className="mt-1 mx-1"
                id="water"
                name="isWater"
                checked={isWater}
                onChange={(e) => handleChange(3, e.target.checked)}
              />{" "}
              Water
            </label>
          </div>
          <div className="d-flex justify-content-between">
            <label htmlFor="brake">
              <Field
                type="checkbox"
                className="mt-1 mx-1"
                id="brake"
                name="isBrake"
                checked={isBreak}
                onChange={(e) => handleChange(4, e.target.checked)}
              />{" "}
              Brake
            </label>
          </div>
          <div className="d-flex justify-content-between">
            <label htmlFor="bodyCondition">
              <Field
                type="checkbox"
                className="mt-1 mx-1"
                id="bodyCondition"
                name="isCondition"
                checked={isBodyCondition}
                onChange={(e) => handleChange(5, e.target.checked)}
              />{" "}
              Body Condition
            </label>
          </div>
        </div>
        <div className="d-flex mt-2">
          <button type="button" onClick={handleSubmit} className="btn btn-sm btn-secondary theme-bg-color text-white d-inline">
            save
          </button>
        </div>
      </form>
    </div>
  );
};

export default RunningConditionCheck;
