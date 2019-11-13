import React, { useContext } from "react";

import PeriodsData from "../periods-data/periods-data.component";
import { AppContext } from "../../app/app.provider";

const PeriodsTable = () => {
    const {
        appState: { listReimbursementPeriods },
        setAppState,
        initModal,
        toggleLoader
    } = useContext(AppContext);

    const handleChange = e => {
        let clonedList = [...listReimbursementPeriods];
        let found = { ...clonedList[e.target.dataset.id] };
        found[e.target.name] = e.target.value;
        clonedList[e.target.dataset.id] = found;

        setAppState(prevState => ({
            ...prevState,
            listReimbursementPeriods: clonedList
        }));
    };

    const toggleEditMode = (value, index) => {
        let clonedList = [...listReimbursementPeriods];
        let found = { ...clonedList[index] };
        found.IsEditing = value;
        clonedList[index] = found;

        setAppState(prevState => ({
            ...prevState,
            listReimbursementPeriods: clonedList
        }));
    };

    const removeItem = (item, index) => {
        initModal({
            data: {
                title: "Confirm !!",
                message: "Are you sure you want to delete ?"
            },
            type: "",
            size: "small",
            showModal: true,
            onClose: cData => {
                console.log(item);
                let clonedList = [...listReimbursementPeriods];

                setAppState(prevState => ({
                    ...prevState,
                    listReimbursementPeriods: clonedList.filter(
                        (obj, i) => i != index
                    )
                }));
            }
        });
    };

    return (
        <>
            {listReimbursementPeriods && listReimbursementPeriods.length > 0 ? (
                <div className='table-layout'>
                    <table>
                        <thead>
                            <tr>
                                <th width='90'>Year</th>
                                <th width='80'>
                                    Payment <br />
                                    Number
                                </th>
                                <th width='80'>Status</th>
                                <th width='120'>
                                    Pay Period <br />
                                    End From Date
                                </th>
                                <th width='120'>
                                    Pay Period <br />
                                    End To Date
                                </th>
                                <th width='120'>
                                    CUNY Pay Period <br />
                                    End Date
                                </th>
                                <th width='120'>GL Posting Date</th>
                                <th width='60'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listReimbursementPeriods.map((item, i) => (
                                <PeriodsData
                                    key={i}
                                    index={i}
                                    item={item}
                                    handleMainStateUpdate={handleChange}
                                    toggleEditMode={toggleEditMode}
                                    removeItem={removeItem}
                                    toggleLoader={toggleLoader}
                                ></PeriodsData>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <h1>No records found</h1>
            )}
        </>
    );
};

export default PeriodsTable;
