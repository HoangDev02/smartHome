import React from "react";
import "./screen.css";
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import {getTempHumidity} from '../../redux/api/apiTempHumidity'

function Screen(props) {
  const tempHumidity = useSelector((state) => state.tempHumiditys.tempHumiditys?.tempHumidity);
  const dispatch = useDispatch();
    
  useEffect(() => {
    const interval = setInterval(() => {
      getTempHumidity(dispatch); 
    }, 20000);
  
    return () => clearInterval(interval);
  }, []);

  const temperature = tempHumidity?.temperature || 0;
  const humidity = tempHumidity?.humidity || 0;
  const weather = props.weather || "Cloudy";
  return (
    <div className="screen">
      <div className="temperature">
        {" "}
        <div className="icon">
          <i class="uil uil-temperature-half"></i>
        </div>
        <div className="text">
          <h3>{temperature} °C</h3>
          <p>Temperature</p>
        </div>
      </div>
      <div className="humidity">
        <div className="icon">
          <i class="uil uil-tear"></i>
        </div>
        <div className="text">
          <h3>{humidity}%</h3>
          <p>Humidity</p>
        </div>
      </div>
      <div className="weather">
        <div className="icon">
          <i class="uil uil-cloud"></i>
        </div>
        <p>{weather}</p>
      </div>
    </div>
  );
}

export default Screen;
