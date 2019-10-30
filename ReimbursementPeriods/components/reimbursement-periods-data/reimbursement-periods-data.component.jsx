import React, { useState } from "react";
import axios from "../../axios";

const ReimbursmentsPeriodsData = ({
    index,
    item,
    updateYear,
    toggleEditMode
}) => {
    const [listPayPeriodEndFrom, setPayPeriodEndFrom] = useState([]);

    const onYearChange = (e, index) => {
        updateYear(e.target.value, index);
    };

    const toggleEdit = (e, item, index) => {
        if (!item.IsEditing) {
            let listPeriods = axios
                .get(
                    window.applicationPath +
                        "ReimbursementPeriod/GetPayrollCalendarCollection?year=" +
                        item.ReimbursementYear
                )
                .then(res => {
                    setPayPeriodEndFrom(res.data);
                });
        }

        toggleEditMode(!item.IsEditing, index);
    };

    return (
        <>
            {item.IsEditing ? (
                <tr>
                    <td>
                        <input
                            type='text'
                            value={item.ReimbursementYear}
                            onChange={e => onYearChange(e, index)}
                        />
                    </td>
                    <td>{item.PaymentNumber}</td>
                    <td>
                        <select value={item.IsOpen}>
                            <option key='1' value='true'>
                                Open
                            </option>
                            <option key='2' value='false'>
                                Closed
                            </option>
                        </select>
                    </td>
                    <td>
                        <select
                            name='payPeriodEndFrom'
                            value={item.PayPeriodEndFromDate}
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
                            name='payPeriodEndTo'
                            value={item.PayPeriodEndToDate}
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
                            name='cunyPayPeriodEndDate'
                            value={item.CUNYPayPeriodEndDate}
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
                        <select name='glPostingDate' value={item.GLPostingDate}>
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
                        <button>Save</button>
                        <button onClick={e => toggleEdit(e, item, index)}>
                            Cancel
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
                        <button onClick={e => toggleEdit(e, item, index)}>
                            Edit
                        </button>{" "}
                    </td>
                </tr>
            )}
        </>
    );
};

export default ReimbursmentsPeriodsData;
