"use strict";

const path = require("path");
const WebpackNotifierPlugin = require("webpack-notifier");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

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
const _plugin = [new WebpackNotifierPlugin(), new BrowserSyncPlugin()];
const _resolve = {
    extensions: ["*", ".js", ".jsx"]
};

module.exports = [
    {
        name: "reimbursement",
        entry: ["@babel/polyfill", "./Reimbursement/index.js"],
        output: {
            path: path.resolve(__dirname, "./Build"),
            filename: "reimbursement.js"
        },
        module: _module,
        resolve: _resolve,
        devtool: "inline-source-map",
        plugins: _plugin
    },

    {
        name: "reimbursement-period",
        entry: ["@babel/polyfill", "./ReimbursementPeriod/index.js"],
        output: {
            path: path.resolve(__dirname, "./Build"),
            filename: "reimbursement-period.js"
        },
        module: _module,
        resolve: _resolve,
        devtool: "inline-source-map",
        plugins: _plugin
    }
];
