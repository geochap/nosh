module.exports.ObjectFormatter = ObjectFormatter;

function ObjectFormatter(obj, display){
  this.toStream = function(strm){
    if (obj)
      output(obj, strm);
  }

  function output(obj, strm){
    if (obj instanceof Array)
      outputArray(obj, strm);
    else if (typeof obj == 'object')
      outputObject(obj, strm);
    else
      strm.write(obj);
  }

  function outputObject(obj, strm){
    if (typeof obj.toStream != 'undefined' && display != 'detail'){
      obj.toStream(strm);
    }
    else{
      for (var key in obj){
        if (typeof obj[key] == 'function')
          continue;
        strm.write(key + ':');
        output(obj[key], strm);
        strm.write('\n');
      }
    }
  }

  function outputArray(a, strm){
    for(var i in a)
      output(a[i], strm);
  }
}
