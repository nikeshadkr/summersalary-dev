import React from "react";
import axios from "axios";

import ColumnTotal from "../column-total/column-total.component";

import { utils, config } from "../../utilities/utils";

class DistributionTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            listDistribution: [],
            isLoading: false
        };
    }

    showLoader = val =>
        this.setState(state => ({
            ...state,
            isLoading: val
        }));

    setDistribution = (updates, callback) =>
        this.setState(
            state => ({
                ...state,
                ...updates
            }),
            () => {
                callback && callback(this.state);
            }
        );

    handleChange = e => {
        e.persist();

        let listDistribution = [...this.state.listDistribution];
        let changeField = {
            ...this.state.listDistribution[e.target.dataset.id]
        };
        changeField[e.target.name] =
            e.target.name === "SalaryReimbursed"
                ? utils.convertToInt(e.target.value)
                : e.target.value;
        listDistribution[e.target.dataset.id] = changeField;

        this.setDistribution({
            listDistribution
        });
    };

    loadDistribution = async () => {
        const { data } = this.props;
        this.showLoader(true);

        try {
            let listDistributionRes = await axios.get(
                `${config.apiPath}/${
                    data.isPending ? "GetPendingReimbursementsDistribution" : ""
                }/?employeeId=${data.EmployeeId}&reimbursementYear=${
                    data.ReimbursementYear
                }&paymentNumber=${data.PaymentNumber}&collegeCode=${
                    data.CollegeCode
                }`
            );

            listDistributionRes.data.forEach(obj => {
                obj.BudgetEndDate = utils.formatDate(
                    obj.BudgetEndDate,
                    "DD/MM/YYYY"
                );
                obj.BudgetStartDate = utils.formatDate(
                    obj.BudgetStartDate,
                    "DD/MM/YYYY"
                );

                if (data.EffortCertStatus !== config.effortCertStatus.done) {
                    obj.SalaryReimbursed = 0;
                    obj.DisableSalaryReimburse = true;
                    obj.DisableComment = true;
                }
            });

            this.setDistribution({
                listDistribution: listDistributionRes.data
            });

            this.showLoader(false);
        } catch (error) {
            console.log(error.message);
        }
    };

    componentDidMount() {
        this.loadDistribution();
    }

    render() {
        const { FirstName, LastName, CUNYYTDPaid } = this.props.data;
        return (
            <div className='modal-common'>
                <div className='mc-title'>
                    <div>
                        Employee :{" "}
                        <strong>
                            {LastName}, {FirstName}
                        </strong>
                        <span className='pull-right'>
                            CUNY YTD Paid :{" "}
                            <strong>{utils.currency(CUNYYTDPaid)}</strong>
                        </span>
                    </div>
                </div>

                {!this.state.isLoading ? (
                    <div className='mc-body'>
                        {this.state.listDistribution.length > 0 ? (
                            <div className='table-layout inside-modal'>
                                <table>
                                    <thead>
                                        <tr>
                                            <th width='70'>Summer Year</th>
                                            <th>Project</th>
                                            <th>Budget End Date</th>
                                            <th width='150'>Project Name</th>
                                            <th width='70'>Fund Group</th>
                                            <th
                                                width='90'
                                                className='text-right'
                                            >
                                                Salary Authorized
                                            </th>
                                            <th
                                                width='90'
                                                className='text-right'
                                            >
                                                Previously Reimbursed
                                            </th>
                                            <th
                                                width='110'
                                                className='text-right'
                                            >
                                                Reimbursement Amount
                                            </th>
                                            <th width='150'>Comments</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {this.state.listDistribution.map(
                                            (item, i) => (
                                                <tr key={i}>
                                                    <td>{item.SummerYear}</td>
                                                    <td>{item.Prsy}</td>
                                                    <td>
                                                        {item.BudgetEndDate}
                                                    </td>
                                                    <td>{item.PrsyName}</td>
                                                    <td>{item.FundGroup}</td>
                                                    <td className='text-right'>
                                                        {utils.currency(
                                                            item.SalaryAuthorized
                                                        )}
                                                    </td>
                                                    <td className='text-right'>
                                                        {utils.currency(
                                                            item.PreviousReimbursement
                                                        )}
                                                    </td>
                                                    <td className='text-right'>
                                                        {/* {utils.currency(
                                                            item.SalaryReimbursed
                                                        )} */}
                                                        <input
                                                            className='text-right'
                                                            data-id={i}
                                                            type='text'
                                                            name='SalaryReimbursed'
                                                            value={
                                                                item.SalaryReimbursed ||
                                                                0
                                                            }
                                                            onChange={
                                                                this
                                                                    .handleChange
                                                            }
                                                            disabled={
                                                                item.DisableSalaryReimburse
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        <textarea
                                                            data-id={i}
                                                            name='Comments'
                                                            value={
                                                                item.Comments ||
                                                                ""
                                                            }
                                                            onChange={
                                                                this
                                                                    .handleChange
                                                            }
                                                            disabled={
                                                                item.DisableComment
                                                            }
                                                        ></textarea>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                    {this.state.listDistribution.length > 1 && (
                                        <tfoot>
                                            <tr>
                                                <td colSpan='5'>&nbsp;</td>
                                                <td className='with-bg text-right'>
                                                    <ColumnTotal
                                                        list={
                                                            this.state
                                                                .listDistribution
                                                        }
                                                        columnName={
                                                            "SalaryAuthorized"
                                                        }
                                                    />
                                                </td>
                                                <td className='with-bg text-right'>
                                                    <ColumnTotal
                                                        list={
                                                            this.state
                                                                .listDistribution
                                                        }
                                                        columnName={
                                                            "PreviousReimbursement"
                                                        }
                                                    />
                                                </td>
                                                <td className='with-bg text-right'>
                                                    <ColumnTotal
                                                        list={
                                                            this.state
                                                                .listDistribution
                                                        }
                                                        columnName={
                                                            "SalaryReimbursed"
                                                        }
                                                    />
                                                </td>
                                                <td>&nbsp;</td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </table>
                            </div>
                        ) : (
                            <h2>No Records Found</h2>
                        )}
                    </div>
                ) : (
                    <div className='modal-loader'>
                        <div className='lds-ellipsis'>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                )}

                <div className='mc-footer'>
                    <button
                        className='new-btn cancel'
                        onClick={() => this.props.hideModal()}
                    >
                        Cancel
                    </button>
                    {this.state.listDistribution.length > 0 && (
                        <button className='new-btn pull-right'>Approve</button>
                    )}
                </div>
            </div>
        );
    }
}

export default DistributionTable;
