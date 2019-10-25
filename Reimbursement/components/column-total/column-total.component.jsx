import PropTypes from "prop-types";

import { utils } from "../../utilities/utils";

const ColumnTotal = ({ list, columnName }) => {
    let total = 0;

    list.map(item => {
        total = total + item[columnName];
    });

    return utils.currency(total);
};

ColumnTotal.propTypes = {
    list: PropTypes.array.isRequired,
    columnName: PropTypes.string.isRequired
};

export default ColumnTotal;
