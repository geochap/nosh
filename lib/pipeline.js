var EventEmitter = require('events').EventEmitter;

//executes a series of commands, piping the output of each into its successor as input
function CommandPipeline(){
  var _cmds = [];

  this.add = function(cmd){
    _cmds.push(cmd);
  }

  this.run = function(fn){
    var first = new EventEmitter(),
      cmd = first;

    for(var a in _cmds)
      cmd = _cmds[a].chain(cmd);

    cmd
      .on('data', function(data){
        fn(null, data);
      })
      .on('close', function(){
        fn();
      })
      .on('error', function(err){
        fn(err);
      });

    first.emit('open');
  }
}

module.exports = CommandPipeline;