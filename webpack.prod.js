"use strict";

const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");

const _module = {
    rules: [
        {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            }
        },
        {
            test: /\.(css|scss)$/,
            use: ["style-loader", "css-loader", "sass-loader"]
        }
    ]
};
const _plugin = [
    new CompressionPlugin({
        test: /\.js(\?.*)?$/i
    })
];
const _resolve = {
    extensions: ["*", ".js", ".jsx"]
};

module.exports = [
    {
        mode: "production",
        name: "reimbursement",
        entry: ["@babel/polyfill", "./Reimbursement/index.js"],
        output: {
            path: path.resolve(__dirname, "./Build"),
            filename: "reimbursement.js"
        },
        module: _module,
        resolve: _resolve,
        devtool: "",
        plugins: _plugin
    },

    {
        mode: "production",
        name: "reimbursement-periods",
        entry: ["@babel/polyfill", "./ReimbursementPeriods/index.js"],
        output: {
            path: path.resolve(__dirname, "./Build"),
            filename: "reimbursement-periods.js"
        },
        module: _module,
        resolve: _resolve,
        devtool: "",
        plugins: _plugin
    }
];
