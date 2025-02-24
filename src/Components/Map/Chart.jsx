// components/Chart.js
import React, { useEffect, useState } from "react";
import { Chart as ChartGoogle } from "react-google-charts";
import { getDeliveryType } from "@/Helper/Order/OrderHelper";

const Chart = ({ items }) => {
  const [data, setData] = useState([["Element", "Orders", { role: "style" }]]);
  useEffect(() => {
    //console.log("items", items);
    const FCount = items.filter((item) => item.status === 3).length;
    const SCount = items.filter((item) => item.status === 1).length;
    const ECount = items.filter((item) => item.status === 2).length;
    const BCount = items.filter((item) => item.status === 4).length;

    const updateChartData = [
      ["Element", "Orders", { role: "style" }],
      ["FLASH", FCount, getDeliveryType(3)],
      ["STANDARD", SCount, getDeliveryType(1)],
      ["EXPRESS", ECount, getDeliveryType(2)],
      ["BULLET", BCount, getDeliveryType(4)],
    ];

    //console.log(updateChartData);

    setData(updateChartData);
  }, [items]);

  const options = {
    // title: "Pickpack Orders Chat",
    chartArea: { width: "50%" },
    annotations: {
      alwaysOutside: true,
    },
    legend: { position: "none" },
    // hAxis: {
    //   title: "Order Types",
    // },
    vAxis: {
      title: "Orders",
      viewWindow: {
        min: 0,
      },
      gridlines: {
        count: -1,
        color: "transparent",
      },
    },
  };
  return (
    <>
      <ChartGoogle
        chartType="ColumnChart"
        width="100%"
        height="340px"
        data={data}
        style={{ position: "relative" }}
        options={options}
      />
    </>
  );
};

export default Chart;
