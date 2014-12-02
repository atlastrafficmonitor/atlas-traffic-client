'use strict';

var NoteIterator = function (song) {
  var count = 0;

  return function () {
    return ++count % song.notes.length;
  };
};

var notesMap = {
  'E' : 329.6,
  'G' : 392.0,
  'C' : 261.6,
  'D' : 293.7,
  'F' : 349.2
};

var jingleBells = {
  name: 'Jingle Bells',
  notes: _.map([
    'E','E','E','E','E','E','E','G','C','D','E',
    'F','F','F','F','F','E','E','E','E','E','D','D','E','D',
    'E','E','E','E','E','E','E','G','C','D','E',
    'F','F','F','F','F','E','E','E','E','G','G','F','D','C'
  ], function(n) { return notesMap[n]; })
};

var noteIterator = new NoteIterator(jingleBells);

var atlasTrafficServer = '192.168.50.4';
var conn = new WebSocket('ws://' + atlasTrafficServer + ':8765');

conn.onopen = function (ev) {
  console.log(ev);
  return;
};

conn.onmessage = function (ev) {
  new T('pluck', {freq:jingleBells.notes[noteIterator()], mul:0.5}).bang().play();
  console.log(ev);
};
