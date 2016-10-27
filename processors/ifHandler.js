/*
// Not needed anymore. expressionsEvaluator is doing this job now
var _ = require('lodash');

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
exports.process = selectFirstIfOption;
*/