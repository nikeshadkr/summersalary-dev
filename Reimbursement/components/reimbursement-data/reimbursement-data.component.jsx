import React, { useContext } from "react";

import { AppContext } from "../../app/app.provider";

import { utils, config } from "../../utilities/utils";

const ReimbursementData = ({ item, checkOne, index, isPending }) => {
    const { loadReimbursements, initModal } = useContext(AppContext);

    const openModal = (e, item, type) => {
        e.preventDefault();

        let classValue;
        switch (type) {
            case config.modalTypes.salaryAuthorized:
                classValue = "medium";
                break;

            case config.modalTypes.eligibleBalance:
                classValue = "x-large";
                break;

            default:
                classValue = "large";
        }

        initModal({
            data: { ...item, isPending: item.isPending },
            type: type,
            size: classValue,
            showModal: true,
            onClose: cData => {
                if (type == config.modalTypes.eligibleBalance)
                    loadReimbursements();
            }
        });
    };

    /*const approveCallback = cData => {

        let listReimbursement = [...appData.listReimbursement];
        let updatedList = listReimbursement.map(o => {
            let obj = { ...o };

            // set isProcessed to true so that the item in pending behave as procesed
            if (obj.EmployeeId === item.EmployeeId) {
                obj.isPending = false;
                obj.IndexKey = cData.IndexKey;
            }

            return obj;
        });

        setAppData({
            ...appData,
            listReimbursement: updatedList
        });
    };*/

    return (
        <tr>
            <td className={`check ${isPending ? "" : "hidden"}`}>
                <input
                    data-id={index}
                    name='isChecked'
                    type='checkbox'
                    value={true}
                    onChange={checkOne}
                    checked={item.isChecked}
                    disabled={item.isDisabled}
                />
            </td>
            <td>
                <a
                    href='#'
                    onClick={e =>
                        openModal(e, item, config.modalTypes.employeeInfo)
                    }
                >
                    {item.LastName}, {item.FirstName}
                </a>
            </td>
            <td>{item.EmployeeId}</td>
            <td>
                {item.EffortCertStatus === config.effortCertStatus.done
                    ? "Done"
                    : "Not Done"}
            </td>
            <td className='text-right'>
                <a
                    href='#'
                    onClick={e =>
                        openModal(e, item, config.modalTypes.salaryAuthorized)
                    }
                >
                    {utils.currency(item.SalaryAuthorized)}
                </a>
            </td>
            <td className='text-right'>{utils.currency(item.CUNYYTDPaid)}</td>
            <td className='text-right'>{utils.currency(item.NotYTDPaid)}</td>
            <td className='text-right'>
                {item.PaymentNumber > 1 && item.PreviousReimbursement > 0 ? (
                    <a
                        href='#'
                        onClick={e =>
                            openModal(
                                e,
                                item,
                                config.modalTypes.previousPayments
                            )
                        }
                    >
                        {utils.currency(item.PreviousReimbursement)}
                    </a>
                ) : (
                    <>{utils.currency(item.PreviousReimbursement)}</>
                )}
            </td>
            <td className='text-right'>
                {item.enableDistributionModal ? (
                    <a
                        href='#'
                        onClick={e =>
                            openModal(
                                e,
                                item,
                                config.modalTypes.eligibleBalance
                            )
                        }
                    >
                        {utils.currency(
                            isPending
                                ? item.EligibleBalanceToReimburse
                                : item.SalaryReimbursed
                        )}
                    </a>
                ) : (
                    <>
                        {utils.currency(
                            isPending
                                ? item.EligibleBalanceToReimburse
                                : item.SalaryReimbursed
                        )}
                    </>
                )}
            </td>
        </tr>
    );
};

export default ReimbursementData;
