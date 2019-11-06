import React, { useState } from "react";
import axios from "../../axios";

import { utils, config } from "../../utilities/utils";

const ReimbursmentsPeriodsData = ({
    index,
    item,
    handleChange,
    toggleEditMode
}) => {
    const [listPayPeriodEndFrom, setPayPeriodEndFrom] = useState([]);

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
                            value={item.ReimbursementYear}
                            onChange={handleChange}
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
