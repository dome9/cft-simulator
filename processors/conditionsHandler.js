var _ = require('lodash');

function removeConditions(doc) {
    if (_.isPlainObject(doc)) {
        // BFS style traversal - start with current layer and move to child objects
        var result =  _.reduce(doc, function(result,value,key){
            if( ! _.includes(_.keys(value),"Condition") || value["Condition"] ) // if we do not have a condition or it is true - then add that sub object
                result[key] = value;
            //else
            //    console.error("Removed object with false condition: ", value);
            
            return result;
        },{});

        // continue to process sub objects
        return _.mapValues(result, (child) => removeConditions(child));
    }
    else if (_.isArray(doc))
        return _.map(doc, (elm) => removeConditions(elm));
    else
        return doc;
}

exports.process = removeConditions;