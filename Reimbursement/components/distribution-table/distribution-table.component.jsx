import React, { Fragment } from "react";
import axios from "../../axios";

import ColumnTotal from "../column-total/column-total.component";
import DistributionInput from "../distribution-input/distribution-input.component";

import { withAlert } from "../../app/app.provider";
import Alert from "../alert/alert.component";

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
        changeField[e.target.name] = e.target.value;

        // Set Error
        if (e.target.name === "SalaryReimbursed") {
            let amount =
                parseFloat(changeField["SalaryAuthorized"]) -
                parseFloat(changeField["PreviousReimbursement"]);

            changeField["Error"] =
                parseFloat(e.target.value) > amount
                    ? '"Reimbursement Amount" should not exceed difference of "Salary Authorized" and "Previously Reimbursed" Amount.'
                    : "";
        }

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
                    data.isPending
                        ? "GetPendingReimbursementsDistribution"
                        : "GetProcessedReimbursementsDistribution"
                }/?employeeId=${data.EmployeeId}${
                    !data.isPending ? "&indexKey=" + data.IndexKey : ""
                }&reimbursementYear=${data.ReimbursementYear}&paymentNumber=${
                    data.PaymentNumber
                }&collegeCode=${data.CollegeCode}`
            );

            listDistributionRes.data.forEach(obj => {
                obj.BudgetEndDate = utils.formatDate(
                    obj.BudgetEndDate,
                    "MM/DD/YYYY"
                );
                obj.BudgetStartDate = utils.formatDate(
                    obj.BudgetStartDate,
                    "MM/DD/YYYY"
                );

                obj.isBudgetEndDateBeforeToday = utils.isBefore(
                    obj.BudgetEndDate,
                    new Date()
                );

                obj.Error = "";

                if (data.EffortCertStatus !== config.effortCertStatus.done) {
                    obj.SalaryReimbursed = 0;
                    obj.DisableSalaryReimburse = true;
                    obj.DisableComment = true;
                } else
                    obj.SalaryReimbursed =
                        obj.SalaryAuthorized - obj.PreviousReimbursement;
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

    approveDistribution = async () => {
        let SalaryReimbursedTotal = utils.getColumnTotal(
            this.state.listDistribution,
            "SalaryReimbursed"
        );

        let flag = false;
        this.state.listDistribution.forEach(item => {
            let amount =
                parseFloat(item["SalaryAuthorized"]) -
                parseFloat(item["PreviousReimbursement"]);

            flag = parseFloat(item["SalaryReimbursed"]) > amount ? true : false;
        });

        if (flag) return;

        if (
            SalaryReimbursedTotal >
            this.props.data.CUNYYTDPaid - this.props.data.PreviousReimbursement
        ) {
            this.props.initAlert({
                inModal: true,
                type: "error",
                content:
                    "total reimbursements cannot be more than CUNYYTDPaid - PreviousReimbursement."
            });
            return;
        }

        this.showLoader(true);
        try {
            let formData = {
                EmployeeId: this.props.data.EmployeeId,
                ReimbursementYear: this.props.data.ReimbursementYear,
                PaymentNumber: this.props.data.PaymentNumber,
                CollegeCode: this.props.data.CollegeCode,

                Distributions: this.state.listDistribution.map(obj => ({
                    SalaryReimbursed: obj.SalaryReimbursed,
                    Comments: obj.Comments,
                    EmployeeId: obj.EmployeeId,
                    SummerYear: obj.SummerYear,
                    Prsy: obj.Prsy
                }))
            };

            let { data } = await axios.post(
                `${config.apiPath}/RecordNotFullyPaidReimbursements`,
                formData
            );

            this.showLoader(false);
            this.props.hideModal({ IndexKey: data }); // Closing modal with callback data
        } catch (error) {
            if (error.response)
                this.props.initAlert({
                    inModal: true,
                    type: "error",
                    content: error.response.data
                });

            this.showLoader(false);
        }
    };

    render() {
        const {
            EmployeeId,
            FirstName,
            LastName,
            CUNYYTDPaid,
            EffortCertStatus,
            isPending
        } = this.props.data;

        const disableApproveButton =
            EffortCertStatus !== config.effortCertStatus.done;

        return (
            <div className='modal-common'>
                <div className='mc-title'>
                    <div>
                        <strong>
                            {LastName}, {FirstName}{" "}
                        </strong>
                        ({EmployeeId.trim()})
                        <span className='pull-right'>
                            CUNY YTD Paid :{" "}
                            <strong>{utils.currency(CUNYYTDPaid)}</strong>
                        </span>
                    </div>
                </div>

                <div className='mc-body'>
                    {this.state.listDistribution.length > 0 ? (
                        <>
                            {this.props.alert.isAlertOpen &&
                                this.props.alert.inModal && (
                                    <Alert
                                        type={this.props.alert.type}
                                        content={this.props.alert.content}
                                        closeAlert={this.props.closeAlert}
                                    />
                                )}

                            <div className='table-layout inside-modal'>
                                <table>
                                    <thead>
                                        <tr>
                                            <th width='75'>
                                                Summer
                                                <br />
                                                Year
                                            </th>
                                            <th width='180'>Project</th>
                                            <th width='85'>
                                                Budget <br />
                                                End Date
                                            </th>
                                            <th width='60'>
                                                Fund
                                                <br />
                                                Group
                                            </th>
                                            <th
                                                width='115'
                                                className='text-right'
                                            >
                                                Salary
                                                <br />
                                                Authorized
                                            </th>
                                            <th
                                                width='115'
                                                className='text-right'
                                            >
                                                Previously
                                                <br />
                                                Reimbursed
                                            </th>
                                            <th
                                                width='115'
                                                className='text-right'
                                            >
                                                Reimbursement
                                                <br />
                                                Amount
                                            </th>
                                            <th width='230'>Comments</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {this.state.listDistribution.map(
                                            (item, i) => (
                                                <Fragment key={i}>
                                                    {/* Error row */}
                                                    {item.Error.length > 0 && (
                                                        <tr className='error-row'>
                                                            <td colSpan='8'>
                                                                {item.Error}
                                                            </td>
                                                        </tr>
                                                    )}

                                                    <tr
                                                        className={`${
                                                            item.Error.length >
                                                            0
                                                                ? "has-error"
                                                                : ""
                                                        }`}
                                                    >
                                                        <td>
                                                            {item.SummerYear}
                                                        </td>
                                                        <td>
                                                            {item.Prsy} |{" "}
                                                            {item.PrsyName}
                                                        </td>
                                                        <td
                                                            className={`${
                                                                item.isBudgetEndDateBeforeToday
                                                                    ? "red-text"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {item.BudgetEndDate}
                                                        </td>
                                                        <td>
                                                            {item.FundGroup}
                                                        </td>
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
                                                            {isPending ? (
                                                                <DistributionInput
                                                                    data-id={i}
                                                                    type='text'
                                                                    name='SalaryReimbursed'
                                                                    autoComplete='off'
                                                                    value={
                                                                        item.DisableSalaryReimburse
                                                                            ? item.SalaryReimbursed
                                                                            : item.SalaryReimbursed ||
                                                                              ""
                                                                    }
                                                                    disabled={
                                                                        item.DisableSalaryReimburse
                                                                    }
                                                                    handleChange={
                                                                        this
                                                                            .handleChange
                                                                    }
                                                                />
                                                            ) : (
                                                                utils.currency(
                                                                    item.SalaryReimbursed
                                                                )
                                                            )}
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
                                                                    item.DisableComment ||
                                                                    !isPending
                                                                }
                                                            ></textarea>
                                                        </td>
                                                    </tr>
                                                </Fragment>
                                            )
                                        )}
                                    </tbody>
                                    {this.state.listDistribution.length > 1 && (
                                        <tfoot>
                                            <tr>
                                                <td colSpan='4'>&nbsp;</td>
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
                                            </tr>
                                        </tfoot>
                                    )}
                                </table>
                            </div>
                        </>
                    ) : (
                        <h2>No Records Found</h2>
                    )}

                    {this.state.isLoading && (
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
                        className='new-btn cancel'
                        onClick={() => this.props.hideModal()}
                    >
                        Cancel
                    </button>
                    {this.state.listDistribution.length > 0 && isPending && (
                        <button
                            className={`new-btn pull-right ${
                                disableApproveButton ? "disabled" : ""
                            }`}
                            onClick={this.approveDistribution}
                            disabled={disableApproveButton}
                        >
                            Approve
                        </button>
                    )}
                </div>
            </div>
        );
    }
}

export default withAlert(DistributionTable);
