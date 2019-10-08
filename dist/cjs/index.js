"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var postcss_1 = __importDefault(require("postcss"));
var postcss_value_parser_1 = __importDefault(require("postcss-value-parser"));
var postcss_message_helpers_1 = __importDefault(require("postcss-message-helpers"));
/**
 * PostCSS plugin inline url() files as base64
 */
var plugin = postcss_1["default"].plugin("postcss-base64", function (options) { return function (style, result) {
    var saveOptions = __assign({ root: process.cwd(), extensions: [".png", ".svg", ".jpg"], removeMultiple: false, dataType: function (fileExt) { return "data:image/" + fileExt + ";base64,"; }, warn: false }, options);
    style.walkDecls(function (decl) {
        if (!decl.value ||
            !decl.value.includes("url(") ||
            !saveOptions.extensions.some(function (ext) { return decl.value.includes(ext); })) {
            return;
        }
        try {
            decl.value = postcss_message_helpers_1["default"]["try"](function () {
                var parse = postcss_value_parser_1["default"](decl.value);
                var isUrlNode = function (node) { return node.value === "url"; };
                if (saveOptions.removeMultiple) {
                    parse.nodes.splice(-(parse.nodes.length -
                        parse.nodes
                            .slice(parse.nodes.findIndex(isUrlNode) + 1)
                            .findIndex(isUrlNode)));
                }
                return parse
                    .walk(function (node) {
                    if (node.type !== "function" || node.value !== "url") {
                        return;
                    }
                    var regExp = /.*?url\("(.*?)"\).*?/g;
                    node.nodes.find(function (node) { return node.type === "string"; }).value = postcss_value_parser_1["default"]
                        .stringify([node])
                        .replace(regExp, function (_m, urlPath) {
                        var fileContent;
                        try {
                            fileContent = fs.readFileSync(path.join(saveOptions.root, urlPath));
                        }
                        catch (error) {
                            if (saveOptions.warn) {
                                console.warn("@schadenn/postcss-base64 plugin warning:\n" + error.message);
                            }
                            decl.warn(result, error.message, {
                                word: decl.value
                            });
                        }
                        return (saveOptions.dataType(path.extname(urlPath).slice(1)) +
                            fileContent.toString("base64"));
                    });
                })
                    .toString();
            }, decl.source);
        }
        catch (error) {
            if (saveOptions.warn) {
                console.warn("@schadenn/postcss-base64 plugin warning:\n" + error.message);
            }
            decl.warn(result, error.message, {
                word: decl.value
            });
        }
    });
}; });
exports["default"] = plugin;

 module.exports = exports["default"];