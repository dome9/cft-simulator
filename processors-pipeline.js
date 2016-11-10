// Main processing pipline

function processData(data,program) {
    var ret;
    // -- Processors Pipline --

    // Parse the input file as JSON (future: YAML support)
    var textParser = require("./processors/textParser");
    ret = textParser.process(data);

    // Expand parameters with concrete values
    var parametersExpander = require("./processors/parametersExpander");
    ret = parametersExpander.process(ret,program);

    // Replace the Fn::GetAtt syntax with Ref syntax for: GroupID, SourceSecurityGroupId and DestinationSecurityGroupId
    var referenceFixer = require("./processors/sgReferenceFixer");
    ret = referenceFixer.process(ret);

    // Expressions Evaluator for resolving intristic functions and runtime values
    var expressionsResolver = require("./processors/expressionsEvaluator");
    ret = expressionsResolver.process(ret);

    // Delete resources with false conditions
    var conditionsHandler = require("./processors/conditionsHandler");
    ret = conditionsHandler.process(ret);

    // Your own custom processors here...
    //var customProcessor = require("./processors/sampleProcessor");
    //ret = customProcessor.process(ret);

    var cleanup = require("./processors/cleanupProcessor");
    ret = cleanup.process(ret);

    return ret;
}

exports.process = processData;