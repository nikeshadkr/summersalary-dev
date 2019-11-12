import React, { useState } from "react";
import axios from "../axios";

import { config, utils } from "../utilities/utils";

export const AppContext = React.createContext({
    appState: {},
    setAppState: () => {},
    getPayPeriodEndFrom: () => {},

    isLoading: false,
    toggleLoader: () => {},

    myModal: {},
    initModal: () => {},
    hideModal: () => {}
});

const AppProvider = ({ children }) => {
    const [appState, setAppState] = useState({
        summerYear: "",
        listReimbursementPeriods: [],
        listSummerYear: [],
        listPayPeriodEndFrom: []
    });

    const [myModal, setMyModal] = useState({
        data: {},
        type: "",
        size: "",
        showModal: false,
        onClose: () => {}
    });

    const initModal = myModal => {
        document.body.classList.add("modal-open");
        setMyModal({ ...myModal });
    };

    const hideModal = cData => {
        document.body.classList.remove("modal-open");

        if (cData !== undefined) myModal.onClose(cData);

        setMyModal(myModal => ({
            ...myModal,
            showModal: false
        }));
    };

    const [isLoading, setLoading] = useState(false);
    const toggleLoader = isLoading => setLoading(isLoading);

    const getPayPeriodEndFrom = async ReimbursementYear => {
        let listPayPeriodRes = await axios.get(
            config.appPath +
                "ReimbursementPeriod/GetPayrollCalendarCollection?year=" +
                ReimbursementYear
        );

        listPayPeriodRes.data.forEach(obj => {
            obj.PayPeriodEnding = utils.formatDate(
                obj.PayPeriodEnding,
                "MM/DD/YYYY"
            );
        });

        setAppState(prevState => ({
            ...prevState,
            listPayPeriodEndFrom: listPayPeriodRes.data
        }));
    };

    const dataToPass = {
        appState,
        setAppState,
        getPayPeriodEndFrom,

        isLoading,
        toggleLoader,

        myModal,
        initModal,
        hideModal
    };

    return (
        <AppContext.Provider value={dataToPass}>{children}</AppContext.Provider>
    );
};

export default AppProvider;
