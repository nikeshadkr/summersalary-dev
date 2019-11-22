import React, { useContext } from "react";

import { AppContext } from "../../app/app.provider";

const Header = ({ loadReimbursementPeriods }) => {
    const { appState, setAppState, initModal, toggleLoader } = useContext(
        AppContext
    );

    const { summerYear, listSummerYear } = appState;

    const loadAgain = async year => {
        try {
            toggleLoader(true);

            await loadReimbursementPeriods(year);

            toggleLoader(false);
        } catch (error) {
            console.log(error.response);
        }
    };

    const handleChange = e => {
        e.persist();

        setAppState(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));

        loadAgain(e.target.value);
    };

    const addNewModal = e => {
        e.preventDefault();
        initModal({
            data: { summerYear },
            type: "new-period",
            size: "medium",
            showModal: true,
            onClose: cData => {
                if (cData) {
                    // Refreshing list after item is added.
                    loadAgain(summerYear);
                }
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
                        <option value=''>All</option>
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
                        onClick={addNewModal}
                    >
                        Add New
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Header;
