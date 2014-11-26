"use strict";

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

var atlasTrafficServer = '0.0.0.0'
var conn = new WebSocket("ws://" + atlasTrafficServer + ":8765");
var output = '';
conn.onopen = function (ev) { return; };

conn.onmessage = function (ev) {
    /*
    timbre.rec(function(output) {
        var pluck = T("pluck", {freq:jingleBells.notes[noteIterator()], mul:0.5}).bang();
        output.send(pluck);
    }).then(function(result) {
        var L = T("buffer", {buffer:result, loop:false});
        T("reverb", {room:0.9, damp:0.2, mix:0.45},
            T("pan", {pos:-0.6}, L), T("pan", {pos:+0.6}, L)
        ).play();
    })
    */
    timbre.rec(function(output) {
        var midis = [69, 71, 72, 76, 69, 71, 72, 76]//.scramble();
        var msec  = timbre.timevalue("bpm120 l8");
        var synth = T("OscGen", {env:T("perc", {r:msec, ar:true})});
        T("interval", {interval:msec}, function(count) {
            if (count < midis.length) {
                synth.noteOn(midis[count], 100);
            } else {
                output.done();
            }
        }).start();

        output.send(synth);
        }).then(function(result) {
          var L = T("buffer", {buffer:result, loop:true});
          var R = T("buffer", {buffer:result, loop:true});
          var num = 400;
          var duration = L.duration;
          R.pitch = (duration * (num - 1)) / (duration * num);
          T("reverb", {room:0.9, damp:0.2, mix:0.45},
          //T("delay", {time:"bpm120 l16", fb:0.1, cross:true},
              T("pan", {pos:-0.6}, L), T("pan", {pos:+0.6}, R)
          ).play();
    });
};

