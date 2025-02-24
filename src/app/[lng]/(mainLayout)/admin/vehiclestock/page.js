"use client";
import React, { useContext } from "react";
import { AuthProvider } from "@/Helper/AuthContext/AuthContext";
import withAuth from "@/Components/AuthHOC/withAuth";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import I18NextContext from "@/Helper/I18NextContext";

const VehicleStockPage = () => {
  const router = useRouter();
  const { i18Lang } = useContext(I18NextContext);

  const handleSubmit = () => {
    //alert();
  };

  return (
    <div className="container-fluid">
      <div className="row d-flex justify-content-center">
        <div className="col-lg-8 col-12 d-flex justify-content-between align-items-center">
          <div
            className="header text-sm mb-2"
            style={{ fontSize: "x-large", fontWeight: "600" }}
          >
            Vehicle Stock Handover
          </div>
          <a href={`/${i18Lang}/admin/tobesettle`} type="button" > Back</a>
        </div>
      </div>
      <div className="row d-flex justify-content-center">
        <div className="mt-2 mb-3 col-lg-8 col-12 table-responsive">
          <Formik
            initialValues={{
              id: "",
            }}
            onSubmit={handleSubmit}
          >
            {({}) => (
              <Form>
                <div className="row mt-2">
                  <div className="col-12 table-responsive">
                    <table className="table custom-table">
                      <thead>
                        <tr>
                          <th className="p-1">#</th>
                          <th className="p-1">Item&nbsp;Name</th>
                          <th className="p-1">Barcode</th>
                          <th className="p-1">Add Qty</th>
                          <th className="p-1">Sale Qty</th>
                          <th className="p-1">Handover Qty</th>
                          <th className="p-1">GAP</th>
                          <th className="p-1">Handover Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-1">1</td>
                          <td className="p-1">Item Name</td>
                          <td className="p-1">10000001</td>
                          <td className="p-1">
                          <input
                              type="number"
                              className="form-control form-control-sm"
                            />
                          </td>
                          <td className="p-1">
                          <input
                              type="number"
                              className="form-control form-control-sm"
                            />
                          </td>
                          <td className="p-1">
                          <input
                              type="number"
                              className="form-control form-control-sm"
                            />
                          </td>
                          <td className="p-1">
                          <input
                              type="number"
                              className="form-control form-control-sm"
                            />
                          </td>
                          <td className="p-1">
                            <input
                              type="date"
                              className="form-control form-control-sm"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-12 d-flex justify-content-end gap-2">
                    <button className="btn btn-sm bg-secondary text-white d-inline">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-sm btn-secondary theme-bg-color text-white d-inline"
                    >
                      Submit
                    </button>
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

const ProtectedVehicleStockPage = withAuth(VehicleStockPage);

const VehicleStock = () => {
  return (
    <AuthProvider>
      <ProtectedVehicleStockPage />
    </AuthProvider>
  );
};

export default VehicleStock;
