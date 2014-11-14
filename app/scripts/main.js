user "strict";

var NoteIterator = function (song) {
  var count = 0;

  return function () {
    return ++count % song.notes.length;
  };
};

var notesMap = {
  "E" : 329.6,
  "G" : 392.0,
  "C" : 261.6,
  "D" : 293.7,
  "F" : 349.2
};

var jingleBells = {
  name: "Jingle Bells",
  notes: _.map([
    "E","E","E","E","E","E","E","G","C","D","E",
    "F","F","F","F","F","E","E","E","E","E","D","D","E","D",
    "E","E","E","E","E","E","E","G","C","D","E",
    "F","F","F","F","F","E","E","E","E","G","G","F","D","C"
  ], function(n) { return notesMap[n]; })
};

var noteIterator = NoteIterator(jingleBells);

$(function() {
  $(window).keypress(function(e) {
    var key = e.which;
    T("pluck", {freq:jingleBells.notes[noteIterator()], mul:0.5}).bang().play();
  });
});

// var conn = new WebSocket("wss://ws.chain.com/v2/notifications");
//
// conn.onopen = function (ev) {
//   var req = {type: "new-transaction", block_chain: "bitcoin"};
//   conn.send(JSON.stringify(req));
// };
//
// conn.onmessage = function (ev) {
//   T("pluck", {freq:jingleBells.notes[noteIterator()], mul:0.5}).bang().play();
// };
