// Cleanup the resulting CFT from mappings, parameters,etc... Keeping the conditions as they are important for debugging
function process(doc) {
    delete doc.Mappings;
    delete doc.Parameters;
    return doc;
}

exports.process = process;