import React from "react";
import axios from "../../axios";

import ColumnTotal from "../column-total/column-total.component";
import DistributionData from "../distribution-data/distribution-data.component";

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

    toggleExcerpt = index => {
        let listDistribution = [...this.state.listDistribution];
        let item = { ...listDistribution[index] };

        item["showExcerpt"] = !item["showExcerpt"];
        listDistribution[index] = item;

        this.setState(state => ({
            ...state,
            listDistribution
        }));
    };

    handleChange = e => {
        e.persist();

        let listDistribution = [...this.state.listDistribution];
        let changeField = {
            ...this.state.listDistribution[e.target.dataset.id]
        };
        changeField[e.target.name] = e.target.value;

        // Set Error
        if (e.target.name === "SalaryReimbursed") {
            let amount = utils.roundDecimal(
                parseFloat(changeField["SalaryAuthorized"]) -
                    parseFloat(changeField["PreviousReimbursement"])
            );

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

                obj.showExcerpt = true;
                obj.Error = "";

                if (data.isPending) {
                    if (
                        data.EffortCertStatus !== config.effortCertStatus.done
                    ) {
                        obj.SalaryReimbursed = 0;
                        obj.DisableSalaryReimburse = true;
                        obj.DisableComment = true;
                    } else
                        obj.SalaryReimbursed = utils.roundDecimal(
                            obj.SalaryAuthorized - obj.PreviousReimbursement
                        );
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

    approveDistribution = async () => {
        const {
            data: {
                EmployeeId,
                ReimbursementYear,
                PaymentNumber,
                CollegeCode,
                CUNYYTDPaid,
                PreviousReimbursement
            },

            initAlert,
            hideModal
        } = this.props;

        const { listDistribution } = this.state;

        let SalaryReimbursedTotal = utils.getColumnTotal(
            listDistribution,
            "SalaryReimbursed"
        );

        let flag = false;
        let list = [...listDistribution];
        for (let i = 0; i < list.length; i++) {
            let amount = utils.roundDecimal(
                parseFloat(list[i]["SalaryAuthorized"]) -
                    parseFloat(list[i]["PreviousReimbursement"])
            );

            if (parseFloat(list[i]["SalaryReimbursed"]) > amount) {
                flag = true;
                break;
            }
        }
        if (flag) return;

        if (
            SalaryReimbursedTotal >
            utils.roundDecimal(CUNYYTDPaid - PreviousReimbursement)
        ) {
            initAlert({
                inModal: true,
                type: "error",
                content:
                    '"Total Reimbursement Amount" should not exceed difference of "Salary Authorized" and "Previously Reimbursed" Amount'
            });
            return;
        }

        this.showLoader(true);
        try {
            let formData = {
                EmployeeId,
                ReimbursementYear,
                PaymentNumber,
                CollegeCode,

                Distributions: listDistribution.map(obj => ({
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
            hideModal({ IndexKey: data }); // Closing modal with callback data

            initAlert({
                content: "Distribution successfully approved",
                setTimeout: 4000
            });
        } catch (error) {
            if (error.response)
                initAlert({
                    inModal: true,
                    type: "error",
                    content: error.response.statusText
                });

            this.showLoader(false);
        }
    };

    render() {
        const { listDistribution, isLoading } = this.state;

        const {
            data: {
                EmployeeId,
                FirstName,
                LastName,
                CUNYYTDPaid,
                EffortCertStatus,
                isPending
            },

            hideModal,
            alert,
            closeAlert
        } = this.props;

        const disableApproveButton =
            EffortCertStatus !== config.effortCertStatus.done;

        return (
            <div className='modal-common'>
                {/* Modal Title */}
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

                {/* Modal Body */}
                <div className='mc-body'>
                    {listDistribution.length > 0 ? (
                        <>
                            {alert.isAlertOpen && alert.inModal && (
                                <Alert
                                    type={alert.type}
                                    content={alert.content}
                                    closeAlert={closeAlert}
                                />
                            )}

                            <div className='table-layout inside-modal'>
                                <table>
                                    <thead>
                                        <tr>
                                            <th width='68'>
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
                                                {isPending ? (
                                                    <span>
                                                        Reimbursement
                                                        <br />
                                                        Amount
                                                    </span>
                                                ) : (
                                                    <span>
                                                        Salary
                                                        <br />
                                                        Reimbursed
                                                    </span>
                                                )}
                                            </th>
                                            <th width='230'>Comments</th>
                                        </tr>
                                    </thead>

                                    {/* tbody */}
                                    <DistributionData
                                        listDistribution={listDistribution}
                                        isPending={isPending}
                                        handleChange={this.handleChange}
                                        toggleExcerpt={this.toggleExcerpt}
                                    />

                                    {listDistribution.length > 1 && (
                                        <tfoot>
                                            <tr>
                                                <td colSpan='4'>&nbsp;</td>
                                                <td className='with-bg text-right'>
                                                    <ColumnTotal
                                                        list={listDistribution}
                                                        columnName={
                                                            "SalaryAuthorized"
                                                        }
                                                    />
                                                </td>
                                                <td className='with-bg text-right'>
                                                    <ColumnTotal
                                                        list={listDistribution}
                                                        columnName={
                                                            "PreviousReimbursement"
                                                        }
                                                    />
                                                </td>
                                                <td className='with-bg text-right'>
                                                    <ColumnTotal
                                                        list={listDistribution}
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
                    {listDistribution.length > 0 && isPending && (
                        <button
                            className={`button colorize pull-right ${
                                disableApproveButton || isLoading
                                    ? "disabled"
                                    : "blue"
                            }`}
                            onClick={this.approveDistribution}
                            disabled={disableApproveButton || isLoading}
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
