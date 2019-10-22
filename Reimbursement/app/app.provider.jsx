import React from "react";
import axios from "axios";

import { Paths, Utils } from "./app.utils";

const validationRules = {
    required: val => val !== null && val !== undefined && val !== ""
};

export const AppContext = React.createContext({
    setMainState: () => {},
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

class AppProvider extends React.Component {
    constructor() {
        super();

        this.state = {
            appData: {
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
            },
            isLoading: false,
            myModal: {
                data: [],
                title: "",
                type: "",
                showModal: false
            },
            pagination: {
                pageIndex: 1,
                pageSize: Utils.PageSize,
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
    hideModal = () => {
        document.body.classList.remove("modal-open");
        this.setState(state => ({
            ...state,
            myModal: {
                showModal: false
            }
        }));
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

    loadReimbursements = async fromFilter => {
        this.showHideLoader(true);

        const { pagination, filters, appData } = this.state;

        if (fromFilter) this.setPagination({ ...pagination, pageIndex: 1 });

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

            this.setAppData({
                ...appData,
                listReimbursement: listReimbursement.data,
                isReimbursementLoaded: true,
                selectAllCheckBox: false,
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

    render() {
        const { pagination, filters, appData, isLoading, myModal } = this.state;

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

// High Order Component
// For Consuming Context
export const withAppData = Component => {
    return class ContextConsumer extends React.Component {
        constructor() {
            super();
        }

        render() {
            return (
                <AppContext.Consumer>
                    {values => (
                        <Component {...this.props} AppContext={values} />
                    )}
                </AppContext.Consumer>
            );
        }
    };
};

export default AppProvider;
