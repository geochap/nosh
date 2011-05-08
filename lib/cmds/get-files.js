var EventEmitter = require('events').EventEmitter,
  fs = require('fs');

function GetFilesCmd(args){
  EventEmitter.call(this);

  var self = this;

  if (typeof args == 'string')
    this.Path = args;
  else if (typeof args == 'object')
    for (var key in args)
      this[key] = args[key];

  this.chain = function(prev){
    prev
      .on('open', function(){
        if (self.Path == null)
          throw new Error('GetFileCmd: path is required');

        self.emit('open');

        fs.readdir(self.Path, function(err, res){
          if (err)
            self.emit('error', err);
          else {
            for (var  key in res)
              self.emit('data', new File(res[key]));

            self.emit('close');
          }
        });
      })
      .on('data', function(data){
        self.emit('error', new Error('GetFileCmd: input not supported'));
      })
      .on('error', function(err){
        self.emit('error', err);
      });
    return this;
  }
}

GetFilesCmd.prototype.__proto__ = EventEmitter.prototype;
module.exports = GetFilesCmd;

function File(name){
  this.Name = name;

  this.toStream = function(strm){
    strm.write(this.Name + '\n');
  }
}
