import React, { Fragment } from "react";

import DistributionInput from "../distribution-input/distribution-input.component";
import { utils, config } from "../../utilities/utils";

const DistributionData = ({
    listDistribution,
    isPending,
    isSalaryAuthorized,
    handleChange,
    toggleExcerpt
}) => {
    return (
        <tbody>
            {listDistribution.map((item, i) => (
                <Fragment key={i}>
                    {/* Error row */}
                    {item.Error.length > 0 && (
                        <tr className='error-row'>
                            <td colSpan='8'>{item.Error}</td>
                        </tr>
                    )}

                    <tr
                        className={`${
                            item.Error.length > 0 ? "has-error" : ""
                        }`}
                    >
                        <td>{item.SummerYear}</td>
                        <td>
                            {item.Prsy} | {item.PrsyName}
                        </td>
                        <td>
                            {item.EffortCertStatus ===
                            config.effortCertStatus.done ? (
                                "Done"
                            ) : (
                                <span className='red-text'>Not Done</span>
                            )}
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
                        <td>{item.FundGroup}</td>
                        <td className='text-right'>
                            {utils.currency(item.SalaryAuthorized)}
                        </td>

                        {!isSalaryAuthorized && (
                            <>
                                <td className='text-right'>
                                    {utils.currency(item.PreviousReimbursement)}
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
                                            handleChange={handleChange}
                                        />
                                    ) : (
                                        utils.currency(item.SalaryReimbursed)
                                    )}
                                </td>

                                <td>
                                    {isPending ? (
                                        <textarea
                                            data-id={i}
                                            name='Comments'
                                            value={item.Comments || ""}
                                            maxLength='500'
                                            onChange={handleChange}
                                            disabled={item.DisableComment}
                                        ></textarea>
                                    ) : (
                                        <div>
                                            {item.showExcerpt
                                                ? utils.excerpt(
                                                      item.Comments,
                                                      80
                                                  )
                                                : item.Comments}

                                            {item.Comments.length > 80 && (
                                                <a
                                                    style={{
                                                        display: "block"
                                                    }}
                                                    className='mtop-5'
                                                    href='#'
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        toggleExcerpt(i);
                                                    }}
                                                >
                                                    {item.showExcerpt
                                                        ? "Show more"
                                                        : "Show less"}
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </>
                        )}
                    </tr>
                </Fragment>
            ))}
        </tbody>
    );
};

export default DistributionData;
