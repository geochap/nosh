var CommandPipeline = require('./lib/pipeline'),
  cmds = require('./lib/cmds'),
  util = require('./lib/util');


var $v1;
var $v2;

function s1(){
  $v1 = 2;
  if ($v1 < 2)
    s2();
  else if ($v1 == 2)
    s3();
  else
    s4();
}

function s2(){
  var pipe = new CommandPipeline();
  pipe.add(new cmds.GetFilesCmd('/home'));
  pipe.add(new cmds.SortObjectCmd());
  pipe.add(new cmds.FormatListCmd());
  pipe.run(function(err, res){
    if (err)
      s10(err);
    else if (typeof res == 'undefined')
      s5();
    else
      res.toStream(process.stdout);
  });
}

function s3(){
  var pipe = new CommandPipeline();
  var out = [];
  pipe.add(new cmds.GetFilesCmd('..'));
  pipe.add(new cmds.SortObjectCmd());
  pipe.run(function(err, res){
    if (err)
      s10(err);
    else if (typeof res == 'undefined'){
      s5(out);
    }
    else {
      out.push(res);
    }
  });
}

function s4(){
  $v2 = "ss";
  s6();
}

function s5(val){
  $v2 = val;
  s6();
}

function s6(){
  new util.ObjectFormatter($v2).toStream(process.stdout);
}

function s10(err){
  console.log(err);
}
s1();
