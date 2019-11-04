import moment from "moment";

export const config = {
    appPath: window.applicationPath,
    assetPath: window.assetPath,
    apiPath: window.applicationPath + "Reimbursement",
    pageSize: 15,
    effortCertStatus: {
        done: "F",
        notDone: "X",
        all: ""
    },
    paymentStatus: {
        fullyPaid: "0",
        notFullyPaid: "1",
        all: ""
    }
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
        return moment(date).format(format);
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
    }
};

export const validationRules = {
    required: val => val !== null && val !== undefined && val !== ""
};
