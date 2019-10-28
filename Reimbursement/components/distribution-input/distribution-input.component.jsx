import React from "react";

const DistributionInput = ({ handleChange, ...otherProps }) => {
    const decimal = new RegExp("^([0-9]+([.][0-9]*)?|[.][0-9]+)$");

    const numberOnly = e => {
        if (e.target.value === "" || decimal.test(e.target.value))
            handleChange(e);
    };

    return (
        <>
            <input
                className='text-right'
                onChange={numberOnly}
                {...otherProps}
            />
        </>
    );
};

export default DistributionInput;
