// Custom Processor where you could add you own logic
var _ = require('lodash');

function process(doc) {
    if (_.isPlainObject(doc)) {
        // Add your object processing logic here. You can check for a specific type of node and perfrom specific logic.
        console.error("[SAMPLE] traversing node: " + JSON.stringify(doc));
        
        // Make sure to recursivelly call this method to properly traverse the child nodes
        return _.mapValues(doc, (child) => process(child));
    }
    else if (_.isArray(doc))
        // process arrays
        return _.map(doc, (elm) => process(elm));
    else
        // process values
        return doc;
}

exports.process = process;