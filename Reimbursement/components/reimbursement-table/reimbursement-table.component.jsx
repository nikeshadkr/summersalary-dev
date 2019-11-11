import React, { useContext, useState } from "react";
import axios from "../../axios";

import Pagination from "react-js-pagination";
import ReimbursementData from "../reimbursement-data/reimbursement-data.component";

import { AppContext } from "../../app/app.provider";

import Alert from "../alert/alert.component";
import { config, utils } from "../../utilities/utils";

const ReimbursementTable = () => {
    const {
        appData,
        setAppData,
        filters,
        showHideLoader,

        alert,
        initAlert,
        closeAlert,

        loadReimbursements,
        pagination,
        setPagination
    } = useContext(AppContext);

    const {
        listReimbursement,
        isAllchecked,
        isPaymentNumberOpen,
        isReimbursementLoaded
    } = appData;

    const { isPending } = filters;
    const [enableApprove, setEnableApprove] = useState(false);

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
    if (listReimbursement.length > 0) {
        showTotal =
            Math.ceil(totalRecord / pagination.pageSize) ===
            pagination.pageIndex;
    }

    const checkOne = e => {
        e.persist();

        let clonedList = [...listReimbursement];
        let item = { ...clonedList[e.target.dataset.id] };
        item[e.target.name] = utils.convertToBool(e.target.checked);
        clonedList[e.target.dataset.id] = item;

        setAppData(
            {
                ...appData,
                listReimbursement: clonedList
            },
            updatedState => {
                enableActionMethods(updatedState);
            }
        );
    };

    const checkAll = e => {
        e.persist();

        let clonedList = [...listReimbursement];
        clonedList = clonedList.map(item => {
            let obj = { ...item };
            if (!obj.isDisabled) obj.isChecked = e.target.checked;
            return obj;
        });

        setAppData(
            {
                ...appData,
                listReimbursement: clonedList,
                isAllchecked: e.target.checked
            },
            updatedState => {
                enableActionMethods(updatedState);
            }
        );
    };

    const enableActionMethods = newState => {
        let list = newState.listReimbursement.filter(
            obj => obj.isChecked === true
        );
        setEnableApprove(list.length > 0);

        /*for (let i = 0; i < list.length; i++) {
            if (list[i]["isChecked"] === true) {
                setEnableApprove(true);
                break;
            }
            if (i + 1 === list.length && list[i]["isChecked"] !== true)
                setEnableApprove(false);
        }*/
    };

    const handlePageChange = pageIndex => {
        if (pageIndex != pagination.pageIndex) {
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

            setEnableApprove(false);
        }
    };

    const aproveAll = async () => {
        let formData = [];

        listReimbursement.forEach(item => {
            let obj = { ...item };
            if (obj.isChecked === true) {
                formData.push({
                    EmployeeId: obj.EmployeeId,
                    ReimbursementYear: obj.ReimbursementYear,
                    PaymentNumber: obj.PaymentNumber,
                    CollegeCode: obj.CollegeCode
                });
            }
        });

        try {
            if (formData.length > 0) {
                showHideLoader(true);

                await axios.post(
                    `${config.apiPath}/RecordFullyPaidReimbursements`,
                    formData
                );

                await loadReimbursements(); //Reloading list after successfull approve

                setEnableApprove(false);

                initAlert({
                    content: "Successfully approved reimbursement records",
                    setTimeout: 4000
                });

                showHideLoader(false);
            }
        } catch (error) {
            if (error.response)
                initAlert({
                    type: "error",
                    content: error.response.data
                        ? error.response.data
                        : "Could not complete your request"
                });

            console.log(error);
            showHideLoader(false);
        }
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

                    {/* Approve Button */
                    isReimbursementLoaded && filters.isPending && (
                        <button
                            type='button'
                            onClick={aproveAll}
                            className={`button colorize blue ${
                                enableApprove ? "" : "disabled"
                            } mbottom-10`}
                            disabled={!enableApprove}
                        >
                            Approve
                        </button>
                    )}

                    <div className='table-layout'>
                        <table>
                            <thead>
                                <tr>
                                    <th
                                        width='30'
                                        className={`check ${
                                            isPending ? "" : "hidden"
                                        }`}
                                    >
                                        <input
                                            type='checkbox'
                                            name='checkAll'
                                            onChange={checkAll}
                                            checked={isAllchecked}
                                            disabled={!isPaymentNumberOpen}
                                        />
                                    </th>
                                    <th width='150'>Employee Name</th>
                                    <th width='80'>CUNY ID</th>
                                    <th width='90'>
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
                                        <td
                                            colSpan={`${isPending ? "4" : "3"}`}
                                        >
                                            &nbsp;
                                        </td>
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
