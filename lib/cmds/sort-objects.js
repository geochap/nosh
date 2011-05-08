var EventEmitter = require('events').EventEmitter;

function SortObjectCmd(properties){
  EventEmitter.call(this);

  var self = this;

  this.Direction = 'asc';  

  if (properties && typeof properties == 'object')
    for (var key in properties)
      this[key] = properties[key];

  this.chain = function(prev){
    var items;
    prev
      .on('open', function(){
        items = [];
      })
      .on('data', function(data){
        items.push(data);
      })
      .on('close', function(){
        items.sort(function(a, b){
          if (self.Direction == 'asc')
            return self.compare(a[self.Property], b[self.Property]);
          else
            return self.compare(b[self.Property], a[self.Property]);
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