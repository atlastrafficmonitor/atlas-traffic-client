var NoteIterator = function (song) {
  var count = 0;

  return function () {
    return ++count % song.notes.length;
  };
};

var mySong = {
  name: 'Weird',
  notes: [
    440, 440, 440, 440, 440, 440, 440,
    523.3, 349.2, 392, 440, 466.2, 466.2,
    466.2, 446, 446, 440, 440, 440, 440,
    440, 392, 392, 440, 392, 523.3
  ]
};

var noteIterator = NoteIterator(mySong);

var conn = new WebSocket("wss://ws.chain.com/v2/notifications");

conn.onopen = function (ev) {
  var req = {type: "new-transaction", block_chain: "bitcoin"};
  conn.send(JSON.stringify(req));
};

conn.onmessage = function (ev) {
  T("pluck", {freq:mySong.notes[noteIterator()], mul:0.5}).bang().play();
};
