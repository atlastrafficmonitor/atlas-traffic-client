
'use strict';





var numBefore = 0;

var atlasTrafficServer = '0.0.0.0';
var conn = new WebSocket('ws://' + atlasTrafficServer + ':3000');
var numPeople = 0;
var currentHour =0; 
var k = 0;
var counts = [];
var mostpeople = 10;
var hour = 0;
var secondLayer = new Layer();
var firstLayer = new Layer();
var phase = "Starts";
var screenText = "";
var storyLine = 0;
var numLines = 4;
var storyImage = "";
var storyArray = [];
var rawStory = "";
var storyHue = Math.random() *360;
var displayImage = "1";
var ballsAdded = 0;


var ballSpeed = 0.1;
secondLayer.activate();



var Starts = ["She was walking in a hurry through the lobby.", 
            "Data traveling into her ears and eyes.",
            "The glow of her retina display shining back.",
            "A soft voice lilted through the noise of her earbuds, barely audible above the beat."];


var A = ["Pulling her earbud out, she turned to notice a boy shaking his head, sobbing at a nearby table.",
            "His laptop had just crashed, and his final project was lost.",
            "\"What am I supposed to do now? This is what I get for trusting a computer!\" he lamented.",
            "She approached him and asked, \"Are you okay?\""];
 var B = ["However, the beat went on and she missed the tragedy happening only inches away.",
            "Captivated by her Facebook feed, she remembered she had promised Taylor that she would accept her party invite.",
            "It was her duty to attend the small house-warming party.",
            "Clicking *accept*, she thought about the three other events she had agreed to that night."];
 var AA = ["\"Yeah, I\"ll be fine.  Wish I could go back an hour and back up my data,\" he replied.",
            "She smiled and put her hand on his shoulder, \"I can\"t even imagine.  During finals week, too.\"",
            "He gave back a warm smile and felt relieved to have someone sharing in this frustrating moment.",
            "\"Things could be worse\", he said.",
            "\"That doesn\"t change how it feels.  Here let me buy you a coffee\", she offered.",
            "The two went onward smiling, leaving their technology behind."];
var BA = ["She remembered how Taylor had been there for her when her rent check bounced.",
            "The other parties suddenly seemed less appealing compared to supporting her true friend.",
            "Closing Facebook, she tapped out a text message to Taylor.",
            "Hey, I\"ll def be there on Saturday - I\"ll bring a bottle of red. She texted.",
            "Putting her phone away, she smiled and walked onward to class."];
var AB = ["\"Yeah yeah, I\"m fine. Tired of my crappy computer,\" he answered sternly.", 
            "\"It\"s better than writing everything on paper\", she kidded.",
            "\"Easy for you to say. Why don\"t you joke with someone else?\" he replied.",
            "Only hoping to help, she walked away stunned and thought about how she\"d think twice next time she thinks to chat with a stranger."];
var BB = ["Browsing through the other events for Saturday, she saw one hundred people were going to Travis\" party.",
            "The pictures from Travis\" last party looked like a blast - selfies with scattered laser light in the background.",
            "Already forgetting about Taylor\"s party, she accepted the invite to Travis\" and turned up some house music in her ears.",
            "Fantasizing about the weekend, she entered her class dreaming of something only movies had promised her."]; 

var StartsImage = ["1", "2", "3", "4"];
var AImage = ["A1", "A2", "A3", "A4"];
var BImage = ["B1", "B2", "B3", "B4"];
var AAImage = ["AA1", "AA2", "AA3", "AA4", "AA5", "AA6"];
var BAImage = ["BA1", "BA2", "BA3", "BA4", "BA5"];
var ABImage = ["AB1", "AB2", "AB3", "AB4"];
var BBImage = ["BB1", "BB2", "BB3", "BB4"];


function TimeCount(i, h, c, a) {

this.iterations = i;
this.hour = h;
this.count = c;
this.averagenum = a;

}

for (var i = 0; i<24; i++) {
counts[i] = new TimeCount(0, i, 20, 20);
}


setInterval(function(){ 

var currentdate = new Date();
k = currentdate.getHours();
counts[hour].iterations = counts[hour].iterations + 1;
counts[hour].averagenum = parseInt((parseInt(counts[hour].averagenum) + parseInt(numPeople))/counts[hour].iterations);
counts[hour].count = numPeople;
numPeople = 0;

}, 10000);




