var inst = T("interval", {interval:100}, function(count) {
  console.log(count);
  var noteNum  = 69 + [0, 2, 4, 5, 7, 9, 11, 12][count % 8];
  var velocity = 64 + (count % 64);
  pluck.noteOn(noteNum, velocity);
});


$(function() {
  $(window).keypress(function(e) {
    var key = e.which;
    inst.start();
  });
});
