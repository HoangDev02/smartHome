import React from "react";
import Screen from "../../components/screen/Screen";
import { Container, Row, Col } from "reactstrap";
import "./home.css";
import Control from "../../components/control/Control";
import ApexChart from "../../components/apexcharts/ApexChart";
import Helmet from "../../components/helmet/Helmet";
function Home(props) {
  return (
    <Helmet title={"Home"}>
    <section className="hero__section" id="home">
      <div className="container-left">
        <Col lg="6" md="6">
          <Screen />
        </Col>
        <Col lg="6" md="6">
          <Control />
        </Col>
      </div>
      <div className="container-right">
        <Col>
          <ApexChart />
        </Col>
      </div>
    </section>
    </Helmet>
  );
}

export default Home;
