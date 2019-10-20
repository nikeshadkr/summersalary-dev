import React from "react";
import ReactDOM from "react-dom";

const App = ({ test }) => <h1>This is Effort Certification : {test}</h1>;

ReactDOM.render(<App test='Hello World' />, document.getElementById("app"));
