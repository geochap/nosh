var vm = require('vm'),
  ScriptCompiler = require('./lib/compiler');

var script = [
  {
    type: 'pipeline',
    output_captured: false,
    cmds: [
      {
        name: 'GetFilesCmd',
        args:{
          Path: '/usr/local/bin',
          IncludeDetails: false
        }
      },
      {
        name: 'SortObjectCmd',
        args:{
          Property: 'Name',
          Direction: 'desc'
        }
      },
      {
        name: 'FormatListCmd',
        args:{
        }
      }
    ]
  }
];

var scriptText = new ScriptCompiler().compile(script);

var cs = vm.createScript(scriptText);

cs.runInNewContext({require:require, process:process, console:console});


