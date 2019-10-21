import React, { useContext } from "react";
import PropTypes from "prop-types";

import { AppContext } from "../../app/app.provider";
import "./modal.component.scss";

const Modal = ({ data, title, type }) => {
    const { hideModal } = useContext(AppContext);
    return (
        <>
            <div className='modal-backdrop'></div>
            <div className='modal-dialog'>
                <div className='modal-widget large'>
                    <div className='modal-common'>
                        <div className='mc-title'>
                            <div>{title}</div>
                            <button onClick={() => hideModal()}>Close</button>
                        </div>

                        <div className='mc-body'>
                            <pre>
                                <code>{JSON.stringify(data[0])}</code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

Modal.propTypes = {
    data: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
};

export default Modal;
