#!/usr/bin/env node
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
        while (_) try {
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
/* eslint-disable no-await-in-loop, no-restricted-syntax */
var path_1 = require("path");
var updatable_log_1 = require("updatable-log");
var yargs_1 = require("yargs");
var ts_migrate_plugins_1 = require("../ts-migrate-plugins");
// @ts-ignore
var ts_migrate_server_1 = require("../ts-migrate-server");
var init_1 = require("./commands/init");
var rename_1 = require("./commands/rename");
var availablePlugins = [
    ts_migrate_plugins_1.addConversionsPlugin,
    ts_migrate_plugins_1.declareMissingClassPropertiesPlugin,
    ts_migrate_plugins_1.eslintFixPlugin,
    ts_migrate_plugins_1.explicitAnyPlugin,
    ts_migrate_plugins_1.hoistClassStaticsPlugin,
    ts_migrate_plugins_1.jsDocPlugin,
    ts_migrate_plugins_1.memberAccessibilityPlugin,
    ts_migrate_plugins_1.reactClassLifecycleMethodsPlugin,
    ts_migrate_plugins_1.reactClassStatePlugin,
    ts_migrate_plugins_1.reactDefaultPropsPlugin,
    ts_migrate_plugins_1.reactPropsPlugin,
    ts_migrate_plugins_1.reactShapePlugin,
    ts_migrate_plugins_1.stripTSIgnorePlugin,
    ts_migrate_plugins_1.tsIgnorePlugin,
];
// eslint-disable-next-line no-unused-expressions
yargs_1["default"]
    .scriptName('npm run ts-migrate --')
    .version(false)
    .usage('Usage: $0 <command> [options]')
    .command('init <folder>', 'Initialize tsconfig.json file in <folder>', function (cmd) { return cmd.positional('folder', { type: 'string' }).require(['folder']); }, function (args) {
    var rootDir = path_1["default"].resolve(process.cwd(), args.folder);
    (0, init_1["default"])({ rootDir: rootDir, isExtendedConfig: false });
})
    .command('init:extended <folder>', 'Initialize tsconfig.json file in <folder>', function (cmd) { return cmd.positional('folder', { type: 'string' }).require(['folder']); }, function (args) {
    var rootDir = path_1["default"].resolve(process.cwd(), args.folder);
    (0, init_1["default"])({ rootDir: rootDir, isExtendedConfig: true });
})
    .command('rename [options] <folder>', 'Rename files in folder from JS/JSX to TS/TSX', function (cmd) {
    return cmd
        .positional('folder', { type: 'string' })
        .string('sources')
        .alias('sources', 's')
        .describe('sources', 'Path to a subset of your project to rename.')
        .example('$0 rename /frontend/foo', 'Rename all the files in /frontend/foo')
        .example('$0 rename /frontend/foo -s "bar/**/*"', 'Rename all the files in /frontend/foo/bar')
        .require(['folder']);
}, function (args) {
    var rootDir = path_1["default"].resolve(process.cwd(), args.folder);
    var sources = args.sources;
    var renamedFiles = (0, rename_1["default"])({ rootDir: rootDir, sources: sources });
    if (renamedFiles === null) {
        process.exit(-1);
    }
})
    .command('migrate [options] <folder>', 'Fix TypeScript errors, using codemods', function (cmd) {
    return cmd
        .positional('folder', { type: 'string' })
        .choices('defaultAccessibility', ['private', 'protected', 'public'])
        .string('plugin')
        .choices('plugin', availablePlugins.map(function (p) { return p.name; }))
        .describe('plugin', 'Run a specific plugin')
        .string('privateRegex')
        .string('protectedRegex')
        .string('publicRegex')
        .string('sources')
        .alias('sources', 's')
        .describe('sources', 'Path to a subset of your project to rename (globs are ok).')
        .example('migrate /frontend/foo', 'Migrate all the files in /frontend/foo')
        .example('$0 migrate /frontend/foo -s "bar/**/*" -s "node_modules/**/*.d.ts"', 'Migrate all the files in /frontend/foo/bar, accounting for ambient types from node_modules.')
        .example('$0 migrate /frontend/foo --plugin jsdoc', 'Migrate JSDoc comments for all the files in /frontend/foo')
        .require(['folder']);
}, function (args) { return __awaiter(void 0, void 0, void 0, function () {
    var rootDir, sources, config, airbnbAnyAlias, airbnbAnyFunctionAlias, anyAlias, anyFunctionAlias, plugin, anyAlias_1, typeMap, useDefaultPropsHelper, defaultAccessibility, privateRegex, protectedRegex, publicRegex, exitCode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                rootDir = path_1["default"].resolve(process.cwd(), args.folder);
                sources = args.sources;
                airbnbAnyAlias = '$TSFixMe';
                airbnbAnyFunctionAlias = '$TSFixMeFunction';
                anyAlias = args.aliases === 'tsfixme' ? airbnbAnyAlias : undefined;
                anyFunctionAlias = args.aliases === 'tsfixme' ? airbnbAnyFunctionAlias : undefined;
                if (args.plugin) {
                    plugin = availablePlugins.find(function (cur) { return cur.name === args.plugin; });
                    if (!plugin) {
                        updatable_log_1["default"].error("Could not find a plugin named ".concat(args.plugin, "."));
                        process.exit(1);
                        return [2 /*return*/];
                    }
                    if (plugin === ts_migrate_plugins_1.jsDocPlugin) {
                        anyAlias_1 = args.aliases === 'tsfixme' ? '$TSFixMe' : undefined;
                        typeMap = typeof args.typeMap === 'string' ? JSON.parse(args.typeMap) : undefined;
                        config = new ts_migrate_server_1.MigrateConfig().addPlugin(ts_migrate_plugins_1.jsDocPlugin, { anyAlias: anyAlias_1, typeMap: typeMap });
                    }
                    else {
                        config = new ts_migrate_server_1.MigrateConfig().addPlugin(plugin, {
                            anyAlias: anyAlias,
                            anyFunctionAlias: anyFunctionAlias
                        });
                    }
                }
                else {
                    useDefaultPropsHelper = args.useDefaultPropsHelper === 'true';
                    defaultAccessibility = args.defaultAccessibility, privateRegex = args.privateRegex, protectedRegex = args.protectedRegex, publicRegex = args.publicRegex;
                    config = new ts_migrate_server_1.MigrateConfig()
                        .addPlugin(ts_migrate_plugins_1.stripTSIgnorePlugin, {})
                        .addPlugin(ts_migrate_plugins_1.hoistClassStaticsPlugin, { anyAlias: anyAlias })
                        .addPlugin(ts_migrate_plugins_1.reactPropsPlugin, {
                        anyAlias: anyAlias,
                        anyFunctionAlias: anyFunctionAlias,
                        shouldUpdateAirbnbImports: true
                    })
                        .addPlugin(ts_migrate_plugins_1.reactClassStatePlugin, { anyAlias: anyAlias })
                        .addPlugin(ts_migrate_plugins_1.reactClassLifecycleMethodsPlugin, { force: true })
                        .addPlugin(ts_migrate_plugins_1.reactDefaultPropsPlugin, {
                        useDefaultPropsHelper: useDefaultPropsHelper
                    })
                        .addPlugin(ts_migrate_plugins_1.reactShapePlugin, {
                        anyAlias: anyAlias,
                        anyFunctionAlias: anyFunctionAlias
                    })
                        .addPlugin(ts_migrate_plugins_1.declareMissingClassPropertiesPlugin, { anyAlias: anyAlias })
                        .addPlugin(ts_migrate_plugins_1.memberAccessibilityPlugin, {
                        defaultAccessibility: defaultAccessibility,
                        privateRegex: privateRegex,
                        protectedRegex: protectedRegex,
                        publicRegex: publicRegex
                    })
                        .addPlugin(ts_migrate_plugins_1.explicitAnyPlugin, { anyAlias: anyAlias })
                        .addPlugin(ts_migrate_plugins_1.addConversionsPlugin, { anyAlias: anyAlias })
                        // We need to run eslint-fix before ts-ignore because formatting may affect where
                        // the errors are that need to get ignored.
                        .addPlugin(ts_migrate_plugins_1.eslintFixPlugin, {})
                        .addPlugin(ts_migrate_plugins_1.tsIgnorePlugin, {})
                        // We need to run eslint-fix again after ts-ignore to fix up formatting.
                        .addPlugin(ts_migrate_plugins_1.eslintFixPlugin, {});
                }
                return [4 /*yield*/, (0, ts_migrate_server_1.migrate)({ rootDir: rootDir, config: config, sources: sources })];
            case 1:
                exitCode = (_a.sent()).exitCode;
                process.exit(exitCode);
                return [2 /*return*/];
        }
    });
}); })
    .command('reignore <folder>', 'Re-run ts-ignore on a project', function (cmd) {
    return cmd
        .option('p', {
        alias: 'messagePrefix',
        "default": 'FIXME',
        type: 'string',
        describe: 'A message to add to the ts-expect-error or ts-ignore comments that are inserted.'
    })
        .positional('folder', { type: 'string' })
        .require(['folder']);
}, function (args) { return __awaiter(void 0, void 0, void 0, function () {
    function withChangeTracking(plugin) {
        return {
            name: plugin.name,
            //@ts-ignore
            run: function (params) {
                return __awaiter(this, void 0, void 0, function () {
                    var prevText, nextText, seen;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                prevText = params.text;
                                return [4 /*yield*/, plugin.run(params)];
                            case 1:
                                nextText = _a.sent();
                                seen = changedFiles.has(params.fileName);
                                if (!seen && nextText != null && nextText !== prevText) {
                                    changedFiles.set(params.fileName, prevText);
                                }
                                return [2 /*return*/, nextText];
                        }
                    });
                });
            }
        };
    }
    var rootDir, changedFiles, eslintFixChangedPlugin, config, exitCode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                rootDir = path_1["default"].resolve(process.cwd(), args.folder);
                changedFiles = new Map();
                eslintFixChangedPlugin = {
                    name: 'eslint-fix-changed',
                    //@ts-ignore
                    run: function (params) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (!changedFiles.has(params.fileName))
                                    return [2 /*return*/, undefined];
                                if (changedFiles.get(params.fileName) === params.text)
                                    return [2 /*return*/, undefined];
                                return [2 /*return*/, ts_migrate_plugins_1.eslintFixPlugin.run(params)];
                            });
                        });
                    }
                };
                config = new ts_migrate_server_1.MigrateConfig()
                    .addPlugin(withChangeTracking(ts_migrate_plugins_1.stripTSIgnorePlugin), {})
                    .addPlugin(withChangeTracking(ts_migrate_plugins_1.tsIgnorePlugin), {
                    messagePrefix: args.messagePrefix
                })
                    .addPlugin(eslintFixChangedPlugin, {});
                return [4 /*yield*/, (0, ts_migrate_server_1.migrate)({ rootDir: rootDir, config: config })];
            case 1:
                exitCode = (_a.sent()).exitCode;
                process.exit(exitCode);
                return [2 /*return*/];
        }
    });
}); })
    .example('$0 --help', 'Show help')
    .example('$0 migrate --help', 'Show help for the migrate command')
    .example('$0 init frontend/foo', 'Create tsconfig.json file at frontend/foo/tsconfig.json')
    .example('$0 init:extended frontend/foo', 'Create extended from the base tsconfig.json file at frontend/foo/tsconfig.json')
    .example('$0 rename frontend/foo', 'Rename files in frontend/foo from JS/JSX to TS/TSX')
    .example('$0 rename frontend/foo --s "bar/baz"', 'Rename files in frontend/foo/bar/baz from JS/JSX to TS/TSX')
    .demandCommand(1, 'Must provide a command.')
    .help('h')
    .alias('h', 'help')
    .alias('i', 'init')
    .alias('m', 'migrate')
    .alias('rn', 'rename')
    .alias('ri', 'reignore')
    .wrap(Math.min(yargs_1["default"].terminalWidth(), 100)).argv;