function Ball(r, p, v) {
  this.radius = r;
  this.point = p;
  this.vector = v;
  this.maxVec = 15;
  this.numSegment = Math.floor(r / 3 + 2);
  this.boundOffset = [];
  this.boundOffsetBuff = [];
  this.sidePoints = [];
  this.path = new Path({
    fillColor: {
      /*hue: (0.7 + (numPeople / 60 * 0.3)) * 360,*/
      hue: Math.random() *360,
      saturation: 1,
      brightness: 1
    },
    blendMode: 'screen'
  });

  for (var i = 0; i < this.numSegment; i ++) {
    this.boundOffset.push(this.radius);
    this.boundOffsetBuff.push(this.radius);
    this.path.add(new Point());
    this.sidePoints.push(new Point({
      angle: 360 / this.numSegment * i,
      length: 1
    }));
  }
}

Ball.prototype = {
  iterate: function() {
    this.checkBorders();

    if (this.vector.length > this.maxVec) {
      this.vector.length = this.maxVec;
    }

    this.point += this.vector;
    this.updateShape();
  },

  checkBorders: function() {
    var size = view.size;
    if (this.point.x < -this.radius) {
      this.point.x = size.width + this.radius;
    }

    if (this.point.x > size.width + this.radius) {
      this.point.x = -this.radius;
    }

    if (this.point.y < -this.radius) {
      this.point.y = size.height/2 + this.radius;
    }

    if (this.point.y > size.height/2 + this.radius) {
      this.point.y = -this.radius;
    }
  },

  updateShape: function() {
    var segments = this.path.segments;

    for (var i = 0; i < this.numSegment; i ++) {
      segments[i].point = this.getSidePoint(i);
    }

    this.path.smooth();
    for (i = 0; i < this.numSegment; i ++) {
      if (this.boundOffset[i] < this.radius / 4) {
        this.boundOffset[i] = this.radius / 4;
      }

      var next = (i + 1) % this.numSegment;
      var prev = (i > 0) ? i - 1 : this.numSegment - 1;
      var offset = this.boundOffset[i];
      offset += (this.radius - offset) / 15;
      offset += ((this.boundOffset[next] + this.boundOffset[prev]) / 2 - offset) / 3;
      this.boundOffsetBuff[i] = this.boundOffset[i] = offset;
    }
  },

  react: function(b) {
    var dist = this.point.getDistance(b.point);
    if (dist < this.radius + b.radius && dist !== 0) {
      var overlap = this.radius + b.radius - dist;
      var direc = (this.point - b.point).normalize(overlap * 0.015);
      this.vector += direc;
      b.vector -= direc;

      this.calcBounds(b);
      b.calcBounds(this);
      this.updateBounds();
      b.updateBounds();
    }
  },

  getBoundOffset: function(b) {
    var diff = this.point - b;
    var angle = (diff.angle + 180) % 360;
    return this.boundOffset[Math.floor(angle / 360 * this.boundOffset.length)];
  },

  calcBounds: function(b) {
    for (var i = 0; i < this.numSegment; i ++) {
      var tp = this.getSidePoint(i);
      var bLen = b.getBoundOffset(tp);
      var td = tp.getDistance(b.point);
      if (td < bLen) {
        this.boundOffsetBuff[i] -= (bLen  - td) / 2;
      }
    }
  },

  getSidePoint: function(index) {
    return this.point + this.sidePoints[index] * this.boundOffset[index];
  },

  updateBounds: function() {
    for (var i = 0; i < this.numSegment; i ++){
      this.boundOffset[i] = this.boundOffsetBuff[i];
    }
  }
};


//--------------------- main ---------------------

var balls = [];
var numBalls = numPeople;



function newEvent(){

  for (var i = 0; i < numPeople; i++) {
  var position = Point.random() * view.size;
  var vector = new Point({
    angle: 360 * Math.random(),
    length: ballSpeed
  });
  var radius = 1-(numPeople/250) * 60 + 60;
  balls.push(new Ball(radius, position, vector));

}




}

