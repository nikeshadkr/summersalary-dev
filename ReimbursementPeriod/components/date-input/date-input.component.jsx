import React, { useState } from "react";
import DatePicker from "react-datepicker";

import { utils } from "../../utilities/utils";

import "react-datepicker/dist/react-datepicker.css";
import "./date-input.component.scss";

const DateInput = props => {
    const _DateFormatLoose = /^([1-9]|0[1-9]|1[012])\/((0[1-9]|[1-9])|1\d|2\d|3[01])\/((19|20)\d{2}|(\d{2})|(\d{3}))/;
    const { onChange, value, ...rest } = props;

    // Formatting on Blur
    const onBlur = e => {
        if (_DateFormatLoose.test(e.target.value)) {
            let date = e.target.value.split("/");

            if (date[2].length === 2) {
                let currentYear = parseInt(
                    new Date()
                        .getFullYear()
                        .toString()
                        .substr(2, 3)
                );
                date[2] =
                    (parseInt(date[2]) <= currentYear + 5 ? "20" : "19") +
                    date[2];
            }

            if (date[2].length === 3) {
                e.target.value = "";
                onChange(e);
                return;
            }

            e.target.value = utils.formatDate(
                new Date(`${date[0]}/${date[1]}/${date[2]}`)
            );
        } else e.target.value = "";

        onChange(e, true); // True sets the touched property of field
    };

    const dateOnly = e => {
        var charCode = e.which ? e.which : e.keyCode;

        if (charCode >= 47 && charCode <= 57) return true;
        else e.preventDefault();
    };

    const [date, setDate] = useState(value ? new Date(value) : null);

    return (
        /*<input
             {...rest}
             defaultValue={value}
             onChange={onChange}
             onBlur={onBlur}
             onKeyPress={dateOnly}
             onPaste={e => {
                 e.preventDefault();
                 return false;
             }}
             maxLength='10'
         />*/

        <DatePicker
            {...rest}
            showMonthDropdown
            showYearDropdown
            autoComplete='off'
            maxLength='10'
            selected={date}
            onChange={date => {
                setDate(date);
            }}
            onChangeRaw={e => {
                console.log(e.target.value);
                setDate(null);
                onChange(e);
            }}
            onBlur={e => {
                console.log(e.target.value);
                onBlur(e);
            }}
        />
    );
};

export default DateInput;
