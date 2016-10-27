"use strict";

var _ = require('lodash');
var fs = require('fs');

var program = require('commander');

program
    .version('0.1.0')
    .usage('[options] <file>')
    .option('-p, --params <env>', 'a JSON formatted object. surrounded with \' Example: -p \'{"env":"prod","port":80}\' ')
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
            var resultObj = processData(data);
            // print result to standard output
            console.log(JSON.stringify(resultObj));
        }
        catch (ex) {
            console.error("Processing error occured: ", ex);
            process.exit(1);
        }
    }
});

function processData(data) {
    var ret;
    // -- Processors Pipline --

    // Parse the input file as JSON (future: YAML support)
    var textParser = require("./processors/textParser");
    ret = textParser.process(data);

    // Expand parameters with concrete values
    var parametersExpander = require("./processors/parametersExpander");
    ret = parametersExpander.process(ret,program);

    // Temp - choose the first option in IF statements (will be replaced with full evaluation of the condition)
    var ifProcessor = require("./processors/ifHandler");
    ret = ifProcessor.process(ret);

    // Temp - remove the condition. In the future we'll attempt to evaluate the condition
    var conditionsHandler = require("./processors/conditionsHandler");
    ret = conditionsHandler.process(ret);

    // Replace the Fn::GetAtt syntax with Ref syntax for: GroupID, SourceSecurityGroupId and DestinationSecurityGroupId
    var referenceFixer = require("./processors/sgReferenceFixer");
    ret = referenceFixer.process(ret);

    // Your own custom processors here...
    //var customProcessor = require("./processors/sampleProcessor");
    //ret = customProcessor.process(ret);

    return ret;
}








