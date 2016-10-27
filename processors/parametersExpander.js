var _ = require('lodash');
var readlineSync = require('readline-sync');

function expandParams(doc,program) {
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
exports.process = expandParams;