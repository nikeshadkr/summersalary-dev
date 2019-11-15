import React from "react";

const DistributionInput = ({ handleChange, value, ...otherProps }) => {
    const handleBlur = e => {
        let fValue = parseFloat(e.target.value).toFixed(2);
        e.target.value = !isNaN(fValue) ? fValue : "";

        handleChange(e);
    };

    const numberOnly = e => {
        var charCode = e.which ? e.which : e.keyCode;
        if (
            (charCode != 45 || e.target.value.indexOf("-") != -1) &&
            (charCode != 46 || e.target.value.indexOf(".") != -1) &&
            (charCode < 48 || charCode > 57)
        )
            e.preventDefault();
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
                onKeyPress={numberOnly}
                onPaste={e => {
                    e.preventDefault();
                    return false;
                }}
                {...otherProps}
            />
        </>
    );
};

export default DistributionInput;
