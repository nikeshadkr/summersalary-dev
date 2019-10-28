import React, { useContext } from "react";

import { AppContext } from "../../app/app.provider";
import { utils, config } from "../../utilities/utils";

const ReimbursementData = ({ item, checkOne, index, isPending }) => {
    const { initModal } = useContext(AppContext);

    const openModal = (e, item) => {
        e.preventDefault();
        initModal({
            data: { ...item, isPending },
            type: "eligible-balance",
            size: "large",
            showModal: true
        });
    };

    return (
        <tr>
            <td className='check'>
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
                {item.LastName}, {item.FirstName}
            </td>
            <td>{item.EmployeeId}</td>
            <td>
                {item.EffortCertStatus === config.effortCertStatus.done
                    ? "Done"
                    : "Not Done"}
            </td>
            <td className='text-right'>
                {utils.currency(item.SalaryAuthorized)}
            </td>
            <td className='text-right'>{utils.currency(item.CUNYYTDPaid)}</td>
            <td className='text-right'>{utils.currency(item.NotYTDPaid)}</td>
            <td className='text-right'>
                {utils.currency(item.PreviousReimbursement)}
            </td>
            <td className='text-right'>
                {item.enableDistributionModal ? (
                    <a href='#' onClick={e => openModal(e, item)}>
                        {utils.currency(item.EligibleBalanceToReimburse)}
                    </a>
                ) : (
                    <>{utils.currency(item.EligibleBalanceToReimburse)}</>
                )}
            </td>
        </tr>
    );
};

export default ReimbursementData;
