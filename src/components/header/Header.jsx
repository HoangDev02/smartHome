import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../redux/api/apiUser";
import { logoutSuccess } from "../../redux/authSlice";
import { createAxios } from "../../redux/createInstance";

import "./header.css";
import { Container, Row } from "reactstrap";
function Header(props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const id = user?._id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, logoutSuccess);
  const [currentTime, setCurrentTime] = useState(new Date());
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleLogout = () => {
    logOut(dispatch, id, navigate, accessToken, axiosJWT);
    // console.log(user);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <header className="header">
      <Container>
        <Row>
          <div className="nav__wrapper">
            <div className="logo">
              {/* <img src={logo} alt="" /> */}
              <i class="uil uil-adobe"></i>
              <Link to="/" className="">
                <h1>Smart Office</h1>
                {/* <p>Since 1989</p> */}
              </Link>
            </div>
            <div className="date-time">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="nav__icons">
              <span className="n__icon">
                <i class="uil uil-bell"></i>
                <span className="notification"> 2</span>
              </span>
              {user ? (
                <>
                  <span className="navbar-username bg-white">
                    Hi, {user.username}
                  </span>
                  <Link
                    to="/logout"
                    className="navbar-logout bg-white"
                    onClick={handleLogout}
                  >
                    Log out
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="navbar-link bg-white">
                    Login
                  </Link>
                  <Link to="/register" className="navbar-link bg-white">
                    Register
                  </Link>
                </>
              )}
            </div>
            <div className="mobile__menu">
              <span onClick={() => toggleMenu()}>
                <i class={isMenuOpen ? "uil uil-multiply" : "uil uil-bars"}></i>
              </span>
              {isMenuOpen && (
                <div className="mobile-menu">
                  {user ? (
                    <>
                      <span className="navbar-username bg-white">
                        Hi, {user.username}
                      </span>
                      <Link
                        to="/logout"
                        className="navbar-logout bg-white"
                        onClick={handleLogout}
                      >
                        Log out
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="navbar-link bg-white">
                        Login
                      </Link>
                      <Link to="/register" className="navbar-link bg-white">
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
}

export default Header;
