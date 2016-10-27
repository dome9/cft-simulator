function textParser(data){
    var doc = JSON.parse(data);
    if (!doc)
        throw "Source file is not a valid JSON"; //TODO add YAML support!
    if (!doc.Resources)
        throw "Source file has no 'Resources' field";
    return doc;
}
exports.process = textParser;


