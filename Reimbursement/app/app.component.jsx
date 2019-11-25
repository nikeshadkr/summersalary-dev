import React, { useContext, useEffect } from "react";
import axios from "../axios";

import Header from "../components/header/header.component";
import ReimbursementTable from "../components/reimbursement-table/reimbursement-table.component";

import Modal from "../components/modal/modal.component";
import Loader from "../components/loader/loader.component";

// For Testing
import DistributionTable from "../components/distribution-table/distribution-table.component";
import EmployeeTable from "../components/employee-table/employee-table.component";

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
                        isPending: true,
                        CUNYYTDPaid: 35566.67,
                        CollegeCode: "CC",
                        EffortCertStatus: "F",
                        EligibleBalanceToReimburse: 23711.12,
                        EmployeeId: "23359223 ",
                        FirstName: "MARIA",
                        LastName: "TZORTZIOU",
                        NotYTDPaid: -11855.55,
                        PaymentNumber: 2,
                        PreviousReimbursement: 0,
                        ReimbursementYear: 2018,
                        SalaryAuthorized: 23711.12
                    }}
                    hideModal={() => console.log("this is dummy Modal")}
                />
            </div>*/}

            {/* For Testing 
            <EmployeeTable
                hideModal={() => console.log("this is dummy Modal")}
                data={{
                    EmployeeId: "23348326",
                    ReimbursementYear: 2018,
                    FirstName: "LOUIS-PIERRE",
                    LastName: "ARGUIN"
                }}
            />
            */}
        </>
    );
};

export default App;
