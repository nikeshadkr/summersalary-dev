import React, { useContext, useEffect } from "react";
import axios from "axios";

import Header from "../components/header/header.component";
import ReimbursementTable from "../components/reimbursement-table/reimbursement-table.component";

import Modal from "../components/modal/modal.component";
import Loader from "../components/loader/loader.component";

import { withAppData } from "./app.provider";
import { Paths } from "./app.utils";

class App extends React.Component {
    constructor() {
        super();
    }

    loadUtils = async () => {
        const { appData, setAppData, showHideLoader } = this.props.AppContext;

        showHideLoader(true);

        try {
            const [getCollegeRes, getYearsRes] = await Promise.all([
                axios.get(`${Paths.apiPath}/getcolleges`),
                axios.get(`${Paths.apiPath}/GetSummerSalaryYears`)
            ]);

            setAppData({
                ...appData,
                listCollege: getCollegeRes.data,
                listSummerSalaryYear: getYearsRes.data
            });

            showHideLoader(false);
        } catch (error) {
            console.log(error.message);
        }
    };

    componentDidMount() {
        this.loadUtils();
    }

    render() {
        const { appData, myModal, isLoading } = this.props.AppContext;
        return (
            <>
                <Header />
                {appData.isReimbursementLoaded && <ReimbursementTable />}
                {isLoading && <Loader />}
                {myModal && myModal.showModal && (
                    <Modal
                        data={myModal.data}
                        title={myModal.title}
                        type={myModal.type}
                    />
                )}
            </>
        );
    }
}

export default withAppData(App);
