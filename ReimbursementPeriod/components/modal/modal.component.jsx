import React, { useContext } from "react";
import PropTypes from "prop-types";

import { AppContext } from "../../app/app.provider";

import ConfirmDialog from "../confirm-dialog/confirm-dialog.component";
import PeriodWrapper from "../period-wrapper/period-wrapper.component";
import PeriodAdd from "../period-add/period-add.component";

import "./modal.component.scss";

const Modal = ({ data, type, size }) => {
    const { hideModal } = useContext(AppContext);

    let Component;
    switch (type) {
        case "new-period":
            Component = PeriodAdd;
            break;

        default:
            Component = ConfirmDialog;
            break;
    }

    return (
        <ModalOuter size={size}>
            {type === "new-period" ? (
                <PeriodWrapper
                    period={periodProps => (
                        <Component
                            data={data}
                            hideModal={hideModal}
                            {...periodProps}
                        />
                    )}
                />
            ) : (
                <Component data={data} hideModal={hideModal} />
            )}
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
