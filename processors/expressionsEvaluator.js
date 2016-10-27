var _ = require('lodash');

function process(doc) {
    var globalScope = doc;
    return evalExpr(doc);

    function evalExpr(doc) {
        //console.error("EVALUATING:", doc);
        if (_.isPlainObject(doc)) {
            if (doc["Fn::Equals"]){
                var evaluatedParams = evalExpr(doc["Fn::Equals"]);
                return fnEquals(evaluatedParams[0], evaluatedParams[1]);
            }

            if (doc["Fn::Or"]){
                var evaluatedParams = evalExpr(doc["Fn::Or"]);
                return fnOr(evaluatedParams);
            }

            if (doc["Fn::Not"]){
                var evaluatedParams = evalExpr(doc["Fn::Join"]);
                return fnNot(evaluatedParams[0]);
            }

            if (doc["Fn::Join"]) {
                var evaluatedParams = evalExpr(doc["Fn::Join"]);
                return fnJoin(evaluatedParams[0], evaluatedParams[1]);
            }

            if (doc["Fn::FindInMap"]) {
                var evaluatedParams = evalExpr(doc["Fn::FindInMap"]);
                return fnFindInMap(evaluatedParams[0], evaluatedParams[1], evaluatedParams.length > 2 ? evaluatedParams[2] : null);
            }

            if (doc["Fn::If"]) {
                var evaluatedParams = evalExpr(doc["Fn::If"]);
                return fnIf(evaluatedParams[0], evaluatedParams[1], evaluatedParams[2]);
            }

            if (doc["Fn::Select"]) {
                var evaluatedParams = evalExpr(doc["Fn::Select"]);
                return fnSelect(evaluatedParams[0], evaluatedParams[1]);
            }

            if(doc["Condition"]){
                return evalCondition(doc["Condition"]);
            }



            // regular object
            else return _.mapValues(doc, (child) => evalExpr(child));
        }
        else if (_.isArray(doc))
            return _.map(doc, (elm) => evalExpr(elm));
        else
            return doc;
    }

    // Internal Functions Implementations

    function fnEquals(a, b) {
        return _.isEqual(a, b);
    }

    function fnOr(arr) {
        //console.error("Fn::Or ", arr);
        return _.some(arr)
    }

    function fnNot(a) {
        return !a;
    }

    function fnJoin(separator, arr) {
        return _.join(arr, separator);
    }

    function fnIf(condName, optTrue, optFalse) {
        //console.error("FN:IF", condName);
        var condVal = evalCondition(condName);
        var selectedOption = condVal ? optTrue : optFalse;
        //console.error("IF RETURN:", condVal);
        return selectedOption; 
    }

    function fnSelect(index, optionsArr){
        //console.error("Fn:Select", index), optionsArr;
        return optionsArr[index];
    }

    function fnFindInMap(mapName, key, subKey) {
        //console.error("FINDIN MAP", mapName, key, subKey);
        var ret = globalScope["Mappings"][mapName][key];
        if (subKey)
            ret = ret[subKey];
        //console.error("RET:", ret);
        return ret;
    }

    function evalCondition(condName){
        console.error("EvalCondition", condName);        
        var condExpr = globalScope["Conditions"][condName];
        var condVal = evalExpr(condExpr); // this might not be neccesary - as the condition is probably evaluated by now.
        console.error(" EvalCondition return:", condVal);
        return condVal;
    }


}
exports.process = process;


