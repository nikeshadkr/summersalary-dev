import React, { useState, useEffect } from "react";
import axios from "../../axios";

import { utils, config } from "../../utilities/utils";

const ReimbursmentsPeriodsData = ({
    index,
    item,
    updateYear,
    toggleEditMode
}) => {
    const [listPayPeriodEndFrom, setPayPeriodEndFrom] = useState([]);

    const toggleEdit = (item, index) => {
        if (!item.IsEditing) {
            axios
                .get(
                    config.appPath +
                        "ReimbursementPeriod/GetPayrollCalendarCollection?year=" +
                        item.ReimbursementYear
                )
                .then(res => {
                    res.data.forEach(obj => {
                        obj.PayPeriodEnding = utils.formatDate(
                            obj.PayPeriodEnding,
                            "MM/DD/YYYY"
                        );
                    });

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
                            defaultValue={item.ReimbursementYear}
                        />
                    </td>
                    <td>{item.PaymentNumber}</td>
                    <td>
                        <select defaultValue={item.IsOpen}>
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
                            name='payPeriodEndFrom'
                            defaultValue={item.PayPeriodEndFromDate}
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
                            defaultValue={item.PayPeriodEndToDate}
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
                            defaultValue={item.CUNYPayPeriodEndDate}
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
                            name='glPostingDate'
                            defaultValue={item.GLPostingDate}
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
                        <button>Save</button>
                        <button onClick={() => toggleEdit(item, index)}>
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
                        <button onClick={() => toggleEdit(item, index)}>
                            Edit
                        </button>{" "}
                    </td>
                </tr>
            )}
        </>
    );
};

export default ReimbursmentsPeriodsData;
