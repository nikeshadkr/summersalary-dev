import React, { useState } from "react";

export const AppContext = React.createContext({
    appState: {},
    setAppState: () => {},

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
    };

    const [isLoading, setLoading] = useState(false);
    const toggleLoader = isLoading => setLoading(isLoading);

    const dataToPass = {
        appState,
        setAppState,

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
