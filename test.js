var vm = require('vm'),
  util = require('util'),
  ScriptCompiler = require('./lib/compiler');

var script = [
  {
    type: 'pipeline',
    output_captured: false,
    cmds: [
      {
        name: 'GetFilesCmd',
        properties:{
          Path: '/usr/local/bin'
        }
      },
      {
        name: 'SortObjectCmd',
        properties:{}
      }
    ]
  }
];

var scriptText = new ScriptCompiler().compile(script);

var cs = vm.createScript(scriptText);

cs.runInNewContext({require:require, process:process});


