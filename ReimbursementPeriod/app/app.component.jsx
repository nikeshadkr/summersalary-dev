import React, { useContext, useEffect } from "react";
import axios from "../axios";

import Header from "../components/header/header.component";
import Loader from "../components/loader/loader.component";
import ReimbursementsPeriodsTable from "../components/reimbursement-periods-table/reimbursement-periods-table.component";

import { AppContext } from "./app.provider";
import { utils, config } from "../utilities/utils";

const App = () => {
    const { setReimbursementPeriods, isLoading, toggleLoader } = useContext(
        AppContext
    );

    const loadReimbursementPeriods = async () => {
        try {
            toggleLoader(true);
            let listPeriods = await axios.get(
                config.appPath + "ReimbursementPeriod/GetReimbursementPeriods"
            );

            listPeriods.data.forEach(item => {
                item.IsEditing = false;
                item.PayPeriodEndFromDate = utils.formatDate(
                    item.PayPeriodEndFromDate,
                    "MM/DD/YYYY"
                );
                item.PayPeriodEndToDate = utils.formatDate(
                    item.PayPeriodEndToDate,
                    "MM/DD/YYYY"
                );
                item.CUNYPayPeriodEndDate = utils.formatDate(
                    item.CUNYPayPeriodEndDate,
                    "MM/DD/YYYY"
                );
                item.GLPostingDate = utils.formatDate(
                    item.GLPostingDate,
                    "MM/DD/YYYY"
                );
            });

            setReimbursementPeriods(listPeriods.data);
            toggleLoader(false);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        loadReimbursementPeriods();
    }, []);

    return (
        <>
            <Header />
            <ReimbursementsPeriodsTable></ReimbursementsPeriodsTable>
            {isLoading && <Loader />}
        </>
    );
};

export default App;
