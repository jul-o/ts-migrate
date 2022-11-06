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
exports.__esModule = true;
/* eslint-disable no-use-before-define, @typescript-eslint/no-use-before-define */
var fs_1 = require("fs");
var path_1 = require("path");
var updatable_log_1 = require("updatable-log");
var typescript_1 = require("typescript");
var json5_1 = require("json5");
var json5_writer_1 = require("json5-writer");
function rename(_a) {
    var rootDir = _a.rootDir, sources = _a.sources;
    var configFile = path_1["default"].resolve(rootDir, 'tsconfig.json');
    if (!fs_1["default"].existsSync(configFile)) {
        updatable_log_1["default"].error('Could not find tsconfig.json at', configFile);
        return null;
    }
    var jsFiles;
    try {
        jsFiles = findJSFiles(rootDir, configFile, sources);
    }
    catch (err) {
        updatable_log_1["default"].error(err);
        return null;
    }
    if (jsFiles.length === 0) {
        updatable_log_1["default"].info('No JS/JSX files to rename.');
        return [];
    }
    var toRename = jsFiles
        .map(function (oldFile) {
        var newFile;
        if (oldFile.endsWith('.jsx')) {
            newFile = oldFile.replace(/\.jsx$/, '.tsx');
        }
        else if (oldFile.endsWith('.js') && jsFileContainsJsx(oldFile)) {
            newFile = oldFile.replace(/\.js$/, '.tsx');
        }
        else if (oldFile.endsWith('.js')) {
            newFile = oldFile.replace(/\.js$/, '.ts');
        }
        return { oldFile: oldFile, newFile: newFile };
    })
        .filter(function (result) { return !!result.newFile; });
    updatable_log_1["default"].info("Renaming ".concat(toRename.length, " JS/JSX files in ").concat(rootDir, "..."));
    toRename.forEach(function (_a) {
        var oldFile = _a.oldFile, newFile = _a.newFile;
        fs_1["default"].renameSync(oldFile, newFile);
    });
    updateProjectJson(rootDir);
    updatable_log_1["default"].info('Done.');
    return toRename;
}
exports["default"] = rename;
function findJSFiles(rootDir, configFile, sources) {
    var configFileContents = typescript_1["default"].sys.readFile(configFile);
    if (configFileContents == null) {
        throw new Error("Failed to read TypeScript config file: ".concat(configFile));
    }
    var _a = typescript_1["default"].parseConfigFileTextToJson(configFile, configFileContents), config = _a.config, error = _a.error;
    if (error) {
        var errorMessage = typescript_1["default"].flattenDiagnosticMessageText(error.messageText, typescript_1["default"].sys.newLine);
        throw new Error("Error parsing TypeScript config file text to json: ".concat(configFile, "\n").concat(errorMessage));
    }
    var include = config.include;
    // Sources come from either `config.files` or `config.includes`.
    // If the --sources flag is set, let's ignore both of those config properties
    // and set our own `config.includes` instead.
    if (sources !== undefined) {
        include = Array.isArray(sources) ? sources : [sources];
        delete config.files;
    }
    var _b = typescript_1["default"].parseJsonConfigFileContent(__assign(__assign({}, config), { compilerOptions: __assign(__assign({}, config.compilerOptions), { 
            // Force JS/JSX files to be included
            allowJs: true }), include: include }), typescript_1["default"].sys, rootDir), fileNames = _b.fileNames, errors = _b.errors;
    if (errors.length > 0) {
        var errorMessage = typescript_1["default"].formatDiagnostics(errors, {
            getCanonicalFileName: function (fileName) { return fileName; },
            getCurrentDirectory: function () { return rootDir; },
            getNewLine: function () { return typescript_1["default"].sys.newLine; }
        });
        throw new Error("Errors parsing TypeScript config file content: ".concat(configFile, "\n").concat(errorMessage));
    }
    return fileNames.filter(function (fileName) { return /\.jsx?$/.test(fileName); });
}
/**
 * Heuristic to determine whether a .js file contains JSX.
 */
function jsFileContainsJsx(jsFileName) {
    var contents = fs_1["default"].readFileSync(jsFileName, 'utf8');
    return /(from ['"]react['"]|@jsx)/.test(contents) && /<[A-Za-z>]/.test(contents);
}
function updateProjectJson(rootDir) {
    var projectJsonFile = path_1["default"].resolve(rootDir, 'project.json');
    if (!fs_1["default"].existsSync(projectJsonFile)) {
        return;
    }
    var projectJsonText = fs_1["default"].readFileSync(projectJsonFile, 'utf-8');
    var projectJson = json5_1["default"].parse(projectJsonText);
    if (projectJson && projectJson.allowedImports) {
        projectJson.allowedImports = projectJson.allowedImports.map(function (allowedImport) {
            return /.jsx?$/.test(allowedImport) ? allowedImport.replace(/\.js(x?)$/, '.ts$1') : allowedImport;
        });
    }
    if (projectJson && projectJson.layout) {
        var layout = projectJson.layout;
        projectJson.layout = /.jsx?$/.test(layout) ? layout.replace(/\.js(x?)$/, '.ts$1') : layout;
    }
    var writer = json5_writer_1["default"].load(projectJsonText);
    writer.write(projectJson);
    fs_1["default"].writeFileSync(projectJsonFile, writer.toSource({ quote: 'double' }), 'utf-8');
    updatable_log_1["default"].info("Updated allowedImports in ".concat(projectJsonFile));
}
