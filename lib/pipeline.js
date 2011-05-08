var EventEmitter = require('events').EventEmitter;

function CommandPipeline(){
  var _cmds = [];

  this.add = function(cmd){
    _cmds.push(cmd);
  }

  this.run = function(fn){
    var first = new EventEmitter(),
      prev = first;

    for(var a in _cmds)
      prev = _cmds[a].chain(prev);

    prev
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