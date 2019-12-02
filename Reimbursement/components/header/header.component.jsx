import React, { useContext } from "react";
import axios from "../../axios";

import { AppContext } from "../../app/app.provider";
import { utils, config } from "../../utilities/utils";

const Header = () => {
    const {
        setMainState,
        appData,
        setAppData,
        pagination,
        loadReimbursements,
        showHideLoader,
        validateForm,
        validateField
    } = useContext(AppContext);

    const {
        college,
        summerYear,
        paymentNumber,

        isPending,
        listCollege,
        listSummerSalaryYear,
        listPaymentNumber,
        certificationStatus,
        paymentStatus,
        isReimbursementLoaded
    } = appData;

    const listCertificationStatus = [
        { value: config.effortCertStatus.done, name: "Done" },
        { value: config.effortCertStatus.notDone, name: "Not Done" },
        { value: config.effortCertStatus.all, name: "All" }
    ];

    const listPaymentStatus = [
        { value: config.paymentStatus.fullyPaid, name: "Fully Paid" },
        { value: config.paymentStatus.notFullyPaid, name: "Not Fully Paid" },
        { value: config.paymentStatus.all, name: "All" }
    ];

    const handleChange = (e, mainFilter) => {
        e.persist();

        if (typeof mainFilter === "undefined")
            setAppData({
                ...appData,
                [e.target.name]:
                    e.target.name === "isPending"
                        ? utils.convertToBool(e.target.value)
                        : e.target.value
            });
        else {
            let field = { ...appData[e.target.name] };
            field.value = e.target.value;

            setAppData(
                {
                    ...appData,
                    [e.target.name]: validateField(field)
                },
                updatedState => {
                    if (e.target.name === "summerYear")
                        onSummerYearChange(field.value, updatedState);
                }
            );
        }
    };

    const onSummerYearChange = async (summerYear, updatedState) => {
        let paymentNumber = { ...updatedState.paymentNumber };
        paymentNumber.value = "";

        try {
            showHideLoader(true);
            const getCollegeRes = await axios.get(
                `${config.apiPath}/GetReimbursementPeriods?year=${summerYear}`
            );

            setAppData({
                ...updatedState,
                paymentNumber,
                listPaymentNumber: getCollegeRes.data
            });

            showHideLoader(false);
        } catch (error) {
            showHideLoader(false);

            setAppData({
                ...updatedState,
                paymentNumber,
                listPaymentNumber: []
            });
        }
    };

    const handleFilter = () => {
        const [newValidatedFields, newfilterParams, isValid] = validateForm();

        setMainState(
            {
                appData: {
                    ...appData,
                    ...newValidatedFields,

                    // Re-render List and checkbox
                    listReimbursement: [],
                    isAllchecked: false,
                    isReimbursementLoaded: false
                },
                filters: {
                    isFilterValid: isValid,

                    isPending: appData.isPending,
                    certificationStatus: appData.certificationStatus,
                    paymentStatus: appData.paymentStatus,

                    ...newfilterParams,

                    listPaymentNumber: appData.listPaymentNumber // Copying list of payment numbers
                },
                pagination: {
                    ...pagination,
                    pageIndex: 1 // Setting page no to 1
                },
                alert: {}
            },
            updatedState => {
                if (updatedState.filters.isFilterValid) loadReimbursements();
            }
        );
    };

    return (
        <section
            className={`header ${isReimbursementLoaded ? "mbottom-12" : ""}`}
        >
            <div className='row form-row'>
                {/* Reimbursement Status */}
                <div className='form-group' style={{ width: "180px" }}>
                    <label>Reimbursement Status</label>
                    <label
                        className={`radio-box at-header ${
                            isPending === true ? "active" : ""
                        }`}
                    >
                        Pending
                        <input
                            type='radio'
                            name='isPending'
                            value={true}
                            onChange={handleChange}
                            checked={isPending === true}
                        ></input>
                    </label>
                    <label
                        className={`radio-box  at-header ${
                            isPending === false ? "active" : ""
                        }`}
                    >
                        History
                        <input
                            type='radio'
                            name='isPending'
                            value={false}
                            onChange={handleChange}
                            checked={isPending === false}
                        ></input>
                    </label>
                </div>

                {/* Reimbursement Summer */}
                <div className='form-group' style={{ width: "180px" }}>
                    <label>Reimbursement Summer</label>
                    <select
                        name='summerYear'
                        value={summerYear.value}
                        onChange={e => handleChange(e, true)}
                    >
                        <option value='' disabled>
                            Select
                        </option>
                        {listSummerSalaryYear &&
                            listSummerSalaryYear.map((obj, i) => {
                                return (
                                    <option key={i} value={obj}>
                                        {obj}
                                    </option>
                                );
                            })}
                    </select>

                    {summerYear.errors.required && (
                        <div className='error'>This field is required.</div>
                    )}
                </div>

                {/* Payment Number */}
                <div className='form-group' style={{ width: "180px" }}>
                    <label>Payment Number</label>
                    <select
                        name='paymentNumber'
                        value={paymentNumber.value}
                        onChange={e => handleChange(e, true)}
                    >
                        <option value='' disabled>
                            Select
                        </option>
                        {listPaymentNumber &&
                            listPaymentNumber.map((obj, i) => {
                                return (
                                    <option key={i} value={obj.PaymentNumber}>
                                        {obj.PaymentNumber}
                                    </option>
                                );
                            })}
                    </select>

                    {paymentNumber.errors.required && (
                        <div className='error'>This field is required.</div>
                    )}
                </div>

                {/* College */}
                <div className='form-group' style={{ width: "415px" }}>
                    <label>College</label>
                    <select
                        name='college'
                        value={college.value}
                        onChange={e => handleChange(e, true)}
                    >
                        <option value='' disabled>
                            Select
                        </option>
                        {listCollege &&
                            listCollege.map((obj, i) => {
                                return (
                                    <option key={i} value={obj.Code}>
                                        {obj.Description}
                                    </option>
                                );
                            })}
                    </select>

                    {college.errors.required && (
                        <div className='error'>This field is required.</div>
                    )}
                </div>
            </div>

            <div className='row form-row'>
                {/* Effort Certification Status */}
                <div className='form-group' style={{ width: "180px" }}>
                    <label>Effort Certification Status</label>
                    <select
                        name='certificationStatus'
                        value={certificationStatus}
                        onChange={handleChange}
                    >
                        {listCertificationStatus &&
                            listCertificationStatus.map((obj, key) => {
                                return (
                                    <option key={key} value={obj.value}>
                                        {obj.name}
                                    </option>
                                );
                            })}
                    </select>
                </div>

                {/* Cuny Pasyment Status */}
                <div className='form-group' style={{ width: "180px" }}>
                    <label>CUNY Payment Status</label>
                    <select
                        name='paymentStatus'
                        value={paymentStatus}
                        onChange={handleChange}
                    >
                        {listPaymentStatus &&
                            listPaymentStatus.map((obj, key) => {
                                return (
                                    <option key={key} value={obj.value}>
                                        {obj.name}
                                    </option>
                                );
                            })}
                    </select>
                </div>

                {/* Filter Button */}
                <div className='form-group'>
                    <label>&nbsp;</label>
                    <button
                        type='button'
                        onClick={handleFilter}
                        className='button'
                    >
                        Filter
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Header;
