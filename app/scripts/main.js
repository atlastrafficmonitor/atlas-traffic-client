
// Contain to avoid globals
var PlaySeq = (function(){
  // Number of events handled
  var count = 0;
  var noteSeq = [
      5,3,1,5,3,1,1,1,1,1,3,3,3,3,5,3,1
    ];
  var len = noteSeq.length;
  // Returns current note to play
  this.get = function(){
    var noteNum  = 69 + noteSeq[count % len];
    var velocity = 64 + (count % 64);
    count = count+1;
    return [noteNum,velocity];
  };
  return this;

});

var env = T("perc", {a:50, r:2500});
var pluck = T("PluckGen", {env:env, mul:0.5}).play();
var PS = new PlaySeq();

$(function() {
  $(window).keypress(function(e) {
    var key = e.which;
    var data = PS.get();
    pluck.noteOn(data[0],data[1]).start();
  });
});

// var inst = T("interval", {interval:100}, function(count) {
//   console.log(count);
//   var noteNum  = 69 + [0, 2, 4, 5, 7, 9, 11, 12][count % 8];
//   var velocity = 64 + (count % 64);
//   pluck.noteOn(noteNum, velocity);
// });


// $(function() {
//   $(window).keypress(function(e) {
//     var key = e.which;
//     inst.start();
//   });
// });