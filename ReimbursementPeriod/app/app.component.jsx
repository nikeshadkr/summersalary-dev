import React, { useContext, useEffect } from "react";
import axios from "../axios";

import Header from "../components/header/header.component";
import Loader from "../components/loader/loader.component";
import Modal from "../components/modal/modal.component";
import Alert from "../components/alert/alert.component";

import PeriodsTable from "../components/periods-table/periods-table.component";

import { AppContext } from "./app.provider";
import { utils, config } from "../utilities/utils";

const App = () => {
    const {
        setAppState,
        isLoading,
        toggleLoader,
        myModal,
        alert,
        closeAlert
    } = useContext(AppContext);

    const loadReimbursementPeriods = async year => {
        let listPeriods = await axios.get(
            `${config.apiPath}/GetReimbursementPeriods${
                year ? "?year=" + year : ""
            }`
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

        setAppState(prevState => ({
            ...prevState,
            listReimbursementPeriods: listPeriods.data
        }));
    };

    const loadSummerYears = async () => {
        let listSummerYears = await axios.get(
            config.apiPath + "/GetSummerSalaryYears"
        );

        setAppState(prevState => ({
            ...prevState,
            listSummerYear: listSummerYears.data
        }));
    };

    const initialize = async () => {
        try {
            toggleLoader(true);
            await axios.all([loadReimbursementPeriods(), loadSummerYears()]);

            toggleLoader(false);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        initialize();
    }, []);

    return (
        <>
            <Header loadReimbursementPeriods={loadReimbursementPeriods} />
            {alert.isAlertOpen && !alert.inModal && (
                <Alert
                    type={alert.type}
                    content={alert.content}
                    closeAlert={closeAlert}
                />
            )}

            <PeriodsTable />
            {isLoading && <Loader />}
            {myModal && myModal.showModal && (
                <Modal
                    data={myModal.data}
                    type={myModal.type}
                    size={myModal.size}
                />
            )}
        </>
    );
};

export default App;
