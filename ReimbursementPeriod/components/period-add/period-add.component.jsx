import React, { useContext, useState, useEffect } from "react";

import Alert from "../alert/alert.component";
import { AppContext } from "../../app/app.provider";

const PeriodAdd = ({
    data: { summerYear },
    hideModal,

    validationSchema,
    validateForm,
    handleChange,

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

    const { alert, initAlert, closeAlert } = useContext(AppContext);

    const [isLoading, showHideLoader] = useState(false);

    const createPeriod = () => {
        initAlert({
            inModal: true,
            type: "error",
            content: "Error Occured"
        });

        validateForm();
    };

    const fetchListPayPeriodEndFrom = async () => {
        showHideLoader(true);

        let list = await getPayPeriodEndFrom(summerYear);
        setPayPeriodEndFrom(list);

        showHideLoader(false);
    };

    useEffect(() => {
        fetchListPayPeriodEndFrom();
    }, []);

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
