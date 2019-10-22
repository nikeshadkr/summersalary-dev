import React, { useContext, useEffect } from "react";
import axios from "axios";

import Header from "../components/header/header.component";
import ReimbursementTable from "../components/reimbursement-table/reimbursement-table.component";

import Modal from "../components/modal/modal.component";
import Loader from "../components/loader/loader.component";

import { AppContext } from "./app.provider";
import { Paths } from "./app.utils";

const App = () => {
    const {
        appData,
        setAppData,
        isLoading,
        showHideLoader,
        myModal
    } = useContext(AppContext);

    const loadUtilApis = async () => {
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

    useEffect(() => {
        loadUtilApis();
    }, []);

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
};

export default App;
