import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FixedComponent from "./Components/FixedComponent/FixedComponent";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<FixedComponent />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;