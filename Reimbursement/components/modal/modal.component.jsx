import React, { useContext } from "react";
import PropTypes from "prop-types";

import { AppContext } from "../../app/app.provider";

import DistributionTable from "../distribution-table/distribution-table.component";
import EmployeeTable from "../employee-table/employee-table.component";
import PreviousPaymentsTable from "../previous-payment-table/previous-payment-table";

import "./modal.styles.scss";
import { config } from "../../utilities/utils";

const Modal = ({ data, type, size }) => {
    const { hideModal } = useContext(AppContext);

    let Component;
    switch (type) {
        case config.modalTypes.eligibleBalance:
        case config.modalTypes.salaryAuthorized:
            Component = DistributionTable;
            break;
        case config.modalTypes.employeeInfo:
            Component = EmployeeTable;
            break;
        case config.modalTypes.previousPayments:
            Component = PreviousPaymentsTable;
            break;
        default:
            Component = DistributionTable;
            break;
    }

    return (
        <ModalOuter size={size}>
            <Component data={data} hideModal={hideModal} modalType={type} />
        </ModalOuter>
    );
};

const ModalOuter = props => {
    return (
        <>
            <div className='modal-backdrop'></div>
            <div className='modal-dialog'>
                <div className={`modal-widget ${props.size}`}>
                    {props.children}
                </div>
            </div>
        </>
    );
};

Modal.propTypes = {
    data: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired
};

export default Modal;
