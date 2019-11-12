import React, { useState } from "react";

import { validationRules } from "../utilities/utils";

export const withPeriod = Component => {
    return props => {
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
                        rule: validationRules.required,
                        message: "This field is required"
                    }
                ]
            }
        });

        const handleChange = e => {
            e.persist();
            let field = { ...validationSchema[e.target.name] };
            field.value = e.target.value;

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

        return (
            <Component
                {...props}
                handleChange={handleChange}
                validationSchema={validationSchema}
                setValidationschema={setValidationschema}
                validateField={validateField}
                validateForm={validateForm}
            />
        );
    };
};
