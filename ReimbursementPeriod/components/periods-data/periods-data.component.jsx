import React, { useContext } from "react";
import axios from "../../axios";

import { AppContext } from "../../app/app.provider";
import { config } from "../../utilities/utils";

const PeriodsData = ({
    index,
    item,
    listReimbursementPeriods,

    handleChange,
    validationSchema,
    setValidationschema,
    savePayPeriod,

    listPayPeriodEndFrom,
    setPayPeriodEndFrom,
    getPayPeriodEndFrom
}) => {
    const {
        IsOpen,
        PayPeriodEndFromDate,
        PayPeriodEndToDate,
        CUNYPayPeriodEndDate,
        GLPostingDate
    } = validationSchema;

    const {
        setAppState,
        initModal,
        toggleLoader,

        initAlert
    } = useContext(AppContext);

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

    const handleMainStateUpdate = index => {
        let clonedList = [...listReimbursementPeriods];
        let found = { ...clonedList[index] };

        found["IsOpen"] = IsOpen.value;
        found["PayPeriodEndFromDate"] = PayPeriodEndFromDate.value;
        found["PayPeriodEndToDate"] = PayPeriodEndToDate.value;
        found["CUNYPayPeriodEndDate"] = CUNYPayPeriodEndDate.value;
        found["GLPostingDate"] = GLPostingDate.value;
        found["IsEditing"] = false;

        clonedList[index] = found;

        setAppState(prevState => ({
            ...prevState,
            listReimbursementPeriods: clonedList
        }));
    };

    const toggleEdit = async (item, index) => {
        if (!item.IsEditing) {
            toggleLoader(true);

            let response = await getPayPeriodEndFrom(item.ReimbursementYear);
            setPayPeriodEndFrom(response);
            insertValues();

            toggleLoader(false);
        }

        togglePartial(!item.IsEditing, index);
    };

    const togglePartial = (value, index) => {
        let clonedList = [...listReimbursementPeriods];
        let found = { ...clonedList[index] };
        found.IsEditing = value;
        clonedList[index] = found;

        setAppState(prevState => ({
            ...prevState,
            listReimbursementPeriods: clonedList
        }));
    };

    const removeItem = (item, index) => {
        initModal({
            data: {
                title: "Confirm !!",
                message: "Are you sure you want to delete ?"
            },
            type: "",
            size: "small",
            showModal: true,
            onClose: async cData => {
                if (cData) {
                    let clonedList = [...listReimbursementPeriods];

                    setAppState(prevState => ({
                        ...prevState,
                        listReimbursementPeriods: clonedList.filter(
                            (obj, i) => i != index
                        )
                    }));

                    toggleLoader(true);
                    try {
                        await axios.delete(
                            `${config.apiPath}/DeleteSummerSalaryReimbursementPeriod?ssReimbursementYear=${item.ReimbursementYear}&paymentNumber=${item.PaymentNumber}`
                        );

                        initAlert({
                            content: "Successfully Deleted",
                            setTimeout: 3000
                        });

                        toggleLoader(false);
                    } catch (error) {
                        toggleLoader(false);

                        if (error.response)
                            initAlert({
                                type: "error",
                                content: error.response.statusText
                            });

                        console.log(error.message);
                    }
                }
            }
        });
    };

    const updatePayPeriod = async (item, index) => {
        toggleLoader(true);
        try {
            await savePayPeriod({
                PaymentNumber: item.PaymentNumber,
                ReimbursementYear: item.ReimbursementYear,
                IsOpen: IsOpen.value,
                PayPeriodEndFromDate: PayPeriodEndFromDate.value,
                PayPeriodEndToDate: PayPeriodEndToDate.value,
                CUNYPayPeriodEndDate: CUNYPayPeriodEndDate.value,
                GLPostingDate: GLPostingDate.value
            });

            toggleLoader(false);

            initAlert({
                content: "Reimbursement pay period successfully updated.",
                setTimeout: 3000
            });

            handleMainStateUpdate(index);
        } catch (error) {
            toggleLoader(false);

            if (error.response)
                initAlert({
                    inModal: true,
                    type: "error",
                    content: error.response.statusText
                });

            console.log(error.message);
        }
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
                        {item.IsOpen ? (
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
                        ) : (
                            item.PayPeriodEndFromDate
                        )}
                    </td>
                    <td>
                        {item.IsOpen ? (
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
                        ) : (
                            item.PayPeriodEndToDate
                        )}
                    </td>
                    <td>
                        {item.IsOpen ? (
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
                        ) : (
                            item.CUNYPayPeriodEndDate
                        )}
                    </td>
                    <td>
                        <select
                            data-id={index}
                            name='GLPostingDate'
                            value={GLPostingDate.value}
                            onChange={handleChange}
                        >
                            <option value=''>Select</option>
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
                        <button
                            className='inline-image-button'
                            onClick={() => updatePayPeriod(item, index)}
                        >
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
                            className='inline-image-button fixed no-border'
                            onClick={() => toggleEdit(item, index)}
                        >
                            <img
                                style={{ width: "18px", height: "18px" }}
                                alt='edit'
                                src={`${config.assetPath}/edit.png`}
                            />
                        </button>

                        <button
                            className='inline-image-button fixed no-border'
                            onClick={() => removeItem(item, index)}
                        >
                            <img
                                style={{ width: "18px", height: "18px" }}
                                alt='delete'
                                src={`${config.assetPath}/icon-trash.png`}
                            />
                        </button>
                    </td>
                </tr>
            )}
        </>
    );
};

export default PeriodsData;
