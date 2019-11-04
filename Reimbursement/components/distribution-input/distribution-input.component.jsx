import React from "react";

const DistributionInput = ({ handleChange, value, ...otherProps }) => {
    const decimal = new RegExp("^([0-9]+([.][0-9]*)?|[.][0-9]+)$");

    const handleBlur = e => {
        e.target.value =
            e.target.value !== ""
                ? parseFloat(e.target.value).toFixed(2)
                : e.target.value;

        handleChange(e);
    };

    const numberOnly = e => {
        var charCode = e.which ? e.which : e.keyCode;
        if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
            e.preventDefault();

        if (!decimal.test(e.target.value)) {
            e.target.value = "";
        }
    };

    let [modifiedValue] = [value];

    return (
        <>
            <input
                defaultValue={
                    modifiedValue !== ""
                        ? parseFloat(modifiedValue).toFixed(2)
                        : modifiedValue
                }
                className='text-right'
                onBlur={handleBlur}
                onKeyUp={numberOnly}
                onKeyPress={numberOnly}
                {...otherProps}
            />
        </>
    );
};

export default DistributionInput;
