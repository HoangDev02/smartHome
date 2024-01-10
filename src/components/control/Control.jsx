import React, { useState, useEffect } from "react";
import "./control.css";
import { Container, Row, Col } from "reactstrap";

import Display from "../display/Display";
import { useSelector, useDispatch } from "react-redux";
import { getPans, updatePan , updateLCD} from "../../redux/api/apiPan";
import { useNavigate } from "react-router-dom";

function Control(props) {
  const [type, setType] = useState("");

  const pans = useSelector((state) => state.pans.pans?.pan);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handlePan = async (id, newName, newStatus) => {
    const updateDevice = {
      name: newName,
      status: newStatus,
    };
    console.log("id pan" + id);
    console.log(updateDevice);
    try {
      await updatePan(id, dispatch, updateDevice, navigate); // Gọi action updatePan và chờ cập nhật xong
      getPans(dispatch); // Gọi action getPans để cập nhật danh sách thiết bị sau khi cập nhật thành công
    } catch (error) {
      console.log(error);
    }
  };
  const handleTypeChange = async (e,deviceId,name) => {
    e.preventDefault();
    const updateDevice = {
      name: name,
      type: type
    };
    try {
      await updateLCD(deviceId, dispatch, updateDevice, navigate); // Gọi action updatePan và chờ cập nhật xong
      // getPans(dispatch); // Gọi action getPans để cập nhật danh sách thiết bị sau khi cập nhật thành công
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPans(dispatch);
  }, [dispatch]);
  return (
    <div className="control">
      <div className="container-btn">
        {pans
          ?.filter((device) => ["MANUALLY", "PAN", "LED", "BUTTONFLOOR"].includes(device.name))
          .map((device) => (
            <div
              key={device._id}
              className={`wrapper_btn ${device.status ? "checked" : ""}`}
            >
              <div className="device">
                <label
                  for={`toggle ${device._id}`}
                  className={`button button_${device.name} ${device.status ? "checked" : ""}`}
                >
                  <input
                    className="hidden-checkbox"
                    type="checkbox"
                    checked={device.status}
                    onChange={() =>
                      handlePan(device._id, device.name, !device.status)
                    } // Bật/Tắt trạng thái thiết bị khi nhấn nút
                    id={`toggle ${device._id}`}
                    // id="toggle"
                  />
                  <span class="slider"></span>
                </label>
              </div>
              {device.name !== "MANUALLY" && (
                  <span>
                    <img
                      src={`${device.img}`}
                      className={`${
                        device.name === "FAN" && device.status
                          ? "rotate-animation"
                          : device.name === "LED" && device.status
                          ? "light-animation"
                          : device.name === "BUTTONFLOOR" && device.status
                          ? "light-animation"
                          : ""
                      }`}
                      alt=""
                    />
                  </span>
                )}
              <p className="name_device">{device.name}</p>
              {device.name !== "MANUALLY" && (
                <div className="handmade_btn">
                  <label for={`fanbtn-${device._id}`} className="switch">
                    <div className="powersign"></div>
                  </label>

                  <input
                    className="handmade_button"
                    type="checkbox"
                    checked={device.status}
                    onChange={() =>
                      handlePan(device._id, device.name, !device.status)
                    }
                    id={`fanbtn-${device._id}`} 
                  />
                </div>
              )}
            </div>
            
          ))
          }
      </div>
      {
        pans?.filter((device) => [ "FLAME"].includes(device.name)).map((device) => (
          <div className="sersorBody">
            <Display 
              key={device.id}
              type = {device.type}
            />

          </div>
        ))
      }
                    
    </div>
  );
}

export default Control;
