import React, { useContext, useEffect } from "react";
import axios from "../axios";

import Header from "../components/header/header.component";
import ReimbursementTable from "../components/reimbursement-table/reimbursement-table.component";

import Modal from "../components/modal/modal.component";
import Loader from "../components/loader/loader.component";

// For Testing
import DistributionTable from "../components/distribution-table/distribution-table.component";

import { AppContext } from "./app.provider";
import { config } from "../utilities/utils";

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
                axios.get(`${config.apiPath}/getcolleges`),
                axios.get(`${config.apiPath}/GetSummerSalaryYears`)
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
                    type={myModal.type}
                    size={myModal.size}
                />
            )}
            {/* For Testing 
            <div className='mtop-30'>
                <DistributionTable
                    data={{
                        CUNYYTDPaid: 12734,
                        CollegeCode: "BM",
                        EffortCertStatus: "F",
                        EligibleBalanceToReimburse: 0,
                        EmployeeId: "10898356 ",
                        FirstName: "DAVID",
                        LastName: "ALLEN",
                        NotYTDPaid: 0,
                        PaymentNumber: 1,
                        PreviousReimbursement: 0,
                        ReimbursementYear: 2018,
                        SalaryAuthorized: 12734,
                        TotalRecords: 110,
                        isPending: true
                    }}
                    hideModal={() => console.log("this is dummy Modal")}
                />
            </div>
            */}
        </>
    );
};

export default App;
