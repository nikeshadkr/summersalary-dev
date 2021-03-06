import React from "react";
import axios from "../axios";

import { config, validationRules } from "../utilities/utils";

export const AppContext = React.createContext({
    setMainState: () => {},
    appData: {},
    setAppData: () => {},

    isLoading: false,
    showHideLoader: () => {},

    myModal: {},
    initModal: () => {},
    hideModal: () => {},

    alert: {},
    initAlert: () => {},
    closeAlert: () => {},

    loadReimbursements: () => {},
    pagination: {},
    setPagination: () => {},
    filters: {},
    setFilters: () => {},

    validateForm: () => {},
    validateField: () => {}
});

class AppProvider extends React.Component {
    constructor() {
        super();

        this.state = {
            appData: {
                college: {
                    value: "",
                    isTouched: false,
                    isValid: false,
                    errors: {},
                    rules: [
                        {
                            name: "required",
                            rule: validationRules.required
                        }
                    ]
                },
                summerYear: {
                    value: "",
                    isTouched: false,
                    isValid: false,
                    errors: {},
                    rules: [
                        {
                            name: "required",
                            rule: validationRules.required
                        }
                    ]
                },
                paymentNumber: {
                    value: "",
                    isTouched: false,
                    isValid: false,
                    errors: {},
                    rules: [
                        {
                            name: "required",
                            rule: validationRules.required
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
                isAllchecked: false,
                isPaymentNumberOpen: false
            },
            isLoading: false,
            myModal: {
                data: {},
                type: "",
                size: "",
                showModal: false,
                onClose: () => {}
            },
            alert: {
                inModal: false,
                isAlertOpen: false,
                setTimeout: false,
                type: "",
                content: ""
            },
            pagination: {
                pageIndex: 1,
                pageSize: config.pageSize,
                reloadPage: false
            },
            filters: {
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
            }
        };
    }

    showHideLoader = (isLoading, callback) =>
        this.setState(
            state => ({ ...state, isLoading }),
            () => {
                callback && callback(this.state.isLoading);
            }
        );

    initModal = myModal => {
        document.body.classList.add("modal-open");
        this.setState(state => ({ ...state, myModal }));
    };
    hideModal = cData => {
        document.body.classList.remove("modal-open");

        if (cData !== undefined) this.state.myModal.onClose(cData);

        this.setState(state => ({
            ...state,
            myModal: {
                showModal: false
            }
        }));

        if (this.state.alert && this.state.alert.inModal) this.closeAlert();
    };

    initAlert = option => {
        // Default Options
        const alertOptions = {
            isAlertOpen: true,
            inModal: false,
            setTimeout: false,
            type: "success",

            ...option
        };

        this.setState(
            state => ({ ...state, alert: alertOptions }),
            () => {
                if (option.setTimeout)
                    setTimeout(() => {
                        this.closeAlert();
                    }, option.setTimeout);
            }
        );
    };
    closeAlert = callback => {
        this.setState(
            state => ({
                ...state,
                alert: {
                    isAlertOpen: false,
                    inModal: false,
                    setTimeout: false,
                    type: "success",
                    content: ""
                }
            }),
            () => {
                callback && callback(this.state.alert);
            }
        );
    };

    setPagination = (pagination, callback) =>
        this.setState(
            state => ({
                ...state,
                pagination
            }),
            () => {
                callback && callback(this.state.pagination);
            }
        );

    setFilters = (filters, callback) =>
        this.setState(
            state => ({
                ...state,
                filters
            }),
            () => {
                callback && callback(this.state.filters);
            }
        );

    setAppData = (appData, callback) =>
        this.setState(
            state => ({
                ...state,
                appData
            }),
            () => {
                callback && callback(this.state.appData);
            }
        );

    setMainState = (updates, callback) =>
        this.setState(
            state => ({
                ...state,
                ...updates
            }),
            () => {
                callback && callback(this.state);
            }
        );

    loadReimbursements = async () => {
        this.showHideLoader(true);

        const { pagination, filters, appData } = this.state;

        try {
            let listReimbursement = await axios.get(
                `${config.apiPath}/${
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

            let isPaymentNumberOpen = false;
            filters.listPaymentNumber.forEach(item => {
                if (item.PaymentNumber == filters.paymentNumber)
                    isPaymentNumberOpen = item.IsOpen;
            });

            listReimbursement.data.forEach(item => {
                item.isPending = filters.isPending;
                item.isChecked = false;

                item.enableDistributionModal =
                    item.EffortCertStatus === config.effortCertStatus.done &&
                    item.SalaryAuthorized !== 0 &&
                    item.EligibleBalanceToReimburse !== 0 &&
                    (item.NotYTDPaid !== 0 ||
                        item.EligibleBalanceToReimburse !==
                            item.SalaryAuthorized);

                item.isDisabled =
                    !isPaymentNumberOpen ||
                    item.EffortCertStatus !== config.effortCertStatus.done ||
                    item.NotYTDPaid !== 0 ||
                    item.enableDistributionModal;
            });

            this.setAppData({
                ...appData,
                listReimbursement: listReimbursement.data,
                isReimbursementLoaded: true,
                isAllchecked: false,
                isPaymentNumberOpen
            });

            this.showHideLoader(false);
        } catch (error) {
            this.showHideLoader(false);
            console.log(error.message);
        }
    };

    requiredFields = ["college", "summerYear", "paymentNumber"];
    validateForm = () => {
        const { appData } = this.state;

        let isValid = true;
        let newfilterParams = {};
        let newValidatedFields = {};

        this.requiredFields.map(fieldName => {
            let field = { ...appData[fieldName] };
            let newValidatedField = this.validateField(field);

            if (newValidatedField.isValid === false) isValid = false;
            newValidatedFields[fieldName] = newValidatedField;
            newfilterParams[fieldName] = newValidatedField.value;

            return null;
        });

        return [newValidatedFields, newfilterParams, isValid];
    };

    validateField = field => {
        field.errors = {};
        field.isValid = true;

        // Rules have name and rule props
        field.rules.map(o => {
            if (!o.rule(field.value)) {
                field.errors[o.name] = true;
                field.isValid = false;
            }
        });

        return field;
    };

    render() {
        const {
            pagination,
            filters,
            appData,
            isLoading,
            myModal,
            alert
        } = this.state;

        return (
            <AppContext.Provider
                value={{
                    setMainState: this.setMainState,
                    appData,
                    setAppData: this.setAppData,

                    isLoading,
                    showHideLoader: this.showHideLoader,

                    myModal,
                    initModal: this.initModal,
                    hideModal: this.hideModal,

                    alert,
                    initAlert: this.initAlert,
                    closeAlert: this.closeAlert,

                    loadReimbursements: this.loadReimbursements,
                    pagination,
                    setPagination: this.setPagination,
                    filters,
                    setFilters: this.setFilters,

                    validateForm: this.validateForm,
                    validateField: this.validateField
                }}
            >
                {this.props.children}
            </AppContext.Provider>
        );
    }
}

export const withAlert = Component => {
    return class AlertConsumer extends React.Component {
        constructor() {
            super();
        }

        render() {
            return (
                <AppContext.Consumer>
                    {values => (
                        <Component
                            {...this.props}
                            alert={{ ...values.alert }}
                            initAlert={values.initAlert}
                            closeAlert={values.closeAlert}
                        />
                    )}
                </AppContext.Consumer>
            );
        }
    };
};

export default AppProvider;
