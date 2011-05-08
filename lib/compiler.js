function ScriptCompiler(){
  var _state = 0;

  this.compile = function(script, name){
    if (!(script instanceof Array))
      script = [script];

    var parts = [];
    
    parts.push('var CommandPipeline = require(\'./lib/pipeline\'),');
    parts.push('  cmds = require(\'./lib/cmds\'),');
    parts.push('  ObjectFormatter = require(\'./lib/util\').ObjectFormatter;');

    for (var key in script)
      parts.push(compileExpression(script[key]));

    parts.push('function s' + _state + '(){}');
    parts.push('s0()');

    return parts.join('\n');
  }

  function compileExpression(exp){
    if (exp.type == 'switch')
      return compileSwitch(exp);
    if (exp.type == 'pipeline')
      return compilePipeline(exp);

    return null;
  }

  function compilePipeline(exp){
    var parts = [];

    parts.push('function s' + _state++ + '(){\n');
    parts.push('  var pipe = new CommandPipeline();\n');
    parts.push('  var out = [];\n');
    for (var c in exp.cmds){
      var cmd = exp.cmds[c];
      parts.push('  pipe.add(new cmds.')
      parts.push(cmd.name);
      parts.push('(' + JSON.stringify(cmd.properties) + ')');
      parts.push(');\n');
    }
    parts.push('  pipe.run(function(err, res){\n');
    parts.push('    if (err) s_error(err);\n');
    parts.push('    else if (typeof res == \'undefined\')\n');
    parts.push('      s' + _state  + '(out);\n');
    parts.push('    else\n');

    if (exp.output_captured)
      parts.push('      out.push(res);\n');
    else
      parts.push('      new ObjectFormatter(res).toStream(process.stdout);\n');

    parts.push('  });\n');
    parts.push('}\n');

    return parts.join('');
  }

  function compileSwitch(exp){
    for (var key in exp.cases){
      console.log(exp.cases[key]);
    }
  }
}

module.exports = ScriptCompiler;
