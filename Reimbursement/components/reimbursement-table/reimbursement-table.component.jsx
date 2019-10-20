import React, { useContext, useEffect } from "react";
import Pagination from "react-js-pagination";

import ReimbursementData from "../reimbursement-data/reimbursement-data.component";
import ColumnTotal from "../column-total/column-total.component";

import { AppContext } from "../../app/app.provider";
import { Utils } from "../../app/app.utils";

const ReimbursementTable = () => {
    const {
        appData: { listReimbursement },
        setAppData,

        loadReimbursements,
        pagination,
        setPagination
    } = useContext(AppContext);

    let totalRecord =
        listReimbursement && listReimbursement.length > 0
            ? listReimbursement[0].TotalRecords
            : 0;

    const checkOne = e => {
        e.persist();
        setAppData(appData => {
            let { listReimbursement } = appData;
            listReimbursement[e.target.dataset.id][
                e.target.name
            ] = Utils.ConvertToBool(e.target.checked);

            return {
                ...appData,
                listReimbursement
            };
        });
    };

    const checkAll = e => {
        e.persist();
        setAppData(appData => {
            let { listReimbursement } = appData;
            listReimbursement.forEach(
                item => (item.isChecked = Utils.ConvertToBool(e.target.checked))
            );

            return {
                ...appData,
                listReimbursement
            };
        });
    };

    const handlePageChange = pageIndex => {
        if (pageIndex != pagination.pageIndex)
            setPagination(state => ({
                ...state,
                pageIndex,
                reloadPage: true
            }));
    };

    useEffect(() => {
        if (pagination.reloadPage) loadReimbursements();
    }, [pagination]);

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
                                            onChange={checkAll}
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
                                    <th className='text-right'>Difference</th>
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
                                        checkOne={checkOne}
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
                                            columnName={"PreviousReimbursement"}
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
                                totalRecord
                                    ? totalRecord
                                    : pagination.pageSize * pagination.pageIndex
                            } out of ${totalRecord}`}
                        </span>
                        <Pagination
                            firstPageText={<span>&laquo;</span>}
                            lastPageText={<span>&raquo;</span>}
                            prevPageText='Prev'
                            nextPageText='Next'
                            activePage={pagination.pageIndex}
                            itemsCountPerPage={pagination.pageSize}
                            totalItemsCount={totalRecord}
                            pageRangeDisplayed={5}
                            onChange={handlePageChange}
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
};

export default ReimbursementTable;
