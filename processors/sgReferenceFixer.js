var _ = require('lodash');

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

exports.process = setSGReferences;