import React, { useContext } from "react";

import { AppContext } from "../../app/app.provider";

const Header = () => {
    const { initModal } = useContext(AppContext);

    const addNew = e => {
        e.preventDefault();
        initModal({
            data: { test: "test" },
            type: "new-period",
            size: "medium",
            showModal: true,
            onClose: cData => {
                console.log(cData);
            }
        });
    };

    return (
        <button className='button colorize blue mbottom-15' onClick={addNew}>
            Add New
        </button>
    );
};

export default Header;
