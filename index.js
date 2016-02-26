#!/usr/bin/env node
/*jshint multistr: true */

var async = require('async');
var docopt = require('docopt');
var readline = require('readline');
var dust = require('dustjs-linkedin');

var doc = "\n\
Usage:\n\
    csharp-mixin-generator -c CLASSNAME [-n NAMESPACE] [-p] \n\
    csharp-mixin-generator -h | --help | --version\n\
\n\
Generate mixin based on text template.\n\
Just pass in the target classname to the -c argument.\n\
\n\
Options:\n\
    -c CLASSNAME      The classname.\n\
    -n NAMESPACE      The namespace if any.\n\
    -p                If the class is public. [default: true].\n\
    -h --help         Show this screen.\n\
    --version         Show version.\n\
";

function main(args) {
    async.auto({
        validateInputs: function(next, res) {
            next();
        },
        readInput: ['validateInputs', function(next, res) {
            var lines = [];
            var rl = readline.createInterface({
                input: process.stdin,
                output: null,
                terminal: false
            });

            rl.on('line', function(line) {
                lines.push(line);
            });

            rl.on('close', function() {
                next('', lines);
            });
        }],
        templateSrc: ['readInput', function(next, res) {
            var lines = [];
            for (var i = 0; i < res.readInput.length; i++) {
                lines.push('{space}' + res.readInput[i] + '{~n}');
            }
            next(null, lines.join('\n'));
        }],
        generate: ['templateSrc', function(next, res) {
            var data = {
                namespace: !!args['-n'],
                namespaceStart: args['-n'] ? 'namespace ' + args['-n'] + "\n{" : '',
                namespaceEnd: args['-n'] ? '}' : '',
                public: args['-p'] ? 'public ' : '',
                class: args['-c'],
                body: function(chunk, context, bodies, params) {
                    var namespace = context.get('namespace');
                    return {
                        space: namespace ? '   ' : ''
                    };
                }
            };
            dust.renderSource(res.templateSrc, data, next);
        }],
        output: ['generate', function(next, res) {
            process.stdout.write(res.generate);
        }],
    }, function(err, res) {
        if (err) {
            process.stderr.write("Error: " + JSON.stringify(err) + "\n");
            process.exit(1);
        }
    });
}

if (require.main === module) {
    var kwargs = {
        name: "csharp-mixin-generator",
        version: "csharp-mixin-generator 0.1.2"
    };
    var args = docopt.docopt(doc, kwargs);
    main(args);
}
