/*
 * grunt-lego-market-index
 * https://github.com/ppxu/grunt-lego-market-index
 *
 * Copyright (c) 2015 PPxu
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
    path = require('path');

function collecMods(modsDir, callback) {
    var mods = [],
        waiting = 0;

    var actualDir = path.resolve(modsDir);

    fs.readdir(actualDir, function(err, files) {
        if (err || !files || !files.length) {
            return callback(err, mods);
        }

        waiting = files.length;

        files.forEach(function(fileName) {
            var filePath = path.join(actualDir, fileName);
            fs.stat(filePath, function(err, fileStat) {
                if (fileStat && fileStat.isDirectory()) {
                    mods.push(fileName);
                }
                if (!--waiting) {
                    callback(null, mods);
                }
            });
        });
    });
}

function wrapModsWithKMD(config, mods, callback) {
    var tab = '    ',
        enter = '\n';

    var start =
        'KISSY.config({' + enter +
        tab + '\'' + config.name + '\': {' + enter +
        tab + tab + 'mods: [';

    var modsArr = mods.sort().map(function(mod) {
        return '\'' + mod + '\'';
    }).join(', ');

    var middle =
        ']' + enter +
        tab + '},' + enter;

    var packages =
        tab + '\'package\': [{' + enter +
        tab + tab + '\'name\': \'' + config.name + '\',' + enter +
        tab + tab + '\'base\': \'http://g.tbcdn.cn/' + config.name + '/' + config.version + '\'' + enter +
        tab + '}';

    var pkgArr = config.dependencies.packages.map(function(pg) {
        return ', {' + enter +
            tab + tab + '\'name\': \'' + pg.name + '\',' + enter +
            tab + tab + '\'base\': \'' + pg.base + '\'' + enter +
            tab + '}';
    }).join('');

    var middle2 = '],' + enter +
        tab + '\'modules\': {' + enter;

    var modulesArr = [];

    for (var module in config.dependencies.modules) {
        modulesArr.push(tab + tab + '\'' + module + '\': ' + JSON.stringify(config.dependencies.modules[module]));
    }

    var modules = modulesArr.join(',');

    var end = enter + tab + '}' + enter + '});';

    return start + modsArr + middle + packages + pkgArr + middle2 + modules + end;
}

function createFile(filePath, content, callback) {
    fs.writeFile(filePath, content, function(err) {
        if (err) {
            return callback(err);
        } else {
            callback(null);
        }
    });
}

function createModsFile(config, modsDir, modsFile, callback) {
    collecMods(modsDir, function(err, mods) {
        if (err) {
            return callback(err);
        }

        createFile(modsFile, wrapModsWithKMD(config, mods), function(err) {
            if (err) {
                return callback(err);
            } else {
                return callback();
            }

        });
    });
}

module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('lego_market_index', 'generate the index file of a market package in lego project', function() {
        var cfg = grunt.file.readJSON('src/config.json');
        var done = this.async(),
            data = this.data;

        createModsFile(cfg, data.modsDir, data.modsOutput, function(err, success) {
            if (err) {
                grunt.log.error(err);
            } else {
                grunt.log.ok('file ' + data.modsOutput + ' has been created successfuly');
            }
            done();
        });
    });

};