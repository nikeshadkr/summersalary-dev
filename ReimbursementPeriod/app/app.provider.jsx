import React, { useState } from "react";

export const AppContext = React.createContext({
    listReimbursementPeriods: [],
    setReimbursementPeriods: () => {},

    isLoading: false,
    toggleLoader: () => {},

    myModal: {},
    initModal: () => {},
    hideModal: () => {}
});

const AppProvider = ({ children }) => {
    const [appState, setAppState] = useState({
        listReimbursementPeriods: [],
        isLoading: false,

        myModal: {
            data: {},
            type: "",
            size: "",
            showModal: false,
            onClose: () => {}
        }
    });

    const { listReimbursementPeriods, isLoading, myModal } = appState;

    const setReimbursementPeriods = updatedList =>
        setAppState(state => ({
            ...state,
            listReimbursementPeriods: updatedList
        }));

    const toggleLoader = isLoading =>
        setAppState(state => ({
            ...state,
            isLoading
        }));

    const initModal = myModal => {
        document.body.classList.add("modal-open");
        setAppState(state => ({ ...state, myModal }));
    };
    const hideModal = cData => {
        document.body.classList.remove("modal-open");

        if (cData !== undefined) myModal.onClose(cData);

        setAppState(state => ({
            ...state,
            myModal: {
                showModal: false
            }
        }));
    };

    const dataToPass = {
        listReimbursementPeriods,
        setReimbursementPeriods,

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
