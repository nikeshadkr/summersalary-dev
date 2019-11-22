import React, { useContext } from "react";

import PeriodWrapper from "../period-wrapper/period-wrapper.component";
import PeriodsData from "../periods-data/periods-data.component";

import { AppContext } from "../../app/app.provider";

const PeriodsTable = () => {
    const {
        appState: { listReimbursementPeriods }
    } = useContext(AppContext);

    return (
        <>
            {listReimbursementPeriods && listReimbursementPeriods.length > 0 ? (
                <div className='table-layout'>
                    <table>
                        <thead>
                            <tr>
                                <th width='90'>Year</th>
                                <th width='80'>
                                    Payment <br />
                                    Number
                                </th>
                                <th width='80'>Status</th>
                                <th width='120'>
                                    Pay Period <br />
                                    End From Date
                                </th>
                                <th width='120'>
                                    Pay Period <br />
                                    End To Date
                                </th>
                                <th width='120'>
                                    CUNY Pay Period <br />
                                    End Date
                                </th>
                                <th width='120'>GL Posting Date</th>
                                <th width='60'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listReimbursementPeriods.map((item, i) => (
                                <PeriodWrapper
                                    key={i}
                                    period={periodProps => (
                                        <PeriodsData
                                            index={i}
                                            item={item}
                                            listReimbursementPeriods={
                                                listReimbursementPeriods
                                            }
                                            {...periodProps}
                                        ></PeriodsData>
                                    )}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <h1>No records found</h1>
            )}
        </>
    );
};

export default PeriodsTable;
