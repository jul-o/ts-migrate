"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var child_process_1 = require("child_process");
var path_1 = require("path");
var updatable_log_1 = require("updatable-log");
var defaultConfig = "{\n  \"extends\": \"../typescript/tsconfig.base.json\",\n  \"include\": [\".\", \"../typescript/types\"]\n}\n";
function init(_a) {
    var rootDir = _a.rootDir, _b = _a.isExtendedConfig, isExtendedConfig = _b === void 0 ? false : _b;
    if (!fs_1["default"].existsSync(rootDir)) {
        updatable_log_1["default"].error("".concat(rootDir, " does not exist"));
        return;
    }
    var configFile = path_1["default"].resolve(rootDir, 'tsconfig.json');
    if (fs_1["default"].existsSync(configFile)) {
        updatable_log_1["default"].info("Config file already exists at ".concat(configFile));
        return;
    }
    if (isExtendedConfig) {
        fs_1["default"].writeFileSync(configFile, defaultConfig);
    }
    else {
        (0, child_process_1.execSync)('npx tsc --init', { cwd: rootDir });
    }
    updatable_log_1["default"].info("Config file created at ".concat(configFile));
}
exports["default"] = init;
