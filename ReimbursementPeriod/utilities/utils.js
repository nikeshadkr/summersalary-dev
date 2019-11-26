import moment from "moment";

export const config = {
    appPath: window.applicationPath,
    assetPath: window.assetPath,
    apiPath: window.applicationPath + "ReimbursementPeriod",
    pageSize: 15
};

export const utils = {
    convertToBool: value => {
        if (value && typeof value === "string") {
            if (value.toLowerCase() === "true") return true;
            if (value.toLowerCase() === "false") return false;
            else return value;
        } else return value;
    },

    currency: val => {
        let decimalCount = 2,
            decimal = ".",
            thousands = ",",
            currencySign = "$",
            [amount] = [val];

        if (amount || amount === 0) {
            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            const negativeSign = amount < 0 ? "-" : "";

            let i = parseInt(
                (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
            ).toString();
            let j = i.length > 3 ? i.length % 3 : 0;

            return `${currencySign}${negativeSign}${
                j ? i.substr(0, j) + thousands : ""
            }${i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands)}${
                decimalCount
                    ? decimal +
                      Math.abs(amount - i)
                          .toFixed(decimalCount)
                          .slice(2)
                    : ""
            }`;
        } else return `$${amount}`;
    },

    formatDate: (date, format) => {
        return moment(date).isAfter("1900-01-01")
            ? moment(date).format(format ? format : "MM/DD/YYYY")
            : "";
    },

    isBefore: (date, date2) => {
        /*console.log(utils.formatDate(new Date(date), "MM/DD/YYYY"));
        console.log(utils.formatDate(date2, "MM/DD/YYYY"));
        console.log(
            "isBefore :",
            moment(new Date(date)).isBefore(new Date(date2), "day")
        );*/
        return moment(new Date(date)).isBefore(new Date(date2), "day");
    },

    isAfter: (date, date2) => {
        return moment(new Date(date)).isAfter(new Date(date2), "day");
    },

    getColumnTotal: (list, columnName) => {
        let total = 0;
        list.map(item => {
            let floatValue = parseFloat(item[columnName]);
            total += !isNaN(floatValue) ? floatValue : 0;
        });
        return total;
    },

    excerpt: (text, length) => {
        let [string] = [text];
        if (string.length > length)
            string = `${string.substring(0, length).trim()}...`;

        return string;
    },

    roundDecimal: (val, decimals) => {
        if (typeof val === "string") val = parseFloat(val);
        if (typeof val === "NaN" || isNaN(val)) val = 0;

        let d;
        switch (decimals) {
            case 3:
                d = 1000;
                break;
            case 4:
                d = 10000;
                break;
            default:
                d = 100;
        }

        return Math.round(val * d) / d;
    }
};

export const _DateFormat = /(^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$)/;

export const validationRules = {
    required: val => val !== null && val !== undefined && val !== "",
    dateFormat: val => {
        if (val === null || val === undefined || val === "") return true;
        else {
            if (_DateFormat.test(val)) return true;
            else return false;
        }
    },
    isAfter: (val, val2) => {
        if (val === null || val === undefined || val === "") return true;
        if (_DateFormat.test(val)) return utils.isAfter(val, val2);
        else return true;
    }
};
