import React from "react";
import "./alert.styles.scss";

const Alert = ({ type, content, closeAlert }) => {
    let AlertContent;

    if (!Array.isArray(content)) AlertContent = [content];
    else {
        AlertContent = "<ul>";
        content.forEach(msg => {
            AlertContent += <li>{msg}</li>;
        });
        AlertContent += "</ul>";
    }

    return (
        <div className={`alert ${type}`}>
            <span className='alert-icon'></span>
            <span
                className='alert-close'
                onClick={() => {
                    closeAlert();
                }}
            ></span>
            <div className='alert-content'>{AlertContent}</div>
        </div>
    );
};

export default Alert;
