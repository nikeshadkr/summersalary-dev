export const Paths = {
    appPath: window.applicationPath,
    assetPath: window.assetPath,
    apiPath: window.applicationPath + "Reimbursement"
};

export const Utils = {
    PageSize: 15,

    ConvertToBool: value => {
        if (value && typeof value === "string") {
            if (value.toLowerCase() === "true") return true;
            if (value.toLowerCase() === "false") return false;
            else return value;
        } else return value;
    },

    Currency: amount => {
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
    }
};
