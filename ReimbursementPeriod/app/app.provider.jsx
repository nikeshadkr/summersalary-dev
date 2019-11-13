import React, { useState, useEffect } from "react";

export const AppContext = React.createContext({
    appState: {},
    setAppState: () => {},

    isLoading: false,
    toggleLoader: () => {},

    myModal: {},
    initModal: () => {},
    hideModal: () => {},

    alert: {},
    initAlert: () => {},
    closeAlert: () => {}
});

const AppProvider = ({ children }) => {
    const [appState, setAppState] = useState({
        summerYear: "",
        listReimbursementPeriods: [],
        listSummerYear: []
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

        if (alert && alert.inModal) closeAlert();
    };

    const [isLoading, setLoading] = useState(false);
    const toggleLoader = isLoading => setLoading(isLoading);

    const [alert, setAlert] = useState({
        inModal: false,
        isAlertOpen: false,
        setTimeout: false,
        type: "",
        content: ""
    });

    const initAlert = option => {
        // Default Options
        const alertOptions = {
            isAlertOpen: true,
            inModal: false,
            setTimeout: false,
            type: "success",

            ...option
        };

        setAlert(alertOptions);
    };

    useEffect(() => {
        if (alert.setTimeout)
            setTimeout(() => {
                closeAlert();
            }, alert.setTimeout);
    }, [alert]);

    const closeAlert = () => {
        setAlert({
            isAlertOpen: false,
            inModal: false,
            setTimeout: false,
            type: "success",
            content: ""
        });
    };

    const dataToPass = {
        appState,
        setAppState,

        isLoading,
        toggleLoader,

        myModal,
        initModal,
        hideModal,

        alert,
        initAlert,
        closeAlert
    };

    return (
        <AppContext.Provider value={dataToPass}>{children}</AppContext.Provider>
    );
};

export default AppProvider;
