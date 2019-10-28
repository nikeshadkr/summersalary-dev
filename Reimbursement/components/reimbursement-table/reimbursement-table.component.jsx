import React, { useContext, useEffect } from "react";
import Pagination from "react-js-pagination";

import ReimbursementData from "../reimbursement-data/reimbursement-data.component";
import ColumnTotal from "../column-total/column-total.component";

import { AppContext } from "../../app/app.provider";
import { utils } from "../../utilities/utils";

const ReimbursementTable = () => {
    const {
        appData,
        setAppData,

        loadReimbursements,
        pagination,
        setPagination
    } = useContext(AppContext);

    const {
        isPending,
        listReimbursement,
        selectAllCheckBox,
        isPaymentNumberOpen
    } = appData;

    let totalRecord =
        listReimbursement && listReimbursement.length > 0
            ? listReimbursement[0].TotalRecords
            : 0;

    const checkOne = e => {
        e.persist();

        let listReimbursement = [...appData.listReimbursement];
        listReimbursement[e.target.dataset.id][
            e.target.name
        ] = utils.convertToBool(e.target.checked);

        setAppData({
            ...appData,
            listReimbursement
        });
    };

    const checkAll = e => {
        e.persist();

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

    const handlePageChange = pageIndex => {
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

    return (
        <>
            {listReimbursement && listReimbursement.length > 0 ? (
                <>
                    <div className='table-layout'>
                        <table>
                            <thead>
                                <tr>
                                    <th width='30' className='check'>
                                        <input
                                            type='checkbox'
                                            name='checkAll'
                                            onChange={checkAll}
                                            checked={selectAllCheckBox}
                                            disabled={!isPaymentNumberOpen}
                                        />
                                    </th>
                                    <th width='180'>Employee Name</th>
                                    <th width='80'>
                                        CUNY <br /> ID
                                    </th>
                                    <th width='80'>
                                        Effort <br /> Certification
                                    </th>
                                    <th width='120' className='text-right'>
                                        Salary <br /> Authorized
                                    </th>
                                    <th width='120' className='text-right'>
                                        CUNY YTD <br /> Paid
                                    </th>
                                    <th width='120' className='text-right'>
                                        Difference
                                    </th>
                                    <th width='120' className='text-right'>
                                        Previous <br /> Reimbursement
                                    </th>
                                    <th width='120' className='text-right'>
                                        Eligible Balance <br /> to Reimburse
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
                                        isPending={isPending}
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