var size = view.size;
var textin = new PointText(new Point(size.width/2, size.height/5));
textin.justification = 'center';
textin.fillColor = 'red';
textin.fontSize = 40;
textin.content = 'Sensor Steps in the Last Hour: ' + numPeople;


 /*jshint unused:false*/
function onFrame() {
  for (var i = 0; i < balls.length - 1; i++) {
    for (var j = i + 1; j < balls.length; j++) {
      balls[i].react(balls[j]);
    }
  }

  var l;
  for (i = 0, l = balls.length; i < l; i++) {
    balls[i].iterate();
  }
}


function drawText(ch) {

firstLayer.activate();


var storytext = new PointText(new Point(size.width/2, 7*size.height/10));
storytext.justification = 'center';
storytext.fillColor = 'white';
storytext.fontSize = 25;
storytext.content = screenText;

var beglong = new Point(0, 3*size.height/4);
var endlong = new Point(size.width, 3*size.height/4);
var path = new Path.Line(beglong, endlong);
path.strokeColor = 'white';

var  begone= new Point(size.width/5, 3*size.height/4);
var endone = new Point(size.width/5 , size.height);
var path = new Path.Line(begone, endone);
path.strokeColor = 'white';

var  begone= new Point(2*size.width/5, 3*size.height/4);
var endone = new Point(2*size.width/5 , size.height);
var path = new Path.Line(begone, endone);
path.strokeColor = 'white';

var  begone= new Point(3*size.width/5, 3*size.height/4);
var endone = new Point(3*size.width/5 , size.height);
var path = new Path.Line(begone, endone);
path.strokeColor = 'white';

var  begone= new Point(4*size.width/5, 3*size.height/4);
var endone = new Point(4*size.width/5 , size.height);
var path = new Path.Line(begone, endone);
path.strokeColor = 'white';


var text = new PointText(new Point(size.width/10, 16*size.height/20));
text.justification = 'center';
text.fillColor = 'white';
text.fontSize = 20;
if (parseInt(ch.substring(0, 2))-2 >= 0){
text.content = parseInt(ch.substring(0, 2)) - 2 + ':00';
}
if (parseInt(ch.substring(0, 2))-2 === -1){
text.content = '23:00';
}
if (parseInt(ch.substring(0, 2))-2 === -2){
text.content = '22:00';
}

var text = new PointText(new Point(3*size.width/10, 16*size.height/20));
text.justification = 'center';
text.fillColor = 'white';
text.fontSize = 20;
if (parseInt(ch.substring(0, 2))-1 >= 0){
text.content = parseInt(ch.substring(0, 2)) - 1 + ':00';
}
if (parseInt(ch.substring(0, 2))-1 === -1){
text.content = '23:00';
}

var text = new PointText(new Point(7*size.width/10, 16*size.height/20));
text.justification = 'center';
text.fillColor = 'white';
text.fontSize = 20;
text.content = parseInt(ch.substring(0, 2)) + 1 + ':00';
text.fontSize = 20;
if (parseInt(ch.substring(0, 2))+1 <= 23){
text.content = parseInt(ch.substring(0, 2)) + 1 + ':00';
}
if (parseInt(ch.substring(0, 2))+1 === 24){
text.content = '0:00';
}

var text = new PointText(new Point(9*size.width/10, 16*size.height/20));
text.justification = 'center';
text.fillColor = 'white';
text.fontSize = 20;
if (parseInt(ch.substring(0, 2))+2 <= 23){
text.content = parseInt(ch.substring(0, 2)) + 2 + ':00';
}
if (parseInt(ch.substring(0, 2))+2 === 24){
text.content = '0:00';
}
if (parseInt(ch.substring(0, 2))+2 === 25){
text.content = '1:00';
}

var countTwoAgo = new PointText(new Point(size.width/10, 18*size.height/20));
countTwoAgo.justification = 'center';
countTwoAgo.fillColor = 'white';
countTwoAgo.fontSize = 30;
if (parseInt(ch.substring(0, 2))-2 >= 0){
countTwoAgo.content = counts[parseInt(ch.substring(0, 2))-2].count;
}
if (parseInt(ch.substring(0, 2))-2 === -1){
countTwoAgo.content = counts[23].count;
}
if (parseInt(ch.substring(0, 2))-2 === -2){
countTwoAgo.content = counts[22].count;
}

var countOneAgo = new PointText(new Point(3*size.width/10, 18*size.height/20));
countOneAgo .justification = 'center';
countOneAgo .fillColor = "white";
countOneAgo .fontSize = 30;
if (parseInt(ch.substring(0, 2))-1 >= 0){
countOneAgo.content = counts[parseInt(ch.substring(0, 2))-1].count;
}
if (parseInt(ch.substring(0, 2))-1 === -1){
countOneAgo.content = counts[23].count;
}


var predOne = new PointText(new Point(7*size.width/10, 18*size.height/20));
predOne.justification = 'center';
predOne.fillColor = 'white';
predOne.fontSize = 30;
if (parseInt(ch.substring(0, 2))+1 < 24){
predOne.content = counts[parseInt(ch.substring(0, 2))+1].averagenum;
}
if (parseInt(ch.substring(0, 2))+1 === 24){
predOne.content = counts[0].averagenum;
}

var predTwo = new PointText(new Point(9*size.width/10, 18*size.height/20));
predTwo.justification = 'center';
predTwo.fillColor = 'white';
predTwo.fontSize = 30;
if (parseInt(ch.substring(0, 2))+2 < 24){
predTwo.content = counts[parseInt(ch.substring(0, 2))+2].averagenum;
}
if (parseInt(ch.substring(0, 2))+2 === 24){
predTwo.content = counts[0].averagenum;
}
if (parseInt(ch.substring(0, 2))+2 === 25){
predTwo.content = counts[1].averagenum;
}

secondLayer.activate();







var qr = new Raster('qr.png');
qr.position = new Point(size.width/2, 9*size.height/10);
qr.scale(0.2, {x:size.width/2, y:9*size.height/10});

var textin = new PointText(new Point(size.width/2, size.height/10));
textin.justification = 'center';
textin.fillColor = 'white';
textin.fontSize = 40;
textin.content = 'Sensor Hits in Last 10 min: ' + numPeople;






firstLayer.activate();

}

