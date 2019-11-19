import React from "react";
import axios from "../../axios";
import { utils, config } from "../../utilities/utils";

export default class PreviousPaymentTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            listPreviousPayments: [],
            isLoading: false
        };
    }

    showLoader = val =>
        this.setState(state => ({
            ...state,
            isLoading: val
        }));

    loadPreviousPayments = async () => {
        const {
            EmployeeId,
            PaymentNumber,
            CollegeCode,
            ReimbursementYear
        } = this.props.data;

        this.showLoader(true);

        try {
            let response = await axios.get(
                `${config.apiPath}/GetPreviousReimbursements?employeeId=${EmployeeId}&collegeCode=${CollegeCode}&reimbursementYear=${ReimbursementYear}&paymentNumber=${PaymentNumber}`
            );

            this.setState(state => ({
                ...state,
                listPreviousPayments: response.data
            }));

            this.showLoader(false);
        } catch (error) {
            console.log(error.message);
        }
    };

    componentDidMount() {
        this.loadPreviousPayments();
    }

    render() {
        const {
            data: { EmployeeId, LastName, FirstName, ReimbursementYear },
            hideModal
        } = this.props;

        const { listPreviousPayments, isLoading } = this.state;

        return (
            <div className='modal-common'>
                <div className='mc-title'>
                    <div>
                        <strong>
                            {LastName}, {FirstName} ({EmployeeId.trim()})
                        </strong>
                        <strong style={{ float: "right" }}>
                            Reimbursement Year: {ReimbursementYear}
                        </strong>
                    </div>
                </div>
                <div className='mc-body'>
                    {listPreviousPayments && listPreviousPayments.length > 0 ? (
                        <div className='table-layout subtotal-bg'>
                            <table>
                                <thead>
                                    <tr>
                                        <th width='80'>Payment #</th>
                                        <th>Import Date</th>
                                        <th>Pay Period Ending</th>
                                        <th>Last Pay Date</th>
                                        <th className='text-right'>YTD Paid</th>
                                        <th className='text-right'>
                                            Difference from <br></br> Previous
                                        </th>
                                        <th className='text-right'>
                                            Salary Reimbursed
                                        </th>
                                        <th>GL Posting Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listPreviousPayments.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.PaymentNumber}</td>
                                            <td>
                                                {utils.formatDate(
                                                    item.ImportDate
                                                )}
                                            </td>
                                            <td>
                                                {utils.formatDate(
                                                    item.PayPeriodEnding
                                                )}
                                            </td>
                                            <td>
                                                {utils.formatDate(
                                                    item.LastPayDate
                                                )}
                                            </td>
                                            <td className='text-right'>
                                                {utils.currency(item.YTDPaid)}
                                            </td>
                                            <td className='text-right'>
                                                {utils.currency(item.YTDDiff)}
                                            </td>
                                            <td className='text-right'>
                                                {utils.currency(
                                                    item.SalaryReimbursed
                                                )}
                                            </td>
                                            <td>
                                                {utils.formatDate(
                                                    item.GLPostingDate
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
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
