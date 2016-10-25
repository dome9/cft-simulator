# CFT-Simulator
A utility to simulate / debug complex Cloud Formation Templates.

### Why should I care?
CFT have gone a long way from being a declerative blue print for an AWS environemnt.
Power users of AWS CloudFormation, often create CFTs which act like a software program - one that accepts parameters, process them according to logic and generates output.<br/>
This tool allows to run an offline (= not executing the stack in AWS environment) simulation of the CFT according to various input parameters.<br/>
It allows to debug complex CFT and to transform from a generic 'blueprint' into a concrete plan with all parameters and conditions materialized.<br/>
It was created from our need for a preprosessor to allow running security assessments in Dome9's [Clarity Visualization tool](https://dome9.com/solutions/security-visualization/)

### What does it do?
This an early work-in-progress. Currently it:
* Parses the input file (JSON only)
* Prompts the user for values for all parameters that are decalred in the template
* Replaces all occurences of the parameters with the user's values
* In 'IF' statements - it currently selects the first option. (soon - a true evaluation of the condition)
* Clears all conditions (keeping the original node). Soon, it will allow / delete the node according to proper evaluation of the condition

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
The tool recives a single command-line argument which is the path to the source CFT file and writes a transformed JSON into the standard output.

Usage:

```node index.js <path to file>```

In order to write the result into a new file - just redirect the output into the desired file path. Example:

```node index.js path/to/source.json > result.json```

# Future Work
* Support stacked CFT
* Support YAML format
* Proper evaluation of conditions (as long as they can be statically evaluated):
    * Implementation of native inner functions
    * Minimal emulation of runtime properties
* Better support for 'If' statements according to the evaluated conditions






