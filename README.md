# CFT-Simulator
A utility to simulate / debug complex Cloud Formation Templates.

### Why should I care?
CFT have gone a long way from being a declerative blue print for an AWS environment.
Power users of AWS CloudFormation, often create CFTs which act like a software program - one that accepts parameters, process them according to logic and generates output.<br/>
This tool allows you to run an offline (= not executing the stack in AWS environment) simulation of the CFT according to various input parameters.<br/>
Now you can debug complex CFT and transform a generic template into a concrete plan with all parameters and conditions materialized.<br/>
It was created from our need for a pre-processor to allow running security assessments in Dome9's [Clarity Visualization tool](https://dome9.com/solutions/security-visualization/)

### What does it do?
This a work-in-progress. Currently it:
* Parses the input file (JSON only)
* Prompts the user for values for all parameters that are declared in the template (and were not provided as a CLI parameter)
* Replaces all occurrences of the parameters with the user's values
* Evaluates intrinsic functions: And, Or ,Not, Join, FindInMap, etc...
* Evaluates all conditions according to user's input and functions evaluation
* Deletes all nodes with false conditions and select the correct If option
* Replaces Security Groups implicit references from `Fn::GetAtt` syntax to `Ref` which does not rely on runtime values hence more appropriate for static analysis

# Requirements
* NodeJs stable version 4.3.2 or later. 
(Can be downloaded from: <a href="https://nodejs.org">here</a> )

# Installation
1. Clone this repo into your local machine:

```git clone https://github.com/Dome9/cft-simulator.git```

2. Navigate to the tool's folder:

```cd cft-simulator``` 

3. Install the tool's dependencies:

```npm install```

4. Verify the tool is installed:

```node index.js --version```

# Running the tool
The tool receives mandatory command-line argument which is the path to the source CFT file (and optional parameters object) and writes a transformed JSON into the standard output.
The tool will prompt the user to enter every parameter that is defined in the template but was not provided via the command line -p parameter.

Usage:

```
node index.js -h

  Usage: index [options] <file>

  Options:

    -h, --help          output usage information
    -V, --version       output the version number
    -p, --params <env>  a JSON formatted object. surrounded with ' Example: -p '{"env":"prod","a":123}'


node index.js -p '{"env":"prod", "port":80}' path/to/cft.json 
```

In order to write the result into a new file - just redirect the output into the desired file path. Example:

```node index.js path/to/source.json > result.json```

# Executing custom processing logic
You can write your own processors to handle any specific logic for your choice. A good example is to write a custom processor for a custom resource.<br/>
See the `sampleProcessor.js` in `processors` folder.<br/>
*Do not forget* to uncomment the execution of this custom processor in index.js

```js
    // Your own custom processors here...
    //var customProcessor = require("./processors/sampleProcessor");
    //ret = customProcessor.process(ret);
```

# Future Work
* Support stacked CFT
* Support YAML format
* Proper evaluation of conditions (as long as they can be statically evaluated):
    * Implementation of native inner functions [DONE]
    * Minimal emulation of runtime properties
* Better support for 'If' statements according to the evaluated conditions [DONE]






