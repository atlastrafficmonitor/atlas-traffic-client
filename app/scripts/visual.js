'use strict';

var numPeople = parseInt(Math.random() * 60);

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
      hue: (.7 + (numPeople/60*.3)) * 360,
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
    if (this.vector.length > this.maxVec)
      this.vector.length = this.maxVec;
    this.point += this.vector;
    this.updateShape();
  },

  checkBorders: function() {
    var size = view.size;
    if (this.point.x < -this.radius)
      this.point.x = size.width + this.radius;
    if (this.point.x > size.width + this.radius)
      this.point.x = -this.radius;
    if (this.point.y < -this.radius)
      this.point.y = size.height/2 + this.radius;
    if (this.point.y > size.height/2 + this.radius)
      this.point.y = -this.radius;
  },

  updateShape: function() {
    var segments = this.path.segments;
    for (var i = 0; i < this.numSegment; i ++)
    segments[i].point = this.getSidePoint(i);

    this.path.smooth();
    for (var i = 0; i < this.numSegment; i ++) {
      if (this.boundOffset[i] < this.radius / 4)
        this.boundOffset[i] = this.radius / 4;
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
    if (dist < this.radius + b.radius && dist != 0) {
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
    for (var i = 0; i < this.numSegment; i ++)
    this.boundOffset[i] = this.boundOffsetBuff[i];
  }
};


//--------------------- main ---------------------

setTimeout(function(){location.reload()},10000);
var balls = [];
var numBalls = numPeople;
for (var i = 0; i < numBalls; i++) {
  var position = Point.random() * view.size;
  var vector = new Point({
    angle: 360 * Math.random(),
    length: numPeople/60 * 10
  });
  var radius = 1-(numPeople/60) * 60 + 60;
  balls.push(new Ball(radius, position, vector));
}

function onFrame() {
  for (var i = 0; i < balls.length - 1; i++) {
    for (var j = i + 1; j < balls.length; j++) {
      balls[i].react(balls[j]);
    }
  }
  for (var i = 0, l = balls.length; i < l; i++) {
    balls[i].iterate();
  }
}

var size = view.size;
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

var text = new PointText(new Point(size.width/2, size.height/3));
text.justification = 'center';
text.fillColor = 'white';
text.fontSize = 40;
text.content = 'Number of People in Room: ' + numPeople;

var text = new PointText(new Point(size.width/10, 16*size.height/20));
text.justification = 'center';
text.fillColor = 'white';
text.fontSize = 20;
text.content = '2:00';

var text = new PointText(new Point(3*size.width/10, 16*size.height/20));
text.justification = 'center';
text.fillColor = 'white';
text.fontSize = 20;
text.content = '3:00';

var text = new PointText(new Point(7*size.width/10, 16*size.height/20));
text.justification = 'center';
text.fillColor = 'white';
text.fontSize = 20;
text.content = '5:00';

var text = new PointText(new Point(9*size.width/10, 16*size.height/20));
text.justification = 'center';
text.fillColor = 'white';
text.fontSize = 20;
text.content = '6:00';

var text = new PointText(new Point(size.width/10, 18*size.height/20));
text.justification = 'center';
text.fillColor = 'white';
text.fontSize = 30;
text.content = parseInt(Math.random()*60);

var text = new PointText(new Point(3*size.width/10, 18*size.height/20));
text.justification = 'center';
text.fillColor = 'white';
text.fontSize = 30;
text.content = parseInt(Math.random()*60);

var text = new PointText(new Point(7*size.width/10, 18*size.height/20));
text.justification = 'center';
text.fillColor = 'white';
text.fontSize = 30;
text.content = parseInt(Math.random()*60);

var text = new PointText(new Point(9*size.width/10, 18*size.height/20));
text.justification = 'center';
text.fillColor = 'white';
text.fontSize = 30;
text.content = parseInt(Math.random()*60);


var text = new PointText(new Point(5*size.width/10, 16*size.height/20));
text.justification = 'center';
text.fillColor = 'white';
text.fontSize = 15;
text.content = 'Less Crowded At:';

var text = new PointText(new Point(5*size.width/10, 18*size.height/20));
text.justification = 'center';
text.fillColor = 'green';
text.fontSize = 30;
text.content = parseInt(Math.random()*12) + ':00';
