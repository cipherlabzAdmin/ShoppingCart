"use client";
import React, { useContext } from "react";
import { AuthProvider } from "@/Helper/AuthContext/AuthContext";
import withAuth from "@/Components/AuthHOC/withAuth";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import I18NextContext from "@/Helper/I18NextContext";

const ToBeSettlePage = () => {
  const router = useRouter();
  const { i18Lang } = useContext(I18NextContext);

  const handleSubmit = () => {
    //alert();
  };
  const handleReturnStock = () => {
    router.push(`/${i18Lang}/admin/returnstock`);
  };
  const handleVehicleStock = () => {
    router.push(`/${i18Lang}/admin/vehiclestock`);
  };
  const handleDownPayment = () => {
    router.push(`/${i18Lang}/admin/downpayment`);
  };

  return (
    <div className="container-fluid">
      <div className="row d-flex justify-content-center">
        <div className="col-lg-6 col-12">
          <div
            className="header text-sm mb-2"
            style={{ fontSize: "x-large", fontWeight: "600" }}
          >
            To Be Settle
          </div>
        </div>
      </div>
      <div className="row d-flex justify-content-center">
        <div className="mt-2 mb-3 col-lg-6 col-12 table-responsive">
          <Formik
            initialValues={{
              id: "",
            }}
            onSubmit={handleSubmit}
          >
            {({}) => (
              <Form>
                <div className="row mt-2">
                  <div className="col-6 d-flex align-items-center">
                    <label>Delivery Officer Name</label>
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="form-control border-secondary form-control-sm"
                      placeholder="Please Enter"
                    />
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-6 d-flex align-items-center">
                    <label>Vehicle Number</label>
                  </div>
                  <div className="col-6">
                    <select className="form-control border-secondary form-control-sm">
                      <option disabled selected>Please Select</option>
                    </select>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-6 d-flex align-items-center">
                    <label>Route</label>
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="form-control border-secondary form-control-sm"
                      placeholder="Please Enter"
                    />
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-6 d-flex align-items-center">
                    <label>Return Stock Handover</label>
                  </div>
                  <div className="col-6">
                    <button onClick={handleReturnStock} type="button" className="btn btn-sm bg-success text-white d-inline">Click here</button>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-6 d-flex align-items-center">
                    <label>Vehicle Stock Handover</label>
                  </div>
                  <div className="col-6">
                    <button onClick={handleVehicleStock} type="button" className="btn btn-sm bg-success text-white d-inline">Click here</button>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-6 d-flex align-items-center">
                    <label>Down Payment Handover</label>
                  </div>
                  <div className="col-6">
                    <button onClick={handleDownPayment} type="button" className="btn btn-sm bg-success text-white d-inline">Click here</button>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-12 d-flex justify-content-end gap-2">
                  <button className="btn btn-sm bg-secondary text-white d-inline">Cancel</button>
                  <button type="submit" className="btn btn-sm btn-secondary theme-bg-color text-white d-inline">Submit</button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

const ProtectedToBeSettlePage = withAuth(ToBeSettlePage);

const ToBeSettle = () => {
  return (
    <AuthProvider>
      <ProtectedToBeSettlePage />
    </AuthProvider>
  );
};

export default ToBeSettle;
