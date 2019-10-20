import PropTypes from "prop-types";

import { Utils } from "../../app/app.utils";

const ColumnTotal = ({ list, columnName }) => {
    let total = 0;

    list.map(item => {
        total = total + item[columnName];
    });

    return Utils.Currency(total);
};

ColumnTotal.propTypes = {
    list: PropTypes.array.isRequired,
    columnName: PropTypes.string.isRequired
};

export default ColumnTotal;
