import React from "react";
import Header from "../header/Header";
import Routers from "../../routers/Routers";
// import Footer from "../footer/Footer";
// import Routers from "../../routers/Routers";
// import ScrollUp from "../scrollup/ScrollUp";

function Layout(props) {
  return (
    <>
      <Header />
      <div>
        <Routers />
      </div>
      {/* <Footer /> */}
      {/* <ScrollUp /> */}
    </>
  );
}

export default Layout;
