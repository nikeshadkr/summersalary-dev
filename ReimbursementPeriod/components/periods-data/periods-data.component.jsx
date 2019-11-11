import React, { useContext } from "react";

import { withPeriod } from "../../hoc/period.hoc";
import { AppContext } from "../../app/app.provider";

import { config } from "../../utilities/utils";

const PeriodsData = ({
    index,
    item,
    toggleEditMode,
    handleMainStateUpdate,

    listPayPeriodEndFrom,
    loadDates,
    handleChange,

    validationSchema,
    setValidationschema
}) => {
    const {
        IsOpen,
        PayPeriodEndFromDate,
        PayPeriodEndToDate,
        CUNYPayPeriodEndDate,
        GLPostingDate
    } = validationSchema;

    const { toggleLoader } = useContext(AppContext);

    const insertValues = () => {
        // Populating Edit form with item state
        let newSchema = { ...validationSchema };
        Object.keys(newSchema).forEach(key => {
            let o = { ...newSchema[key] };
            o.value = item[key];
            o.isTouched = false;
            o.isValid = false;
            o.errors = [];
            newSchema[key] = o;
        });

        setValidationschema(newSchema);
    };

    const toggleEdit = async (item, index) => {
        if (!item.IsEditing) {
            toggleLoader(true);

            await loadDates(item.ReimbursementYear);
            insertValues();

            toggleLoader(false);
        }

        toggleEditMode(!item.IsEditing, index);
    };

    return (
        <>
            {item.IsEditing ? (
                <tr>
                    <td>{item.ReimbursementYear}</td>
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

export default withPeriod(PeriodsData);