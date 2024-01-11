import "./App.css";
import Layout from "./components/layout/Layout";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from "../src/pages/home/Home";
import Header from "./components/header/Header";
import Login from "./components/Login/Login"
import Register from "./components/Register/Register"
import NavigationBar from "./pages/NavigationBar";
function App() {
  return (
    <Router>
    <Header />
    <div className="App"> 
      <Routes>
        <Route path="/" element={<NavigationBar><Home/></NavigationBar>}/>
        <Route path="/login" element={ <Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
    {/* <Footer/> */}
  </Router>

  );
}

export default App;
