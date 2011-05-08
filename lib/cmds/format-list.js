var EventEmitter = require('events').EventEmitter,
  ObjectFormatter = require('../util').ObjectFormatter;

function FormatListCmd(){
  var self = this;

  EventEmitter.call(this);

  this.chain = function(prev){
    prev
      .on('open', function(data){
        self.emit('open');
      })
      .on('data', function(data){
        self.emit('data', new ObjectFormatter(data, 'detail'));
      })
      .on('close', function(){
        self.emit('close');
      })
      .on('error', function(err){
        self.emit('error', err);
      });
    return this;
  }
}

FormatListCmd.prototype.__proto__ = EventEmitter.prototype;

module.exports = FormatListCmd;