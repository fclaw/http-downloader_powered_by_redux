"use strict";
exports.__esModule = true;
exports.store = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var counterSlice_1 = require("../features/counter/counterSlice");
var httpdownloaderSlice_1 = require("../features/httpdownloader/httpdownloaderSlice");
exports.store = (0, toolkit_1.configureStore)({
    reducer: {
        counter: counterSlice_1["default"],
        httpdownloader: httpdownloaderSlice_1["default"]
    }
});
