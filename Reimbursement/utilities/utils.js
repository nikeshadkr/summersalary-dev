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

    currency: amount => {
        let decimalCount = 2,
            decimal = ".",
            thousands = ",",
            currencySign = "$";

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

    convertToInt: val => {
        return val && typeof val === "string" ? parseFloat(val) : val;
    },

    formatDate: (date, format) => {
        return moment(date).format(format);
    }
};

export const validationRules = {
    required: val => val !== null && val !== undefined && val !== ""
};
