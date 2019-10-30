import React, { useContext } from "react";
import Pagination from "react-js-pagination";
import ReimbursementPeriodsData from "../reimbursement-periods-data/reimbursement-periods-data.component";
import { AppContext } from "../../app/app.provider";

const ReimbursementsPeriodsTable = () => {
    const {listReimbursementPeriods, setReimbursementPeriods} = useContext(AppContext);
    const updateYear = (value, index) => {
        let found = listReimbursementPeriods[index];
        found.ReimbursementYear = value;

        setReimbursementPeriods(listReimbursementPeriods);
    };

    const toggleEditMode = (value, index) => {
        let found = listReimbursementPeriods[index];
        found.IsEditing = value;
        setReimbursementPeriods(listReimbursementPeriods);
    }

    return(
        <>
        {
            listReimbursementPeriods && listReimbursementPeriods.length > 0 ? 
            (                
                <div className='table-layout'>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Payment Number</th>
                                <th>Status</th>
                                <th>Pay Period End From Date</th>
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
                                >                                    
                                </ReimbursementPeriodsData>
                            ))}
                        </tbody>
                    </table>
                </div>
            )  : (<h1>No records found</h1>)
        }
        </>
    );
};

export default ReimbursementsPeriodsTable;