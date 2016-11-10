"use strict";

var _ = require('lodash');
var fs = require('fs');
var simulator = require('./processors-pipeline');
var program = require('commander');

program
    .version('0.3.0')
    .usage('[options] <file>')
    .option('-p, --params <env>', 'a JSON formatted object. Example: -p \'{"env":"prod","port":80}\' ')
    .parse(process.argv);

if (program.args.length === 0) {
    console.error('no CFT file path was provided');
    process.exit(1);
}
var file = program.args[0];
console.error("* params: ", program.params);
console.error("* file: ", file);

fs.readFile(file, 'utf8', function (err, data) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    else {
        try {
            var resultObj = simulator.process(data,program);
            // print result to standard output
            console.log(JSON.stringify(resultObj));
        }
        catch (ex) {
            console.error("Processing error occured: ", ex);
            process.exit(1);
        }
    }
});

