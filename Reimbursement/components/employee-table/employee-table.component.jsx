import React, { Fragment } from "react";
import axios from "../../axios";

import { utils, config } from "../../utilities/utils";

export default class EmployeeTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            employeeReimbursement: {},
            isLoading: false
        };
    }

    showLoader = val =>
        this.setState(state => ({
            ...state,
            isLoading: val
        }));

    setEmpReimbursement = (newObj, callback) =>
        this.setState(
            state => ({
                ...state,
                employeeReimbursement: newObj
            }),
            () => {
                callback && callback(this.state);
            }
        );

    loadEmployeeReimbursement = async () => {
        const {
            data: { EmployeeId, ReimbursementYear }
        } = this.props;
        this.showLoader(true);

        try {
            let response = await axios.get(
                `${config.apiPath}/GetEmployeeCertificationDetailsForReimbursements?empId=${EmployeeId}&year=${ReimbursementYear}`
            );

            this.setEmpReimbursement({ ...response.data });
            this.showLoader(false);
        } catch (error) {
            console.log(error.message);
        }
    };

    componentDidMount() {
        this.loadEmployeeReimbursement();
    }

    render() {
        const {
            employeeReimbursement: { Total, PayCheckDetails },
            isLoading
        } = this.state;

        const {
            data: { EmployeeId, LastName, FirstName },
            hideModal
        } = this.props;

        return (
            <div className='modal-common'>
                {/* Modal Title */}
                <div className='mc-title'>
                    <div>
                        <strong>
                            {LastName}, {FirstName} ({EmployeeId.trim()})
                        </strong>
                    </div>
                </div>

                {/* Modal Body */}
                <div className='mc-body'>
                    {PayCheckDetails && PayCheckDetails.length > 0 ? (
                        <div className='table-layout subtotal-bg'>
                            <table>
                                <thead>
                                    <tr>
                                        <th width='100'>Paycheck Date</th>
                                        <th width='110'>Service Period</th>
                                        <th width='180'>Project</th>
                                        <th width='120'>Budget End Date</th>
                                        <th width='80'>Fund Group</th>
                                        <th width='105' className='text-right'>
                                            Salary Authorized
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {PayCheckDetails.map((obj, index) => (
                                        <Fragment key={index}>
                                            {/* Data */}
                                            {obj.PayDetails &&
                                                obj.PayDetails.length > 0 &&
                                                obj.PayDetails.map(
                                                    (item, i) => {
                                                        const rowSpan =
                                                            obj.PayDetails
                                                                .length + 1;

                                                        return (
                                                            <tr key={i}>
                                                                {i === 0 && (
                                                                    <td
                                                                        rowSpan={
                                                                            rowSpan
                                                                        }
                                                                    >
                                                                        {utils.formatDate(
                                                                            obj.PayCheckDate
                                                                        )}
                                                                    </td>
                                                                )}
                                                                <td>
                                                                    {utils.formatDate(
                                                                        item.PayPeriodEnd
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {
                                                                        item.Project
                                                                    }{" "}
                                                                    |{" "}
                                                                    {
                                                                        item.ProjectName
                                                                    }
                                                                </td>
                                                                <td
                                                                    className={`${
                                                                        utils.isBefore(
                                                                            item.ProjectBudgetEndDate,
                                                                            new Date()
                                                                        )
                                                                            ? "red-text"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    {utils.formatDate(
                                                                        item.ProjectBudgetEndDate
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {
                                                                        item.FundGroup
                                                                    }
                                                                </td>
                                                                <td className='text-right'>
                                                                    {utils.currency(
                                                                        item.SalaryAuthorized
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}

                                            {/* Sub Total */}
                                            <tr>
                                                <td className='with-bg'></td>
                                                <td className='with-bg'></td>
                                                <td className='with-bg'></td>
                                                <td className='with-bg'></td>
                                                <td className='with-bg text-right'>
                                                    <strong>
                                                        {utils.currency(
                                                            obj.SubTotal
                                                        )}
                                                    </strong>
                                                </td>
                                            </tr>
                                        </Fragment>
                                    ))}
                                </tbody>

                                {PayCheckDetails && PayCheckDetails.length > 1 && (
                                    <tfoot>
                                        <tr>
                                            <td
                                                colSpan='6'
                                                className='with-bg text-right'
                                            >
                                                <span className='pull-left'>
                                                    Total
                                                </span>
                                                {utils.currency(Total)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    ) : (
                        <h2>No Records found</h2>
                    )}

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
                </div>
            </div>
        );
    }
}
