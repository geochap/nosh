var EventEmitter = require('events').EventEmitter,
  fs = require('fs');

function GetFilesCmd(args){
  EventEmitter.call(this);

  var self = this;

  this.IncludeDetails = false;

  if (typeof args == 'string')
    this.Path = args;
  else if (args && typeof args == 'object')
    for (var key in args)
      this[key] = args[key];

  this.chain = function(prev){
    prev
      .on('open', function(){
        if (self.Path == null){
          self.emit('error', new Error('GetFileCmd: path is required'));
        }
        else{
          self.emit('open');
  
          fs.readdir(self.Path, function(err, res){
            if (err)
              self.emit('error', err);
            else {
              if (self.IncludeDetails){
                getDetails(res);
              }
              else {
                for (var  key in res)
                  self.emit('data', new File(res[key], self.Path));
                self.emit('close');
              }
            }
          });
        }
      })
      .on('data', function(data){
        self.emit('error', new Error('GetFileCmd: input not supported'));
      })
      .on('error', function(err){
        self.emit('error', err);
      });
    return this;
  }

  var getDetails = function(res){
    var f = res.shift();
    if (!f)
      self.emit('close');
    else{
      fs.stat(self.Path + '/' + f, function(err, stats){
        if (err)
          self.emit('error', err);
        else{
          self.emit('data', new File(f, self.Path, stats));
          getDetails(res);
        }
      });
    }
  }
}

GetFilesCmd.prototype.__proto__ = EventEmitter.prototype;
module.exports = GetFilesCmd;

function File(name, path, stats){
  this.Name = name;
  this.Path = path;
  this.FullName = path + '/' + name;
  if (stats)
    for(var p in stats)
      this[p] = stats[p];
  
  this.toStream = function(strm){
    strm.write(this.Path + '/' + this.Name + '\n');
  }
}
