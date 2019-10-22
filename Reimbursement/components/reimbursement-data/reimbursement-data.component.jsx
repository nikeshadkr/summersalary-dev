import React, { useContext, useEffect } from "react";

import { AppContext } from "../../app/app.provider";
import { Utils } from "../../app/app.utils";

const ReimbursementData = ({ item, checkOne, index }) => {
    const { initModal } = useContext(AppContext);

    const openModal = (e, item) => {
        e.preventDefault();
        initModal({
            data: [item],
            title: "This is the modal title",
            type: "eligible-balance",
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
            <td>{item.EffortCertStatus === "F" ? "Done" : "Not Done"}</td>
            <td className='text-right'>
                {Utils.Currency(item.SalaryAuthorized)}
            </td>
            <td className='text-right'>{Utils.Currency(item.CUNYYTDPaid)}</td>
            <td className='text-right'>{Utils.Currency(item.NotYTDPaid)}</td>
            <td className='text-right'>
                {Utils.Currency(item.PreviousReimbursement)}
            </td>
            <td className='text-right'>
                <a href='#' onClick={e => openModal(e, item)}>
                    {Utils.Currency(item.EligibleBalanceToReimburse)}
                </a>
            </td>
        </tr>
    );
};

export default ReimbursementData;
