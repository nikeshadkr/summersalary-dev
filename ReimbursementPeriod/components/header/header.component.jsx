import React, { useContext } from "react";

import { AppContext } from "../../app/app.provider";

const Header = () => {
    const {
        appState,
        setAppState,
        getPayPeriodEndFrom,
        initModal
    } = useContext(AppContext);

    const { summerYear, listSummerYear, listPayPeriodEndFrom } = appState;

    const handleChange = e => {
        e.persist();

        getPayPeriodEndFrom(e.target.value);

        setAppState(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const addNew = e => {
        e.preventDefault();
        initModal({
            data: { summerYear, listPayPeriodEndFrom },
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
