const simulator = require('../processors-pipeline');
const fs = require('fs');
const assert = require('assert');

// TEST Suite 1
var file = 'test1.json';
fs.readFile(file, 'utf8', function (err, data) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    try {
        var resultObj = simulator.process(data, { params: JSON.stringify({ EnvType: "prod", NameIndex: 1 }) });
        runTestSuite1(resultObj);
    }
    catch (ex) {
        console.error("Processing error occured: ", ex);
        process.exit(1);
    }
});

function runTestSuite1(obj) {
    try {
        // Check sanity
        assert(obj, "Got no object from simulator");
        assert.equal(obj.Conditions.CreateProdResources, true, "True Condition");
        assert.equal(obj.Conditions.CreateDevResources, false, "False Condition");
        assert.equal(obj.Conditions.OrTest, true, "OR test");
        assert.equal(obj.Conditions.NonProd, false, "NOT test");
        assert.equal(obj.Resources.EC2Instance.Properties.FindInMapTest, "ami-use1", "MappingsTest");
        assert.equal(obj.Resources.EC2Instance.Properties.NestedIfTest, "c1.forprod", "Nested If test");
        assert.equal(obj.Resources.EC2Instance.Properties.PseudoParam, "us-east-1", "Pseudo Param - region");
        assert.equal(obj.Resources.EC2Instance.Properties.SelectTest, "grapes", "Select Test");
        assert.deepEqual(obj.Resources.EC2Instance.Properties.SplitTest, ["a", "b", "c"], "Split Test");
        assert(obj.Resources.ProdInstance, "Positive Condition");
        assert(obj.Resources.NonProdInstance == null, "Failed condition - node should be removed");

        // Got here? We are happy
        console.log("Test Suite Success :)");
    }
    catch (ex) {
        console.error("Test run failed", ex);
        process.exit(1);
    }
}

