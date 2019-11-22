import React, { useContext, useState, useEffect } from "react";

import Alert from "../alert/alert.component";
import { AppContext } from "../../app/app.provider";

const PeriodAdd = ({
    data: { summerYear },
    hideModal,

    validationSchema,
    validateForm,
    handleChange,
    setValidationschema,

    listPayPeriodEndFrom,
    setPayPeriodEndFrom,
    getPayPeriodEndFrom,
    savePayPeriod
}) => {
    const {
        IsOpen,
        PayPeriodEndFromDate,
        PayPeriodEndToDate,
        CUNYPayPeriodEndDate,
        GLPostingDate
    } = validationSchema;

    const { alert, initAlert, closeAlert } = useContext(AppContext);

    const [isLoading, showHideLoader] = useState(false);

    const fetchListPayPeriodEndFrom = async () => {
        showHideLoader(true);

        let list = await getPayPeriodEndFrom(summerYear);
        setPayPeriodEndFrom(list);
        initDefaultValues(list);

        showHideLoader(false);
    };

    const initDefaultValues = listYears => {
        if (listYears.length > 0) {
            let min = listYears[0].PayPeriodEnding;
            let max = listYears[listYears.length - 1].PayPeriodEnding;

            let newSchema = { ...validationSchema };
            Object.keys(newSchema).forEach(key => {
                let o = { ...newSchema[key] };

                if (key === "PayPeriodEndFromDate") o.value = min;
                if (key === "PayPeriodEndToDate") o.value = max;

                newSchema[key] = o;
            });

            setValidationschema(newSchema);
        }
    };

    useEffect(() => {
        fetchListPayPeriodEndFrom();
    }, []);

    const createPeriod = async () => {
        if (!validateForm()) return;
        else {
            showHideLoader(true);

            try {
                await savePayPeriod({
                    PaymentNumber: -1,
                    ReimbursementYear: summerYear,
                    IsOpen: IsOpen.value,
                    PayPeriodEndFromDate: PayPeriodEndFromDate.value,
                    PayPeriodEndToDate: PayPeriodEndToDate.value,
                    CUNYPayPeriodEndDate: CUNYPayPeriodEndDate.value,
                    GLPostingDate: GLPostingDate.value
                });

                showHideLoader(false);

                initAlert({
                    content: "Reimbursement pay period successfully created.",
                    setTimeout: 3000
                });

                hideModal(true);
            } catch (error) {
                showHideLoader(false);

                if (error.response)
                    initAlert({
                        inModal: true,
                        type: "error",
                        content: error.response.statusText
                    });

                console.log(error.message);
            }
        }
    };

    return (
        <div className='modal-common'>
            {/* Modal Title */}
            <div className='mc-title'>
                <div>
                    <strong>Add New Reimbursement Period</strong>
                    <span className='pull-right'>
                        Summer Year : <strong>{summerYear}</strong>
                    </span>
                </div>
            </div>

            {/* Modal Body */}
            <div className='mc-body'>
                {alert.isAlertOpen && alert.inModal && (
                    <Alert
                        type={alert.type}
                        content={alert.content}
                        closeAlert={closeAlert}
                    />
                )}

                <div className='bg-box'>
                    <div className='form-row'>
                        <div className='form-group col-4 text-right'>
                            <label className='ptop-5'>Status</label>
                        </div>
                        <div className='form-group col-2'>
                            <select
                                name='IsOpen'
                                value={IsOpen.value}
                                onChange={handleChange}
                            >
                                <option value='' disabled>
                                    Select
                                </option>
                                <option key='1' value={true}>
                                    Open
                                </option>
                                <option key='2' value={false}>
                                    Closed
                                </option>
                            </select>
                        </div>
                        <div className='form-group col-8 col-offset-4'>
                            {!IsOpen.isValid &&
                                IsOpen.errors.map((msg, i) => (
                                    <div className='error' key={i}>
                                        {msg}
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className='form-row'>
                        <div className='form-group col-4 text-right'>
                            <label className='ptop-5'>
                                Pay Period End From Date
                            </label>
                        </div>
                        <div className='form-group col-3'>
                            <select
                                name='PayPeriodEndFromDate'
                                value={PayPeriodEndFromDate.value}
                                onChange={handleChange}
                            >
                                <option value='' disabled>
                                    Select
                                </option>
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
                        </div>
                        <div className='form-group col-8 col-offset-4'>
                            {!PayPeriodEndFromDate.isValid &&
                                PayPeriodEndFromDate.errors.map((msg, i) => (
                                    <div className='error' key={i}>
                                        {msg}
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className='form-row'>
                        <div className='form-group col-4 text-right'>
                            <label className='ptop-5'>
                                Pay Period End To Date
                            </label>
                        </div>
                        <div className='form-group col-3'>
                            <select
                                name='PayPeriodEndToDate'
                                value={PayPeriodEndToDate.value}
                                onChange={handleChange}
                            >
                                <option value='' disabled>
                                    Select
                                </option>
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
                        </div>
                        <div className='form-group col-8 col-offset-4'>
                            {!PayPeriodEndToDate.isValid &&
                                PayPeriodEndToDate.errors.map((msg, i) => (
                                    <div className='error' key={i}>
                                        {msg}
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className='form-row'>
                        <div className='form-group col-4 text-right'>
                            <label className='ptop-5'>
                                CUNY Pay Period End Date
                            </label>
                        </div>
                        <div className='form-group col-3'>
                            <select
                                name='CUNYPayPeriodEndDate'
                                value={CUNYPayPeriodEndDate.value}
                                onChange={handleChange}
                            >
                                <option value='' disabled>
                                    Select
                                </option>
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
                        </div>
                        <div className='form-group col-8 col-offset-4'>
                            {!CUNYPayPeriodEndDate.isValid &&
                                CUNYPayPeriodEndDate.errors.map((msg, i) => (
                                    <div className='error' key={i}>
                                        {msg}
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className='form-row'>
                        <div className='form-group col-4 text-right'>
                            <label className='ptop-5'>GL Posting Date</label>
                        </div>
                        <div className='form-group col-3'>
                            <select
                                name='GLPostingDate'
                                value={GLPostingDate.value}
                                onChange={handleChange}
                            >
                                <option value='' disabled>
                                    Select
                                </option>
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
                        </div>
                        <div className='form-group col-8 col-offset-4'>
                            {!GLPostingDate.isValid &&
                                GLPostingDate.errors.map((msg, i) => (
                                    <div className='error' key={i}>
                                        {msg}
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                {/* Modal Loader */}
                {isLoading && (
                    <div className='modal-loader'>
                        <div className='lds-ellipsis'>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Footer */}
            <div className='mc-footer'>
                <button
                    className='button colorize red'
                    onClick={() => hideModal()}
                >
                    Close
                </button>

                <button
                    className='button colorize blue pull-right'
                    onClick={() => createPeriod()}
                >
                    Create
                </button>
            </div>
        </div>
    );
};

export default PeriodAdd;
