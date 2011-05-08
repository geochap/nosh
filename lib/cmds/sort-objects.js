var EventEmitter = require('events').EventEmitter;

function SortObjectCmd(properties){
  EventEmitter.call(this);

  var self = this;
  var items;

  if (properties)
    for (var key in properties)
      this[key] = properties[key];

  this.SortProperty = 'Name';

  this.chain = function(prev){
    prev
      .on('open', function(){
        items = [];
      })
      .on('data', function(data){
        items.push(data);
      })
      .on('close', function(){
        items.sort(function(a, b){
          return self.compare(a[self.SortProperty], b[self.SortProperty]);
        });
        self.emit('open');
        for (var i in items)
          self.emit('data', items[i]);
        self.emit('close');
      })
      .on('error', function(err){
        self.emit('error', err);
      });

    return this;
  }

  this.compare = function(a, b){
    if (typeof a == 'number')
      return a - b;
    if (typeof a == 'string'){
      if (a < b) return -1;
      else if (a > b) return 1;
      return 0;
    }

    return this.compare(a + '', b + '');
  }
}

SortObjectCmd.prototype.__proto__ = EventEmitter.prototype;

module.exports = SortObjectCmd;