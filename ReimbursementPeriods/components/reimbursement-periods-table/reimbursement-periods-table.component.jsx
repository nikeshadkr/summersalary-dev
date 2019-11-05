import React, { useContext } from "react";

import ReimbursementPeriodsData from "../reimbursement-periods-data/reimbursement-periods-data.component";
import { AppContext } from "../../app/app.provider";

const ReimbursementsPeriodsTable = () => {
    const { listReimbursementPeriods, setReimbursementPeriods } = useContext(
        AppContext
    );
    const updateYear = (e, index) => {
        let clonedList = [...listReimbursementPeriods];
        let found = { ...clonedList[index] };
        found.ReimbursementYear = e.target.value;
        clonedList[index] = found;

        setReimbursementPeriods(clonedList);
    };

    const toggleEditMode = (value, index) => {
        let clonedList = [...listReimbursementPeriods];
        let found = { ...clonedList[index] };
        found.IsEditing = value;
        clonedList[index] = found;

        setReimbursementPeriods(clonedList);
    };

    return (
        <>
            {listReimbursementPeriods && listReimbursementPeriods.length > 0 ? (
                <div className='table-layout'>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Payment Number</th>
                                <th>Status</th>
                                <th>Pay Period End From Date</th>
                                <th>Pay Period End To Date</th>
                                <th>CUNY Pay Period End Date</th>
                                <th>GL Posting Date</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {listReimbursementPeriods.map((item, i) => (
                                <ReimbursementPeriodsData
                                    key={i}
                                    index={i}
                                    item={item}
                                    updateYear={updateYear}
                                    toggleEditMode={toggleEditMode}
                                ></ReimbursementPeriodsData>
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

export default ReimbursementsPeriodsTable;
