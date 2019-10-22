import React from "react";
import Pagination from "react-js-pagination";

import ReimbursementData from "../reimbursement-data/reimbursement-data.component";
import ColumnTotal from "../column-total/column-total.component";

import { withAppData } from "../../app/app.provider";
import { Utils } from "../../app/app.utils";

class ReimbursementTable extends React.Component {
    constructor(props) {
        super(props);

        const {
            appData: { listReimbursement }
        } = this.props.AppContext;

        this.totalRecord =
            listReimbursement && listReimbursement.length > 0
                ? listReimbursement[0].TotalRecords
                : 0;
    }

    checkOne = e => {
        e.persist();
        const { appData, setAppData } = this.props.AppContext;

        let listReimbursement = [...appData.listReimbursement];
        listReimbursement[e.target.dataset.id][
            e.target.name
        ] = Utils.ConvertToBool(e.target.checked);

        setAppData({
            ...appData,
            listReimbursement
        });
    };

    checkAll = e => {
        e.persist();
        const { appData, setAppData } = this.props.AppContext;

        let listReimbursement = [...appData.listReimbursement];
        listReimbursement.forEach(item => {
            if (!item.isDisabled) item.isChecked = !item.isChecked;
        });

        setAppData({
            ...appData,
            listReimbursement,
            selectAllCheckBox: e.target.checked
        });
    };

    handlePageChange = pageIndex => {
        const {
            loadReimbursements,
            pagination,
            setPagination
        } = this.props.AppContext;

        if (pageIndex != pagination.pageIndex)
            setPagination(
                {
                    ...pagination,
                    pageIndex,
                    reloadPage: true
                },
                () => {
                    loadReimbursements();
                }
            );
    };

    render() {
        const {
            appData: {
                listReimbursement,
                selectAllCheckBox,
                isPaymentNumberOpen
            },
            pagination
        } = this.props.AppContext;

        return (
            <>
                {listReimbursement && listReimbursement.length > 0 ? (
                    <>
                        <div className='table-layout'>
                            <table>
                                <thead>
                                    <tr>
                                        <th className='check'>
                                            <input
                                                type='checkbox'
                                                name='checkAll'
                                                onChange={this.checkAll}
                                                checked={selectAllCheckBox}
                                                disabled={!isPaymentNumberOpen}
                                            />
                                        </th>
                                        <th>Employee Name</th>
                                        <th>CUNY ID</th>
                                        <th>Effort Certification</th>
                                        <th className='text-right'>
                                            Salary Authorized
                                        </th>
                                        <th className='text-right'>
                                            CUNY YTD Paid
                                        </th>
                                        <th className='text-right'>
                                            Difference
                                        </th>
                                        <th className='text-right'>
                                            Previous Reimbursement
                                        </th>
                                        <th className='text-right'>
                                            Eligible Balance to Reimburse
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {listReimbursement.map((item, i) => (
                                        <ReimbursementData
                                            key={item.EmployeeId}
                                            item={item}
                                            checkOne={this.checkOne}
                                            index={i}
                                        />
                                    ))}
                                </tbody>

                                <tfoot>
                                    <tr>
                                        <td colSpan='4'>&nbsp;</td>
                                        <td className='with-bg text-right'>
                                            <ColumnTotal
                                                list={listReimbursement}
                                                columnName={"SalaryAuthorized"}
                                            />
                                        </td>
                                        <td className='with-bg text-right'>
                                            <ColumnTotal
                                                list={listReimbursement}
                                                columnName={"CUNYYTDPaid"}
                                            />
                                        </td>
                                        <td className='with-bg text-right'>
                                            <ColumnTotal
                                                list={listReimbursement}
                                                columnName={"NotYTDPaid"}
                                            />
                                        </td>
                                        <td className='with-bg text-right'>
                                            <ColumnTotal
                                                list={listReimbursement}
                                                columnName={
                                                    "PreviousReimbursement"
                                                }
                                            />
                                        </td>
                                        <td className='with-bg text-right'>
                                            <ColumnTotal
                                                list={listReimbursement}
                                                columnName={
                                                    "EligibleBalanceToReimburse"
                                                }
                                            />
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className='pagination-container'>
                            <span className='page-count'>
                                {`Showing ${
                                    pagination.pageIndex === 1
                                        ? pagination.pageIndex
                                        : (pagination.pageIndex - 1) *
                                              pagination.pageSize +
                                          1
                                } - ${
                                    pagination.pageSize * pagination.pageIndex >
                                    this.totalRecord
                                        ? this.totalRecord
                                        : pagination.pageSize *
                                          pagination.pageIndex
                                } out of ${this.totalRecord}`}
                            </span>
                            <Pagination
                                firstPageText={<span>&laquo;</span>}
                                lastPageText={<span>&raquo;</span>}
                                prevPageText='Prev'
                                nextPageText='Next'
                                activePage={pagination.pageIndex}
                                itemsCountPerPage={pagination.pageSize}
                                totalItemsCount={this.totalRecord}
                                pageRangeDisplayed={5}
                                onChange={this.handlePageChange}
                                disabledClass='p-disabled'
                                itemClass='p-item'
                                itemClassFirst='p-first'
                                itemClassPrev='p-prev'
                                itemClassNext='p-next'
                                itemClassLast='p-last'
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <h1>No Records found</h1>
                    </>
                )}
            </>
        );
    }
}

export default withAppData(ReimbursementTable);
