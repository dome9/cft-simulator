"use strict";

var _ = require('lodash');
var fs = require('fs');
var readlineSync = require('readline-sync');
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
            var resultObj = processJSON(data);
            // print result to standard output
            console.log(JSON.stringify(resultObj));
        }
        catch (ex) {
            console.error("Processing error occured: ", ex);
            process.exit(1);
        }
    }
});

function processJSON(data) {
    var doc = JSON.parse(data);
    if (!doc)
        throw "Source file is not a valid JSON"; //TODO add YAML support!
    if (!doc.Resources)
        throw "Source file has no 'Resources' field";

    var ret = doc;
    // -- Processors --

    // Expand parameters with concrete values
    ret = expandParams(ret);

    // Temp - choose the first option in IF statements (will be replaced with full evaluation of the condition)
    ret = selectFirstIfOption(ret);

    // Temp - remove the condition. In the future we'll attempt to evaluate the condition
    ret = removeConditions(ret);

    // Replace the Fn::GetAtt syntax with Ref syntax for: GroupID, SourceSecurityGroupId and DestinationSecurityGroupId
    ret = setSGReferences(ret);

    return ret;
}


function expandParams(doc) {
    var values = gatherParams(doc);
    return processRec(doc, values);

    function gatherParams(doc) {
        var values = { "AWS::Region": "us-east-1" };  //defualt
        // did we recieve params from commandline?
        if (program.params) {
            try {
                var paramsObj = JSON.parse(program.params);
                if (paramsObj)
                    _.assign(values, paramsObj);
            }
            catch (ex) {
                console.error("Could not parse parameter. Probably not a valid JSON %s %s", program.params, ex);
                process.exit(1);
            }
        }

        if (doc.Parameters) {
            _.forEach(doc.Parameters, function (param, name) {
                if (_.includes(_.keys(values), name))
                    return; // great - we got the parameter from the user via CLI parameter

                // we did not get the param as a commandline parameter - get from the user interactively
                var question = `${name}:${param.Description} [${param.AllowedValues}] Enter for default (${param.Default}):`;
                var answer = readlineSync.question(question);
                if (answer === "")
                    answer = param.Default || "";

                console.error(`param  ${name} : ${answer}`);
                values[name] = answer;

            });
        }

        return values;
    }

    function processRec(doc, values) {

        if (_.isPlainObject(doc)) {
            if (doc.Ref && _.includes(_.keys(values), doc.Ref)) //Ref object. Do we know this param? if so replace with a real (expanded) value;
                return values[doc.Ref];
            // regular object
            else return _.mapValues(doc, (child) => processRec(child, values));
        }
        else if (_.isArray(doc))
            return _.map(doc, (elm) => processRec(elm, values));
        else
            return doc;
    }
}

function removeConditions(doc) {
    if (_.isPlainObject(doc)) {
        if (doc.Condition)
            delete doc.Condition
        return _.mapValues(doc, (child) => removeConditions(child));
    }
    else if (_.isArray(doc))
        return _.map(doc, (elm) => removeConditions(elm));
    else
        return doc;
}

function selectFirstIfOption(doc) {
    if (_.isPlainObject(doc)) {
        if (doc["Fn::If"]) //If object. select the first option. In the future we'll perfrom full evaluation of the condition
            return selectFirstIfOption(doc["Fn::If"][1]); // syntax is fn::if [condition,opt1,option2]
        // regular object
        else return _.mapValues(doc, (child) => selectFirstIfOption(child));
    }
    else if (_.isArray(doc))
        return _.map(doc, (elm) => selectFirstIfOption(elm));
    else
        return doc;
}

function setSGReferences(doc) {
    if (_.isPlainObject(doc)) {
        if (doc["GroupId"] && doc["GroupId"]["Fn::GetAtt"]) {
            // this should be the format: "GroupId": {        "Fn::GetAtt": [            "TargetSG",            "GroupId"          ]        }
            var groupLogicalName = doc["GroupId"]["Fn::GetAtt"][0];
            doc.GroupId = { "Ref": groupLogicalName };
        }

        if (doc["SourceSecurityGroupId"] && doc["SourceSecurityGroupId"]["Fn::GetAtt"]) {
            var groupLogicalName = doc["SourceSecurityGroupId"]["Fn::GetAtt"][0];
            doc["SourceSecurityGroupId"] = { "Ref": groupLogicalName };
        }

        if (doc["DestinationSecurityGroupId"] && doc["DestinationSecurityGroupId"]["Fn::GetAtt"]) {
            var groupLogicalName = doc["DestinationSecurityGroupId"]["Fn::GetAtt"][0];
            doc["DestinationSecurityGroupId"] = { "Ref": groupLogicalName };
        }

        return _.mapValues(doc, (child) => setSGReferences(child));
    }
    else if (_.isArray(doc))
        return _.map(doc, (elm) => setSGReferences(elm));
    else
        return doc;
}
