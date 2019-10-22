import React, { createContext, useState } from "react";
import axios from "axios";

import { Paths, Utils } from "./app.utils";

export const AppContext = createContext({
    appData: {},
    setAppData: () => {},

    isLoading: false,
    showHideLoader: () => {},

    myModal: {},
    initModal: () => {},
    hideModal: () => {},

    loadReimbursements: () => {},
    pagination: {},
    setPagination: () => {},
    filters: {},
    setFilters: () => {},

    validateForm: () => {},
    validateField: () => {}
});

const validationRules = {
    required: val => val !== null && val !== undefined && val !== ""
};

const AppProvider = ({ children }) => {
    const [appData, setAppData] = useState({
        college: {
            value: "",
            isTouched: false,
            isValid: false,
            errors: [],
            validationRules: [
                {
                    rule: validationRules.required,
                    message: "This field is required"
                }
            ]
        },
        summerYear: {
            value: "",
            isTouched: false,
            isValid: false,
            errors: [],
            validationRules: [
                {
                    rule: validationRules.required,
                    message: "This field is required"
                }
            ]
        },
        paymentNumber: {
            value: "",
            isTouched: false,
            isValid: false,
            errors: [],
            validationRules: [
                {
                    rule: validationRules.required,
                    message: "This field is required"
                }
            ]
        },

        listCollege: [],
        listSummerSalaryYear: [],
        listPaymentNumber: [],
        isPending: true,

        certificationStatus: "",
        paymentStatus: "",

        listReimbursement: [],
        isReimbursementLoaded: false,
        selectAllCheckBox: false,
        isPaymentNumberOpen: false
    });

    const [isLoading, setLoader] = useState(false);
    const showHideLoader = val => setLoader(val);

    const [myModal, setModal] = useState({
        data: [],
        title: "",
        type: "",
        showModal: false
    });
    const initModal = obj => {
        document.body.classList.add("modal-open");
        setModal({
            ...obj
        });
    };
    const hideModal = () => {
        document.body.classList.remove("modal-open");
        setModal({
            showModal: false
        });
    };

    const [pagination, setPagination] = useState({
        pageIndex: 1,
        pageSize: Utils.PageSize,
        reloadPage: false
    });

    const [filters, setFilters] = useState({
        isFilterValid: false,
        isPending: true,
        summerYear: "",
        college: "",
        paymentNumber: "",
        certificationStatus: "",
        paymentStatus: "",

        // List payment Numbers changes dynamically when changing year so we loose the old list
        // That is why we need to back up the list on filter
        listPaymentNumber: []
    });

    const loadReimbursements = async fromFilter => {
        showHideLoader(true);

        if (fromFilter) setPagination(state => ({ ...state, pageIndex: 1 }));

        try {
            let listReimbursement = await axios.get(
                `${Paths.apiPath}/${
                    filters.isPending
                        ? "GetPendingReimbursements"
                        : "GetProcessedReimbursements"
                }?year=${filters.summerYear}&paymentNumber=${
                    filters.paymentNumber
                }&collegeCode=${filters.college}&effortCertStatus=${
                    filters.certificationStatus
                }&paymentStatus=${filters.paymentStatus}&pageIndex=${
                    pagination.pageIndex
                }&pageSize=${pagination.pageSize}`
            );

            let [isPaymentNumberOpen] = filters.listPaymentNumber.map(obj =>
                obj.PaymentNumber == filters.paymentNumber ? obj.IsOpen : null
            );

            //console.log(filters.listPaymentNumber);
            //console.log(isPaymentNumberOpen);

            listReimbursement.data.forEach(item => {
                item.isChecked = false;
                item.isDisabled =
                    !isPaymentNumberOpen ||
                    item.EffortCertStatus === "X" ||
                    item.NotYTDPaid !== 0;
            });

            setAppData(appData => {
                return {
                    ...appData,
                    listReimbursement: listReimbursement.data,
                    isReimbursementLoaded: true,
                    selectAllCheckBox: false,
                    isPaymentNumberOpen
                };
            });

            showHideLoader(false);
        } catch (error) {
            showHideLoader(false);
            console.log(error.message);
        }
    };

    const requiredFields = ["college", "summerYear", "paymentNumber"];
    const validateForm = () => {
        let isValid = true;
        let newfilterParams = {};
        let newValidatedFields = {};

        requiredFields.map(fieldName => {
            let field = { ...appData[fieldName] };
            let newValidatedField = validateField(field);

            if (newValidatedField.isValid === false) isValid = false;
            newValidatedFields[fieldName] = newValidatedField;
            newfilterParams[fieldName] = newValidatedField.value;

            return null;
        });

        return [newValidatedFields, newfilterParams, isValid];
    };

    const validateField = field => {
        field.errors = [];
        field.isValid = true;

        field.validationRules.map(vRule => {
            if (!vRule.rule(field.value)) {
                field.errors.push(vRule.message);
                field.isValid = false;
            }
        });

        return field;
    };

    return (
        <AppContext.Provider
            value={{
                appData,
                setAppData,

                isLoading,
                showHideLoader,

                myModal,
                initModal,
                hideModal,

                loadReimbursements,
                pagination,
                setPagination,
                filters,
                setFilters,

                validateForm,
                validateField
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
