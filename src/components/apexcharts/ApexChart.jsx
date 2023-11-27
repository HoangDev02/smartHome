import React, {useEffect, useState} from "react";
import Chart from "react-apexcharts";
import "./styles.css";
import {getTempHumiditys} from '../../redux/api/apiTempHumidity'
import { useSelector, useDispatch } from 'react-redux';

function ApexChart() {
  const temp = useSelector((state) => state.tempHumiditys.temps?.temp);
  const tempHumidity = useSelector((state) => state.tempHumiditys.tempHumiditys?.tempHumidity);
  const [predictedTemperatures, setPredictedTemperatures] = useState([]);
  const dispatch = useDispatch();
  const timestamps = temp.map(tempData => tempData.date); 

  const dates = timestamps.map(timestamp => {
    const date = new Date(Date.parse(timestamp));
    return date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  });

  useEffect(() => {
    const interval = setInterval(() => {
      getTempHumiditys(dispatch);
      // Add data fetching for predictions
      // fetchTemperaturePredictions();
    }, 100000);
  
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    options: {
      chart: {
        id: "temperature-chart",
      },
      xaxis: {
        categories: temp ? dates : [],
      },
      yaxis: {
        title: {
          text: "Temperature (°C)",
        },
      },
    },
    series: [
      {
        name: "Temperature",
        data: temp ? temp.map((tempData) => tempData.predicted_temperature) : [],
      },
    ],
  };

  // Dự đoán nhiệt độ cảnh báo và lời khuyên
  const predictedTemp = tempHumidity ? tempHumidity.temperature : []; // Đây là giả định, bạn cần tính toán dự đoán thực tế
  let alertMessage = "";
  let adviceMessage = "";

  if (predictedTemp > 35) {
    alertMessage = "Cảnh báo: Nhiệt độ quá cao!";
    adviceMessage = "Hãy đảm bảo bạn duy trì sự mát mẻ và uống nhiều nước.";
  } else if (predictedTemp < 20) {
    alertMessage = "Cảnh báo: Nhiệt độ quá thấp!";
    adviceMessage = "Hãy mặc ấm và tránh ra khỏi nhà nếu không cần thiết.";
  } else {
    alertMessage = "Nhiệt độ trong khoảng bình thường.";
    adviceMessage = "Hãy tiếp tục thực hiện các hoạt động thông thường.";
  }

  return (
    <div>
      <div className="temperature-chart">
        {/* <h2>Temperature Chart</h2> */}
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="line"
          height="350"
          width="700"
        />
      </div>
      <div className="temperature-alert">
        <h3>{alertMessage}</h3>
        <p>{adviceMessage}</p>
    

      </div>
    </div>
  );
}
export default ApexChart;
