import React, { useState } from "react";

export const AppContext = React.createContext({
    listReimbursementPeriods: [],
    setReimbursementPeriods: () => {},

    isLoading: false,
    toggleLoader: () => {}
});

const AppProvider = ({ children }) => {
    const [appState, setAppState] = useState({
        listReimbursementPeriods: [],
        isLoading: false
    });

    const { listReimbursementPeriods, isLoading } = appState;

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

    let dataToPass = {
        listReimbursementPeriods: listReimbursementPeriods,
        setReimbursementPeriods: setReimbursementPeriods,
        isLoading: isLoading,
        toggleLoader: toggleLoader
    };

    return (
        <AppContext.Provider value={dataToPass}>{children}</AppContext.Provider>
    );
};

export default AppProvider;
