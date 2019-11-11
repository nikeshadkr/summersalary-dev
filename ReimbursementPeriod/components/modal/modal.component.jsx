import React, { useContext } from "react";
import PropTypes from "prop-types";

import { AppContext } from "../../app/app.provider";
import PeriodAdd from "../../components/period-add/period-add.component";

import "./modal.component.scss";

const Modal = ({ data, type, size }) => {
    const { hideModal } = useContext(AppContext);

    let Component;
    switch (type) {
        case "new-period":
            Component = PeriodAdd;

        default:
            Component = PeriodAdd;
    }

    return (
        <ModalOuter size={size}>
            <Component data={data} hideModal={hideModal} />
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
