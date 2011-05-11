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
        args:{}
      }
    ]
  },
  {
    type: 'switch',
    cases: [
      {
        if: {
          type: 'operator',
          name: 'eq',
          args:[
            {
              type: 'variable',
              name: '$a'
            },
            {
              type: 'number',
              value: 12
            }
          ]
        },
        then: {
          type: 'number',
          value: 11
        }
      }
    ]
  }
];

var scriptText = new ScriptCompiler().compile(script);

var cs = vm.createScript(scriptText);

cs.runInNewContext({require:require, process:process, console:console});


