"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.selectSignalKey = exports.selectContent = exports.selectState = exports.selectUrl = exports.fillUrl = exports.httpdownloaderSlice = exports.cancelPage = exports.downloadPage = exports.HttpDownloaderState = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var HttpDownloaderState;
(function (HttpDownloaderState) {
    HttpDownloaderState[HttpDownloaderState["Idle"] = 0] = "Idle";
    HttpDownloaderState[HttpDownloaderState["Loading"] = 1] = "Loading";
})(HttpDownloaderState = exports.HttpDownloaderState || (exports.HttpDownloaderState = {}));
;
var ABORT_REQUEST_CONTROLLERS = new Map();
function getSignal(key) {
    var newController = new AbortController();
    ABORT_REQUEST_CONTROLLERS.set(key, newController);
    return newController.signal;
}
function abortRequest(key) {
    var controller = ABORT_REQUEST_CONTROLLERS.get(key);
    controller.abort();
}
function signalKeyGen(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    var counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
function streamToArrayBuffer(stream) {
    return __awaiter(this, void 0, void 0, function () {
        var result, reader, _a, done, value, newResult;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    result = new Uint8Array(0);
                    reader = stream.getReader();
                    _b.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    return [4 /*yield*/, reader.read()];
                case 2:
                    _a = _b.sent(), done = _a.done, value = _a.value;
                    if (done) {
                        return [3 /*break*/, 3];
                    }
                    newResult = new Uint8Array(result.length + value.length);
                    newResult.set(result);
                    newResult.set(value, result.length);
                    result = newResult;
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, result];
            }
        });
    });
}
exports.downloadPage = (0, toolkit_1.createAsyncThunk)('httpdownloader/start', function (_, state) { return __awaiter(void 0, void 0, void 0, function () {
    var url, signalKey, sig, res, buffer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = (0, exports.selectUrl)(state.getState());
                if (!(url !== null)) return [3 /*break*/, 5];
                signalKey = (0, exports.selectSignalKey)(state.getState());
                sig = getSignal(signalKey);
                return [4 /*yield*/, fetch(url, { signal: sig })];
            case 1:
                res = _a.sent();
                if (!(res.body !== null)) return [3 /*break*/, 3];
                return [4 /*yield*/, streamToArrayBuffer(res.body)];
            case 2:
                buffer = _a.sent();
                return [2 /*return*/, new TextDecoder().decode(buffer)];
            case 3: return [2 /*return*/, null];
            case 4: return [3 /*break*/, 6];
            case 5: return [2 /*return*/, null];
            case 6: return [2 /*return*/];
        }
    });
}); });
exports.cancelPage = (0, toolkit_1.createAsyncThunk)('httpdownloader/cancel', function (_, obj) { return __awaiter(void 0, void 0, void 0, function () {
    var s, signalKey;
    return __generator(this, function (_a) {
        s = obj.getState();
        signalKey = (0, exports.selectSignalKey)(s);
        abortRequest(signalKey);
        return [2 /*return*/, signalKey];
    });
}); });
var initialState = {
    url: null,
    state: HttpDownloaderState.Idle,
    content: null,
    signalKey: null
};
exports.httpdownloaderSlice = (0, toolkit_1.createSlice)({
    name: 'httpdownloader',
    initialState: initialState,
    reducers: {
        fillUrl: fillUrlBody
    },
    extraReducers: function (builder) {
        builder
            .addCase(exports.downloadPage.pending, function (state, _) { downloadPagePendingBody(state); })
            .addCase(exports.downloadPage.fulfilled, function (state, action) { downloadPageFulfilledBody(state, action.payload); })
            .addCase(exports.downloadPage.rejected, function (state, _) { downloadPageRejectedBody(state); })
            .addCase(exports.cancelPage.pending, function (state, _) { return state; })
            .addCase(exports.cancelPage.fulfilled, function (state, _) { cancelBody(state); })
            .addCase(exports.cancelPage.rejected, function (state, _) { return state; });
    }
});
function downloadPagePendingBody(state) {
    state.content = null;
    state.state = HttpDownloaderState.Loading;
}
function downloadPageFulfilledBody(state, page) {
    state.state = HttpDownloaderState.Idle;
    state.content = page;
}
function downloadPageRejectedBody(state) {
    state.content = state.content !== null ? "cannot fetch the requested url:" + state.url : null;
    state.state = HttpDownloaderState.Idle;
}
function cancelBody(state) {
    state.content = null;
    state.state = HttpDownloaderState.Idle;
}
function fillUrlBody(state, url) {
    state.url = url.payload;
    var key = signalKeyGen(20);
    state.signalKey = key;
}
exports["default"] = exports.httpdownloaderSlice.reducer;
exports.fillUrl = exports.httpdownloaderSlice.actions.fillUrl;
var selectUrl = function (state) { return state.httpdownloader.url; };
exports.selectUrl = selectUrl;
var selectState = function (state) { return state.httpdownloader.state; };
exports.selectState = selectState;
var selectContent = function (state) { return state.httpdownloader.content; };
exports.selectContent = selectContent;
var selectSignalKey = function (state) { return state.httpdownloader.signalKey; };
exports.selectSignalKey = selectSignalKey;
