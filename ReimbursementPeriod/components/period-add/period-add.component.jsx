import React, { useEffect, useState } from "react";

import { withPeriod } from "../../hoc/period.hoc";

const PeriodAdd = ({
    hideModal,
    listPayPeriodEndFrom,
    loadDates,

    validationSchema,
    validateForm,
    handleChange
}) => {
    const {
        IsOpen,
        PayPeriodEndFromDate,
        PayPeriodEndToDate,
        CUNYPayPeriodEndDate,
        GLPostingDate
    } = validationSchema;

    const [isLoading, showHideLoader] = useState(false);

    const init = async () => {
        showHideLoader(true);

        await loadDates("2018");

        showHideLoader(false);
    };

    useEffect(() => {
        init();
    }, []);

    const createPeriod = () => {
        validateForm();
    };

    return (
        <div className='modal-common'>
            {/* Modal Title */}
            <div className='mc-title'>
                <div>
                    <strong>Add New Reimbursement Period</strong>
                </div>
            </div>

            {/* Modal Body */}
            <div className='mc-body'>
                <div className='bg-box'>
                    <div className='form-row'>
                        <div className='form-group col-4 text-right'>
                            <label className='ptop-5'>Year</label>
                        </div>
                        <div className='form-group col-2'>
                            {/* <input
                                name='ReimbursementYear'
                                type='text'
                                value={ReimbursementYear.value}
                                onChange={handleChange}
                            /> */}
                            2018 - static
                        </div>
                        {/* <div className='form-group col-8 col-offset-4'>
                            {!ReimbursementYear.isValid &&
                                ReimbursementYear.errors.map((msg, i) => (
                                    <div className='error' key={i}>
                                        {msg}
                                    </div>
                                ))}
                        </div> */}
                    </div>

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

export default withPeriod(PeriodAdd);
