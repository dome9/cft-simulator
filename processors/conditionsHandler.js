var _ = require('lodash');

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

exports.process = removeConditions;