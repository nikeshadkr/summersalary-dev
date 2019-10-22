import React from "react";
import PropTypes from "prop-types";

import { withAppData } from "../../app/app.provider";
import "./modal.component.scss";

class Modal extends React.Component {
    constructor() {
        super();
    }

    render() {
        const {
            AppContext: { hideModal },
            data,
            title,
            type
        } = this.props;
        return (
            <>
                <div className='modal-backdrop'></div>
                <div className='modal-dialog'>
                    <div className='modal-widget large'>
                        <div className='modal-common'>
                            <div className='mc-title'>
                                <div>{title}</div>
                                <button onClick={() => hideModal()}>
                                    Close
                                </button>
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
    }
}

Modal.propTypes = {
    data: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
};

export default withAppData(Modal);
