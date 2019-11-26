import React, { useState } from "react";
import axios from "../../axios";

import { config, utils, validationRules } from "../../utilities/utils";

const PeriodWrapper = props => {
    const [validationSchema, setValidationschema] = useState({
        IsOpen: {
            value: "",
            isTouched: false,
            isValid: false,
            errors: [],
            rules: [
                {
                    rule: validationRules.required,
                    message: "This field is required"
                }
            ]
        },
        PayPeriodEndFromDate: {
            value: "",
            isTouched: false,
            isValid: false,
            errors: [],
            rules: [
                {
                    rule: validationRules.required,
                    message: "This field is required"
                }
            ]
        },
        PayPeriodEndToDate: {
            value: "",
            isTouched: false,
            isValid: false,
            errors: [],
            rules: [
                {
                    rule: validationRules.required,
                    message: "This field is required"
                }
            ]
        },
        CUNYPayPeriodEndDate: {
            value: "",
            isTouched: false,
            isValid: false,
            errors: [],
            rules: [
                {
                    rule: validationRules.required,
                    message: "This field is required"
                }
            ]
        },
        GLPostingDate: {
            value: "",
            isTouched: false,
            isValid: false,
            errors: [],
            rules: [
                {
                    rule: validationRules.dateFormat,
                    message: "Invalid date"
                }
            ]
        }
    });

    const handleChange = e => {
        e.persist();
        let field = { ...validationSchema[e.target.name] };
        field.value =
            e.target.name === "IsOpen"
                ? utils.convertToBool(e.target.value)
                : e.target.value;

        setValidationschema(prevState => ({
            ...prevState,
            [e.target.name]: validateField(field)
        }));
    };

    const validateForm = () => {
        let isValid = true;
        let newSchema = { ...validationSchema };

        Object.keys(newSchema).map(key => {
            let itm = { ...newSchema[key] };
            let field = validateField(itm);

            if (field.isValid === false) isValid = false;

            newSchema[key] = field;
            return null;
        });

        setValidationschema(newSchema);
        return isValid;
    };

    const validateField = field => {
        field.errors = [];
        field.isValid = true;

        field.rules.map(o => {
            if (!o.rule(field.value)) {
                field.errors.push(o.message);
                field.isValid = false;
            }
        });

        return field;
    };

    const [listPayPeriodEndFrom, setPayPeriodEndFrom] = useState([]);

    const getPayPeriodEndFrom = async ReimbursementYear => {
        let listPayPeriodRes = await axios.get(
            `${config.apiPath}/GetPayrollCalendarCollection?year=${ReimbursementYear}`
        );

        listPayPeriodRes.data.forEach(obj => {
            obj.PayPeriodEnding = utils.formatDate(
                obj.PayPeriodEnding,
                "MM/DD/YYYY"
            );
        });

        return listPayPeriodRes.data;
    };

    const savePayPeriod = async formData => {
        await axios.post(`${config.apiPath}/SaveReimbursementPeriod`, formData);
    };

    return props.period({
        getPayPeriodEndFrom,
        listPayPeriodEndFrom,
        setPayPeriodEndFrom,
        savePayPeriod,
        handleChange,
        validationSchema,
        setValidationschema,
        validateField,
        validateForm
    });
};

export default PeriodWrapper;
