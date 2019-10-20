"use strict";

var path = require("path");
var WebpackNotifierPlugin = require("webpack-notifier");
var BrowserSyncPlugin = require("browser-sync-webpack-plugin");

module.exports = [
    {
        name: "reimbursement",
        entry: ["@babel/polyfill", "./Reimbursement/index.js"],
        output: {
            path: path.resolve(__dirname, "./Build"),
            filename: "reimbursement.js"
        },
        module: {
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
        },
        resolve: {
            extensions: ["*", ".js", ".jsx"]
        },
        devtool: "inline-source-map",
        plugins: [new WebpackNotifierPlugin(), new BrowserSyncPlugin()]
    },

    {
        name: "effortcertification",
        entry: ["@babel/polyfill", "./Effortcertification/index.js"],
        output: {
            path: path.resolve(__dirname, "./Build"),
            filename: "effortcertification.js"
        },
        module: {
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
        },
        resolve: {
            extensions: ["*", ".js", ".jsx"]
        },
        devtool: "inline-source-map",
        plugins: [new WebpackNotifierPlugin(), new BrowserSyncPlugin()]
    }
];
