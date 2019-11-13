import React from "react";

const ConfirmDialog = ({ data: { title, message }, hideModal }) => {
    return (
        <div className='modal-common'>
            {/* Modal Title */}
            <div className='mc-title'>
                <div>
                    <strong>{title}</strong>
                </div>
            </div>

            {/* Modal Body */}
            <div className='mc-body'>
                <div style={{ fontSize: "16px" }}>{message}</div>
            </div>

            {/* Modal Footer */}
            <div className='mc-footer'>
                <button
                    className='button colorize red'
                    onClick={() => hideModal()}
                >
                    Cancel
                </button>

                <button
                    className='button colorize blue pull-right'
                    onClick={() => hideModal(true)}
                >
                    Confirm
                </button>
            </div>
        </div>
    );
};

export default ConfirmDialog;
