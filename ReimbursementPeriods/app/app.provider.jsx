import React, { useContext, useEffect } from "react";
import axios from "axios";


export const AppContext = React.createContext({
    listReimbursementPeriods: [],
    setReimbursementPeriods: () => {},

    isLoading: false,
    toggleLoader: () => {}
});

class AppProvider extends React.Component{
    constructor() {
        super();

        this.state = {
            listReimbursementPeriods: [],
            isLoading: false
        };
    };   

    setReimbursementPeriods = (listReimbursementPeriods, callback) =>
        this.setState(
                state => (state.listReimbursementPeriods = listReimbursementPeriods),                 
                () => {callback && callback(this.state.listReimbursementPeriods)}
            );

    toggleLoader = (isLoading, callback) =>
        this.setState(state => ({...state, isLoading}), callback && callback(this.state.isLoading));

    render() {
        let dataToPass = {
            listReimbursementPeriods: this.state.listReimbursementPeriods,
            setReimbursementPeriods: this.setReimbursementPeriods,
            isLoading: this.state.isLoading,
            toggleLoader: this.toggleLoader
        }
        return(            
            <AppContext.Provider value={dataToPass}>
                 {this.props.children}
            </AppContext.Provider>
        );
    };
}

export default AppProvider;