setInterval(function(){ 


if (storyLine == numLines){
changePhase();
} 


console.log(phase);

screenText = eval(phase)[storyLine];
displayImage = eval(phase + "Image")[storyLine];
storyLine = storyLine + 1;

}, 10000);


function changePhase() {

if (counts[hour].count > counts[hour].averagenum){
switch(phase) {
    case "Starts":
        phase = "A";
        storyLine = 0;
        break;
    case "A":
        phase = "AA";
        storyLine = 0;
        break;
    case "B":
        phase = "BA";
        storyLine = 0;
        break;
        case "AA":
    case "BB":
    case "BA":
    case "AB":
        phase = "Starts";
        storyLine = 0;
}
}

if (counts[hour].count < counts[hour].averagenum) {
switch(phase) {
    case "Starts":
        phase = "B";
        storyLine = 0;
        break;
    case "A":
        phase = "AB";
        storyLine = 0;
        break;
    case "B":
        phase = "BB";
        storyLine = 0;
        break;
    case "AA":
    case "BB":
    case "BA":
    case "AB":
        phase = "Starts"
        storyLine = 0
}

}
numLines = eval(phase).length;
}

conn.onmessage = function (ev) {
  
  
  secondLayer.activate();
  project.activeLayer.removeChildren();
  firstLayer.activate();
  project.activeLayer.removeChildren();

  for (var o = 0; o < balls.length; o++){
  balls = [];
  }  

  ballsAdded = ballsAdded + 1;
  numBefore = numPeople;
  var evdata = JSON.parse(ev.data);
  numPeople = numPeople + 1;
  console.log(numPeople);
  numBalls = evdata.totalEntries;
  if (numPeople > mostpeople){
  mostpeople = numPeople;
  }


  currentHour = evdata.timestamp;
  hour = parseInt(currentHour.substring(0, 2));
  console.log(currentHour);

  newEvent();


var raster = new Raster(displayImage+'B.jpg');
raster.position = new Point(size.width/2, 4*size.height/10);
raster.scale(1, {x:size.width/2, y:9*size.height/10});


drawText(currentHour);

  textin.content = 'Sensor Steps in the Past: ' + numPeople;

};






