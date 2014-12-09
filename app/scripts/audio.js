'use strict';

var NoteIterator = function () {
  var count = 0;

  return function () {
    return ++count % this.notes.length;
  };
};


var RandIterator = function() {
  return function() {
    return Math.floor(Math.random() * this.notes.length);
  };
};

var notesMap = {
  'E' : 329.6,
  'F' : 349.2,
  'G' : 392.0,
  'A' : 440.0,
  'B' : 493.9,
  'C' : 261.6,
  'D' : 293.7,
};

var scale = ['G','A','B','D','E'];


var jingleBells = {
  name: 'Jingle Bells',
  notes: _.map([
    'E','E','E','E','E','E','E','G','C','D','E',
    'F','F','F','F','F','E','E','E','E','E','D','D','E','D',
    'E','E','E','E','E','E','E','G','C','D','E',
    'F','F','F','F','F','E','E','E','E','G','G','F','D','C'
  ], function(n) { return notesMap[n]; }),
  iterator: new NoteIterator()
};


var pentatonic = {
  name: 'Pentatonic Song',
  notes: _.map(scale, function(n) { return notesMap[n]; }),
  iterator: new RandIterator()
};

function Song() {
    this.name = 'pentatonic';

    this.getNote = function() {
        var note = new Note(eval(this.name), Math.random());
        return note;
    };

    return this.name;
}

function Note(song, volume) {
    this.tone = new T('pluck', {freq:song.notes[song.iterator()], mul:volume}).bang();

    this.applyDelay = function(_time,_fb,_mix) {
        // Applies Delay to this.tone
        this.tone = new T('delay', {time:_time, fb:_fb, mix:_mix}, this.tone);
    };

    this.applyReverb = function(_room,_damp,_mix){
        // Applies Reverb with given parameters to this.tone
        this.tone = new T('reverb', {room:_room, damp:_damp, mix:_mix},this.tone);
    };

    this.applyADSR = function(_a,_d,_s,_r){
        // Applies Attack, Decay, Sustain, Release Envelope to this.tone
        this.tone = new T('adsr', {a:_a,d:_d,s:_s,r:_r}, this.tone).on('ended', function() {
            this.pause();
        }).bang();
    };

    this.applyTimeout = function(_timeout){
        var self = this;
        var timeout = new T('timeout', {timeout:_timeout}).on('ended', function() {
            self.tone.release();
            timeout.stop();
        }).start();
    };

    this.applyRelease = function(timeout) {
        var table = [volume,[0,timeout]];
        this.tone = new T('env', {table:table}, this.tone).on('ended', function() {
            this.pause();
        }).bang().play();
    };

    this.applyDelay(1250,0.4,0.1);
    this.applyReverb(0.9,0.9,0.25);
    this.applyRelease(5000);
    return this.tone;
}


var atlasTrafficServer = '0.0.0.0';
var conn = new WebSocket('ws://' + atlasTrafficServer + ':8765');

var song;

conn.onopen = function (ev) {
    song = new Song();
    console.log(ev);
    return;
};

conn.onmessage = function (ev) {
    var note = song.getNote();
    note.play();
    console.log(ev);
};
