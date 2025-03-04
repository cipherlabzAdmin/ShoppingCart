import I18NextContext from "@/Helper/I18NextContext";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";

const DeliveryTable = ({ orders }) => {
  const router = useRouter();
  const { i18Lang } = useContext(I18NextContext);

  const handleNext = (item) => {
    router.push(`/${i18Lang}/admin/handoveritem?id=${item.id}`);
  };

  return (
    <div className="mt-2 col-lg-6 col-12 table-responsive">
      <table className="table custom-table">
        <thead>
          <tr>
            <th className="p-1" rowSpan={2}>
              No
            </th>
            <th className="p-1" rowSpan={2}>
              Delivery No
            </th>
            <th className="p-1" colSpan={2}>
              Time Count
            </th>
            <th className="p-1" rowSpan={2}>
              Pack No
            </th>
            <th className="p-1 text-end" rowSpan={2}>
              Delivery Status
            </th>
          </tr>
          <tr>
            <th className="p-1">Delivery</th>
            <th className="p-1">All</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((item, index) => (
            <tr key={index}>
              <td className="p-1 table-success">{index + 1}</td>
              <td className="p-1">{item.checkoutNo}</td>
              <td className="p-1">5:13</td>
              <td className="p-1">45:20</td>
              <td className="p-1">{item.packingNo}</td>
              <td className="p-1" align="right">
                {item.isHandover ? 
                <span className="badge bg-success">Done</span> : 
                <button
                  onClick={() => handleNext(item)}
                  className="p-1 btn btn-sm bg-warning"
                >
                  Handover
                </button>
}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryTable;
