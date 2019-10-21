import React, { useContext, useEffect } from "react";
import axios from "axios";

import { AppContext } from "../../app/app.provider";
import { Utils, Paths } from "../../app/app.utils";

const Header = () => {
    const {
        appData,
        setAppData,
        loadReimbursements,
        showHideLoader,
        validateForm,
        validateField,
        filters,
        setFilters
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
        { value: "F", name: "Done" },
        { value: "X", name: "Not Done" },
        { value: "", name: "All" }
    ];

    const listPaymentStatus = [
        { value: "0", name: "Fully Paid" },
        { value: "1", name: "Not Fully Paid" },
        { value: "", name: "All" }
    ];

    const handleChange = (e, validate) => {
        e.persist();

        if (typeof validate === "undefined")
            setAppData(appData => ({
                ...appData,
                [e.target.name]:
                    e.target.name === "isPending"
                        ? Utils.ConvertToBool(e.target.value)
                        : e.target.value
            }));
        else {
            let field = { ...appData[e.target.name] };
            field.value = e.target.value;

            let newValidatedField = validateField(field);

            if (e.target.name === "summerYear")
                onSummerYearChange(newValidatedField.value);

            setAppData(appData => ({
                ...appData,
                [e.target.name]: newValidatedField
            }));
        }
    };

    const handleSubmit = () => {
        const [newValidatedFields, newfilterParams, isValid] = validateForm();

        setAppData(appData => ({
            ...appData,
            ...newValidatedFields,

            // Rerender list and checkbox
            selectAllCheckBox: false,
            isReimbursementLoaded: false
        }));

        setFilters({
            isFilterValid: isValid,

            isPending: appData.isPending,
            certificationStatus: appData.certificationStatus,
            paymentStatus: appData.paymentStatus,

            ...newfilterParams
        });
    };

    const onSummerYearChange = async summerYear => {
        try {
            showHideLoader(true);
            const getCollegeRes = await axios.get(
                `${Paths.apiPath}/GetReimbursementPeriods?year=${summerYear}`
            );

            setAppData(appData => {
                let paymentNumber = { ...appData.paymentNumber };
                paymentNumber.value = "";

                return {
                    ...appData,
                    paymentNumber,
                    listPaymentNumber: getCollegeRes.data
                };

                /*listReimbursement: [],
                    isReimbursementLoaded: false,
                    certificationStatus: "",
                    paymentStatus: ""*/
            });

            showHideLoader(false);
        } catch (error) {
            showHideLoader(false);
            setAppData(appData => {
                let paymentNumber = { ...appData.paymentNumber };
                paymentNumber.value = "";

                return {
                    ...appData,
                    paymentNumber,
                    listPaymentNumber: []
                };
            });
        }
    };

    useEffect(() => {
        filters.isFilterValid && loadReimbursements(true);
    }, [filters]);

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

                    {!summerYear.isValid &&
                        summerYear.errors.map((msg, i) => (
                            <div className='error' key={i}>
                                {msg}
                            </div>
                        ))}
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

                    {!paymentNumber.isValid &&
                        paymentNumber.errors.map((msg, i) => (
                            <div className='error' key={i}>
                                {msg}
                            </div>
                        ))}
                </div>

                {/* College */}
                <div className='form-group' style={{ width: "180px" }}>
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
                                        {obj.CunyDescription}
                                    </option>
                                );
                            })}
                    </select>

                    {!college.isValid &&
                        college.errors.map((msg, i) => (
                            <div className='error' key={i}>
                                {msg}
                            </div>
                        ))}
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
                    <label>Cuny Payment Status</label>
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
                        onClick={handleSubmit}
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
