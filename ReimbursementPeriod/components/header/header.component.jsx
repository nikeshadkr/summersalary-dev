import React, { useContext } from "react";

import { AppContext } from "../../app/app.provider";

const Header = ({ loadReimbursementPeriods }) => {
    const { appState, setAppState, initModal, toggleLoader } = useContext(
        AppContext
    );

    const { summerYear, listSummerYear } = appState;

    const handleChange = async e => {
        e.persist();

        setAppState(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));

        try {
            toggleLoader(true);

            await loadReimbursementPeriods(e.target.value);

            toggleLoader(false);
        } catch (error) {
            console.log(error.response);
        }
    };

    const addNew = e => {
        e.preventDefault();
        initModal({
            data: { summerYear },
            type: "new-period",
            size: "medium",
            showModal: true,
            onClose: cData => {
                console.log(cData);
            }
        });
    };

    return (
        <section className='header mbottom-15'>
            <div className='row form-row'>
                {/* Select Year */}
                <div className='form-group'>
                    <label className='ptop-5'>Reimbursement Summer</label>
                </div>

                <div className='form-group' style={{ width: "120px" }}>
                    <select
                        name='summerYear'
                        value={summerYear}
                        onChange={handleChange}
                    >
                        <option value='' disabled>
                            Select
                        </option>
                        {listSummerYear &&
                            listSummerYear.map((obj, i) => {
                                return (
                                    <option key={i} value={obj}>
                                        {obj}
                                    </option>
                                );
                            })}
                    </select>
                </div>

                {/* Add Button */}
                <div className='form-group'>
                    <button
                        className={`button colorize blue ${
                            summerYear ? "" : "disabled"
                        }`}
                        disabled={summerYear === "" || !summerYear}
                        onClick={addNew}
                    >
                        Add New
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Header;
