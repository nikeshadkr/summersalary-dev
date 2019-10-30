import React, { useContext, useEffect } from "react";
import axios from "axios";
import ReimbursementsPeriodsTable from "../components/reimbursement-periods-table/reimbursement-periods-table.component";
import { AppContext } from "./app.provider"

const App = () => {
    const {listReimbursementPeriods, setReimbursementPeriods, isLoading, toggleLoader} = useContext(AppContext);

    const loadReimbursementPeriods = async()=> {
        try {
            toggleLoader(true);
            let listPeriods = await axios.get(window.applicationPath + "ReimbursementPeriod/GetReimbursementPeriods");
            
            listPeriods.data.forEach(item=> {
                item.IsEditing = false;
            });
            //setReimbursementPeriods({...listReimbursementPeriods, listReimbursementPeriods: listPeriods.data});
            setReimbursementPeriods(listPeriods.data, ()=> toggleLoader(false));
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        loadReimbursementPeriods();
    }, []);

    return(        
        <>             
             {<ReimbursementsPeriodsTable></ReimbursementsPeriodsTable>} 
        </>
    );
}

export default App;