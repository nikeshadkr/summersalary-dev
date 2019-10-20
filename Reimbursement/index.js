import React from "react";
import ReactDOM from "react-dom";

import App from "./app/app.component";
import "./index.scss";

import AppProvider from "./app/app.provider";

ReactDOM.render(
    <AppProvider>
        <App />
    </AppProvider>,
    document.getElementById("app")
);
