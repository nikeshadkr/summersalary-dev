import React from "react";
import axios from "axios";

import { withAppData } from "../../app/app.provider";
import { Utils, Paths } from "../../app/app.utils";

class Header extends React.Component {
    constructor() {
        super();
    }

    listCertificationStatus = [
        { value: "F", name: "Done" },
        { value: "X", name: "Not Done" },
        { value: "", name: "All" }
    ];

    listPaymentStatus = [
        { value: "0", name: "Fully Paid" },
        { value: "1", name: "Not Fully Paid" },
        { value: "", name: "All" }
    ];

    handleChange = (e, mainFilter) => {
        e.persist();

        const { appData, setAppData } = this.props.AppContext;

        if (typeof mainFilter === "undefined")
            setAppData({
                ...appData,
                [e.target.name]:
                    e.target.name === "isPending"
                        ? Utils.ConvertToBool(e.target.value)
                        : e.target.value
            });
        else {
            let field = { ...appData[e.target.name] };
            field.value = e.target.value;

            //let newValidatedField = validateField(field);

            setAppData(
                {
                    ...appData,
                    [e.target.name]: field
                },
                updatedState => {
                    if (e.target.name === "summerYear")
                        this.onSummerYearChange(field.value, updatedState);
                }
            );
        }
    };

    onSummerYearChange = async (summerYear, updatedState) => {
        const { showHideLoader, setAppData } = this.props.AppContext;

        let paymentNumber = { ...updatedState.paymentNumber };
        paymentNumber.value = "";

        try {
            showHideLoader(true);
            const getCollegeRes = await axios.get(
                `${Paths.apiPath}/GetReimbursementPeriods?year=${summerYear}`
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

    handleSubmit = () => {
        const {
            setMainState,
            appData,
            loadReimbursements,
            validateForm
        } = this.props.AppContext;

        const [newValidatedFields, newfilterParams, isValid] = validateForm();

        setMainState(
            {
                appData: {
                    ...appData,
                    ...newValidatedFields,

                    // Re-render List and checkbox
                    listReimbursement: [],
                    selectAllCheckBox: false,
                    isReimbursementLoaded: false
                },
                filters: {
                    isFilterValid: isValid,

                    isPending: appData.isPending,
                    certificationStatus: appData.certificationStatus,
                    paymentStatus: appData.paymentStatus,

                    ...newfilterParams,

                    listPaymentNumber: appData.listPaymentNumber // Copying list of payment numbers when filtering
                }
            },
            updatedState => {
                if (updatedState.filters.isFilterValid)
                    loadReimbursements(true);
            }
        );
    };

    render() {
        const {
            appData: {
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
            }
        } = this.props.AppContext;

        return (
            <section
                className={`header ${
                    isReimbursementLoaded ? "mbottom-12" : ""
                }`}
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
                                onChange={this.handleChange}
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
                                onChange={this.handleChange}
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
                            onChange={e => this.handleChange(e, true)}
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
                            onChange={e => this.handleChange(e, true)}
                        >
                            <option value='' disabled>
                                Select
                            </option>
                            {listPaymentNumber &&
                                listPaymentNumber.map((obj, i) => {
                                    return (
                                        <option
                                            key={i}
                                            value={obj.PaymentNumber}
                                        >
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
                            onChange={e => this.handleChange(e, true)}
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
                            onChange={this.handleChange}
                        >
                            {this.listCertificationStatus &&
                                this.listCertificationStatus.map((obj, key) => {
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
                            onChange={this.handleChange}
                        >
                            {this.listPaymentStatus &&
                                this.listPaymentStatus.map((obj, key) => {
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
                            onClick={this.handleSubmit}
                            className='button'
                        >
                            Filter
                        </button>
                    </div>
                </div>
            </section>
        );
    }
}

export default withAppData(Header);
