import React, { useState } from "react";
import axios from "../../axios";

import { utils, config, validationRules } from "../../utilities/utils";

const ReimbursmentsPeriodsData = ({
    index,
    item,
    toggleEditMode,
    handleStateChange
}) => {
    const [listPayPeriodEndFrom, setPayPeriodEndFrom] = useState([]);

    const [validationSchema, setValidationschema] = useState({
        ReimbursementYear: {
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

    const {
        ReimbursementYear,
        IsOpen,
        PayPeriodEndFromDate,
        PayPeriodEndToDate,
        CUNYPayPeriodEndDate,
        GLPostingDate
    } = validationSchema;

    const insertValues = () => {
        let newSchema = { ...validationSchema };
        Object.keys(validationSchema).forEach(key => {
            let o = { ...newSchema[key] };
            o.value = item[key];
            o.isTouched = false;
            o.isValid = false;
            o.errors = [];
            newSchema[key] = o;
        });

        setValidationschema(newSchema);
    };

    /*const validateForm = () => {
        let isValid = true;

        Object.keys(validationSchema).map(obj => {
            validateField(validationSchema[obj]);

            if (validationSchema[obj].isValid === false) isValid = false;

            return null;
        });

        return isValid;
    };*/

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

    const handleChange = e => {
        e.persist();
        let field = { ...validationSchema[e.target.name] };
        field.value = e.target.value;

        setValidationschema(prevState => ({
            ...prevState,
            [e.target.name]: validateField(field)
        }));
    };

    const toggleEdit = async (item, index) => {
        if (!item.IsEditing) {
            let listPayPeriodRes = await axios.get(
                config.appPath +
                    "ReimbursementPeriod/GetPayrollCalendarCollection?year=" +
                    item.ReimbursementYear
            );

            listPayPeriodRes.data.forEach(obj => {
                obj.PayPeriodEnding = utils.formatDate(
                    obj.PayPeriodEnding,
                    "MM/DD/YYYY"
                );
            });

            setPayPeriodEndFrom(listPayPeriodRes.data);
            insertValues();
        }

        toggleEditMode(!item.IsEditing, index);
    };

    return (
        <>
            {item.IsEditing ? (
                <tr>
                    <td>
                        <input
                            name='ReimbursementYear'
                            data-id={index}
                            type='text'
                            value={ReimbursementYear.value}
                            onChange={handleChange}
                        />

                        {!ReimbursementYear.isValid &&
                            ReimbursementYear.errors.map((msg, i) => (
                                <div className='error' key={i}>
                                    {msg}
                                </div>
                            ))}
                    </td>
                    <td>{item.PaymentNumber}</td>
                    <td>
                        <select
                            data-id={index}
                            name='IsOpen'
                            value={IsOpen.value}
                            onChange={handleChange}
                        >
                            <option key='1' value={true}>
                                Open
                            </option>
                            <option key='2' value={false}>
                                Closed
                            </option>
                        </select>
                    </td>
                    <td>
                        <select
                            data-id={index}
                            name='PayPeriodEndFromDate'
                            value={PayPeriodEndFromDate.value}
                            onChange={handleChange}
                        >
                            {listPayPeriodEndFrom &&
                                listPayPeriodEndFrom.map((obj, key) => {
                                    return (
                                        <option
                                            key={key}
                                            value={obj.PayPeriodEnding}
                                        >
                                            {obj.PayPeriodEnding}
                                        </option>
                                    );
                                })}
                        </select>
                    </td>
                    <td>
                        <select
                            data-id={index}
                            name='PayPeriodEndToDate'
                            value={PayPeriodEndToDate.value}
                            onChange={handleChange}
                        >
                            {listPayPeriodEndFrom &&
                                listPayPeriodEndFrom.map((obj, key) => {
                                    return (
                                        <option
                                            key={key}
                                            value={obj.PayPeriodEnding}
                                        >
                                            {obj.PayPeriodEnding}
                                        </option>
                                    );
                                })}
                        </select>
                    </td>
                    <td>
                        <select
                            data-id={index}
                            name='CUNYPayPeriodEndDate'
                            value={CUNYPayPeriodEndDate.value}
                            onChange={handleChange}
                        >
                            {listPayPeriodEndFrom &&
                                listPayPeriodEndFrom.map((obj, key) => {
                                    return (
                                        <option
                                            key={key}
                                            value={obj.PayPeriodEnding}
                                        >
                                            {obj.PayPeriodEnding}
                                        </option>
                                    );
                                })}
                        </select>
                    </td>
                    <td>
                        <select
                            data-id={index}
                            name='GLPostingDate'
                            value={GLPostingDate.value}
                            onChange={handleChange}
                        >
                            {listPayPeriodEndFrom &&
                                listPayPeriodEndFrom.map((obj, key) => {
                                    return (
                                        <option
                                            key={key}
                                            value={obj.PayPeriodEnding}
                                        >
                                            {obj.PayPeriodEnding}
                                        </option>
                                    );
                                })}
                        </select>
                    </td>
                    <td>
                        <button className='inline-image-button'>
                            <img
                                alt='save'
                                src={`${config.assetPath}/status-ok.png`}
                            />
                        </button>

                        <button
                            className='inline-image-button'
                            onClick={() => toggleEdit(item, index)}
                        >
                            <img
                                alt='cancel'
                                src={`${config.assetPath}/status-notok.png`}
                            />
                        </button>
                    </td>
                </tr>
            ) : (
                <tr>
                    <td>{item.ReimbursementYear}</td>
                    <td>{item.PaymentNumber}</td>
                    <td>{item.IsOpen ? "Open" : "Closed"}</td>
                    <td>{item.PayPeriodEndFromDate}</td>
                    <td>{item.PayPeriodEndToDate}</td>
                    <td>{item.CUNYPayPeriodEndDate}</td>
                    <td>{item.GLPostingDate}</td>
                    <td>
                        <button
                            className='inline-image-button fixed'
                            onClick={() => toggleEdit(item, index)}
                        >
                            <img
                                style={{ width: "18px", height: "18px" }}
                                alt='edit'
                                src={`${config.assetPath}/edit.png`}
                            />
                        </button>
                    </td>
                </tr>
            )}
        </>
    );
};

export default ReimbursmentsPeriodsData;
