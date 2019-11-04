import React, { useContext, useEffect } from "react";
import Pagination from "react-js-pagination";

import ReimbursementData from "../reimbursement-data/reimbursement-data.component";

import { AppContext } from "../../app/app.provider";

import Alert from "../alert/alert.component";
import { utils } from "../../utilities/utils";

const ReimbursementTable = () => {
    const {
        appData,
        setAppData,
        filters,

        alert,
        closeAlert,

        loadReimbursements,
        pagination,
        setPagination
    } = useContext(AppContext);

    const {
        listReimbursement,
        selectAllCheckBox,
        isPaymentNumberOpen
    } = appData;

    const { isPending } = filters;

    let totalRecord = 0,
        totalSalaryReimbursed = 0, // For Prosessed only
        totalEligibleBalanceToReimburse = 0,
        totalSalaryAuthorized = 0,
        totalCUNYYTDPaid = 0,
        totalNotYTDPaid = 0,
        totalPrevReimbursement = 0;

    if (listReimbursement && listReimbursement.length > 0) {
        totalRecord = listReimbursement[0].TotalRecords;
        totalSalaryReimbursed = listReimbursement[0].TotalSalaryReimbursed;
        totalEligibleBalanceToReimburse =
            listReimbursement[0].TotalEligibleBalanceToReimburse;
        totalSalaryAuthorized = listReimbursement[0].TotalSalaryAuthorized;
        totalCUNYYTDPaid = listReimbursement[0].TotalCUNYYTDPaid;
        totalNotYTDPaid = listReimbursement[0].TotalNotYTDPaid;
        totalPrevReimbursement = listReimbursement[0].TotalPrevReimbursement;
    }

    let showTotal = false;
    if (listReimbursement.length > 0)
        showTotal =
            Math.ceil(totalRecord / pagination.pageSize) ===
            pagination.pageIndex;

    const checkOne = e => {
        e.persist();

        let listReimbursement = [...appData.listReimbursement];
        let item = { ...listReimbursement[e.target.dataset.id] };
        item[e.target.name] = utils.convertToBool(e.target.checked);
        listReimbursement[e.target.dataset.id] = item;

        setAppData({
            ...appData,
            listReimbursement
        });
    };

    const checkAll = e => {
        e.persist();

        let listReimbursement = [...appData.listReimbursement];
        listReimbursement = listReimbursement.map(item => {
            let tempItem = { ...item };
            if (!tempItem.isDisabled) tempItem.isChecked = !tempItem.isChecked;
            return tempItem;
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
                    {alert.isAlertOpen && !alert.inModal && (
                        <Alert
                            type={alert.type}
                            content={alert.content}
                            closeAlert={closeAlert}
                        />
                    )}

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
                                    {isPending ? (
                                        <th width='120' className='text-right'>
                                            Eligible Balance <br /> to Reimburse
                                        </th>
                                    ) : (
                                        <th width='120' className='text-right'>
                                            Salary <br /> Reimbursed
                                        </th>
                                    )}
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

                            {showTotal && (
                                <tfoot>
                                    <tr>
                                        <td colSpan='4'>&nbsp;</td>
                                        <td className='with-bg text-right'>
                                            {utils.currency(
                                                totalSalaryAuthorized
                                            )}
                                        </td>
                                        <td className='with-bg text-right'>
                                            {utils.currency(totalCUNYYTDPaid)}
                                        </td>
                                        <td className='with-bg text-right'>
                                            {utils.currency(totalNotYTDPaid)}
                                        </td>
                                        <td className='with-bg text-right'>
                                            {utils.currency(
                                                totalPrevReimbursement
                                            )}
                                        </td>
                                        <td className='with-bg text-right'>
                                            {isPending
                                                ? utils.currency(
                                                      totalEligibleBalanceToReimburse
                                                  )
                                                : utils.currency(
                                                      totalSalaryReimbursed
                                                  )}
                                        </td>
                                    </tr>
                                </tfoot>
                            )}
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
