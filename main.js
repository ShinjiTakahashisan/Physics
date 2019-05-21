window.onload = init;

var canvas = null;
var context = null;

var centreX = 0;
var centreY = 0;

var objects = {};
var nextID = 0;
var nextRopeID = 0;
var looseSprites = [];
var guiSprites = [];
var systems = [];
var interactables = [];
var interfaces = [];
var nodes = [];
var ropes = {};

var universe = null;

var firstTime = -1;
var lastTime = -1;

var METRE = 150;

var camera = null;

var scale = .6;
var minScale = .1;
var maxScale = 4;

var ACCURACY = 100;

var _G = 6.67408 * Math.pow(10,-11);
var _g = 9.81;

var DELTA_T = .010;
var DEFAULT_DELTA_T = .01;

var SIMULATION_STATE = true;

var SELECT_MODE = 0;
var RECTANGLE_MODE = 1;

var cursorMode = SELECT_MODE;

var toolbar = [];

var selectorSprite = null;

var currentSelection = null;
var currentSystem = null;

var GRAVITY_EARTH = 1;
var GRAVITY_GENERAL = 0;
var gravityMode = 1;

var nodeSprite = null;

function init() {
  //alert(getIntersection(2,0,-2,2));
  canvas = document.getElementById("theCANVAS");
  canvas.style.position = "absolute";
  canvas.style.left = "0px";
  canvas.style.top = "0px";
  canvas.style.padding = "0px";
  canvas.width = "" + window.innerWidth + "";
  canvas.height = "" + window.innerHeight + "";
  canvas.style.backgroundColor = "black";
  
  context = canvas.getContext("2d");
  
  centreX = window.innerWidth / 2;
  centreY = window.innerHeight / 2;
  
  camera = new AbstractObject(0,0,1);
  
  universe = new System([], "Universe");
  currentSystem = universe;
  
  /*var o1 = new Object(METRE*1,METRE*0, 5000000, new Sprite([generateEllipse(15,15,40,0,0,"rgba(255,0,0,1)","rgba(0,0,0,0)")]));
  o1.velocity = new Vector(10.77*METRE, 0);
  //o1.velocity.addVector(new Vector(3 * METRE, 0));
  //o1.forces['E']['GRAVITY'] = new Vector(10 * o1.mass * METRE, 270);
  
  var o3 = new Object(METRE*1,METRE*-4, 500000, new Sprite([generateEllipse(15,15,40,0,0,"rgba(0,255,0,1)","rgba(0,0,0,0)")]));
  o3.velocity = new Vector(5.77*METRE, 270);
  
  var o4 = new Object(METRE*0,METRE*-2, 500000000000, new Sprite([generateEllipse(25,25,40,0,0,"rgba(0,0,255,1)","rgba(0,0,0,0)")]));
  o4.velocity = new Vector(4.77*METRE, 0);
  
  var o2 = new Object(0,-METRE*0, 500000000000, new Sprite([generateEllipse(25,25,40,0,0,"rgba(255,255,255,1)","rgba(0,0,0,0)")]));
  o2.velocity = new Vector(0 * METRE, 90);*/

  //var sys2 = new System([o1,o3]);
  
  var o4 = new Object(METRE*0,METRE*4, 10, new Sprite([new Renderable([[-20*METRE,2*METRE],[-20*METRE,-2*METRE],[20*METRE,-2*METRE],[20*METRE,2*METRE]], "rgba(240,240,240,.7)", "rgba(0,0,0,0)")]), new RectangleCollisionMask(40 * METRE, 4 * METRE, 0, 0), "rectangle");
  o4.dynamic = false;
  
  var o4 = new Object(METRE*1,METRE*-2, 20, new Sprite([new Renderable([[-40,40],[-40,-40],[40,-40],[40,40]], "rgba(240,240,240,.7)", "rgba(0,0,0,0)")]), new RectangleCollisionMask(80,80,0,0), "rectangle");
  //o4.angularVelocity = new Vector(2*Math.PI, 0);
  o4.pivotX = 0;
  o4.pivotY = 0;
  //o4.velocity = new Vector(7*METRE,0);
  //o4.forces['E']['EXTRA'] = [new Vector(2000, 270), 0,0];
  //o4.forces['E']['EXTRA2'] = [new Vector(2000, 90), 30,0];
  
  var o5 = new Object(METRE*1,METRE*0, 80, new Sprite([new Renderable([[-40,40],[-40,-40],[40,-40],[40,40]], "rgba(240,240,240,.7)", "rgba(0,0,0,0)")]), new RectangleCollisionMask(80,80,0,0), "rectangle");
  o5.velocity = new Vector(5*METRE, 0);
  
  /*var o = new Object(METRE*1,METRE*2, 20, new Sprite([new Renderable([[-40,40],[-40,-40],[40,-40],[40,40]], "rgba(240,240,240,.7)", "rgba(0,0,0,0)")]), new RectangleCollisionMask(80,80,0,0), "rectangle");
  o5.velocity = new Vector(15*METRE, 0);*/
  
  var n = new Node(1*METRE,-4*METRE);
  var n2 = new ObjectNode(o4,-40,-40);
  
  var n3 = new ObjectNode(o5, 0, 0);
  //var string2 = new Rope(n3,n4);
  var string2 = new Rope(n2,n3);
  var string = new Rope(n,n2);
  
  
  selectorSprite = new Interface(0,0,1,1,0,0,new Sprite([new Renderable([[-2,14],[2,14],[2,-14],[-2,-14]], "rgba(240,240,240,.7)", "rgba(0,0,0,0)"),new Renderable([[-14,-2],[14,-2],[14,2],[-14,2]], "rgba(240,240,240,.7)", "rgba(0,0,0,0)")]));
  //Interface(x, y, anchorX, anchorY, width, height, sprite)
  
  var centreX = centreX * 8;
  var centreY = centreY * 8;
  var xAxis = new GUISprite([new Renderable([[-centreX,-3],[-centreX, 3],[centreX, 3],[centreX, -3]], "rgba(255,255,255,.6)", "rgba(0,0,0,0)")], 0, 0);
  var yAxis = new GUISprite([new Renderable([[-3,-centreY],[-3, centreY],[3, centreY],[3, -centreY]], "rgba(255,255,255,.6)", "rgba(0,0,0,0)")], 0, 0);
  
  for (d = 1; d < (centreX / METRE); d++) {
    var yAxis = new GUISprite([new Renderable([[-1 + METRE * d,-centreY],[-1 + METRE * d, centreY],[1 + METRE * d, centreY],[1 + METRE * d, -centreY]], "rgba(255,255,255,.6)", "rgba(0,0,0,0)")], 0, 0);
    var yAxis = new GUISprite([new Renderable([[-1 - METRE * d,-centreY],[-1 - METRE * d, centreY],[1 - METRE * d, centreY],[1 - METRE * d, -centreY]], "rgba(255,255,255,.6)", "rgba(0,0,0,0)")], 0, 0);
  }
  for (d = 1; d < (centreY / METRE); d++) {
    var xAxis = new GUISprite([new Renderable([[-centreX,-1 + METRE * d],[-centreX, 1 + METRE * d],[centreX, 1 + METRE * d],[centreX, -1 + METRE * d]], "rgba(255,255,255,.6)", "rgba(0,0,0,0)")], 0, 0);
    var xAxis = new GUISprite([new Renderable([[-centreX,-1 - METRE * d],[-centreX, 1 - METRE * d],[centreX, 1 - METRE * d],[centreX, -1 - METRE * d]], "rgba(255,255,255,.6)", "rgba(0,0,0,0)")], 0, 0);
  }
  
  nodeSprite = new Sprite([generateEllipse(10,10,20,0,0,"rgba(0,255,0,1)","rgba(0,0,0,0)")]);
  
  var pause = new Interactable(-50, 55, 2, 0, [new Sprite([new Renderable([[-35,-35],[-35,35],[35,35],[35,-35]], "rgba(120,120,120,.5)", "rgba(0,0,0,0)"), new Renderable([[-17,-20],[-17,20],[-7,20],[-7,-20]], "rgba(255,255,255,1)", "rgba(0,0,0,0)"), new Renderable([[17,-20],[17,20],[7,20],[7,-20]], "rgba(255,255,255,1)", "rgba(0,0,0,0)")]),
    new Sprite([new Renderable([[-35,-35],[-35,35],[35,35],[35,-35]], "rgba(120,120,120,.5)", "rgba(0,0,0,0)"), new Renderable([[17,0],[-17,16],[-17,-16]], "rgba(255,255,255,1)", "rgba(0,0,0,0)")])], new Mask(50,50,0,0), function() {
      if (this.state === 0) {
        this.state = 1;
        this.sprite = this.sprites[1];
        DELTA_T = 0;
        SIMULATION_STATE = false;
      } else {
        this.state = 0;
        this.sprite = this.sprites[0];
        DELTA_T = DEFAULT_DELTA_T;
        SIMULATION_STATE = true;
      }
    }, function() {
      this.sprite.scale = 1.25;
    }, function() {
      this.sprite.scale = 1;
    });
    
  var display = generateTextBox(25,25,0,0,400,250);
  display.specialRender = function() {
    context.font = "bold 24px Ubuntu Mono";
    context.fillStyle = "white";
    context.fillText("SYSTEM: ", display.x + display.width / 2 - context.measureText("SYSTEM: " + currentSystem.name).width / 2, display.y + 40);
    context.font = "24px Ubuntu Mono";
    context.fillText(currentSystem.name, display.x + display.width / 2 - context.measureText("SYSTEM: " + currentSystem.name).width / 2 + context.measureText("SYSTEM: ").width, display.y + 40);
    
    context.font = "bold 16px Ubuntu Mono";
    context.fillText("Centre of Mass: ", display.x + 25, display.y + 35 + 115);
    context.font = "16px Ubuntu Mono";
    context.fillText("(" + (currentSystem.getCMX() / METRE).toFixed(2) + " m, " + (-currentSystem.getCMY() / METRE).toFixed(2) + " m)", display.x + 25 + context.measureText("Centre of Mass: ").width, display.y + 35 + 115);
    
    context.font = "bold 16px Ubuntu Mono";
    context.fillText("# of Objects: ", display.x + 25, display.y + 35 + 40);
    context.font = "16px Ubuntu Mono";
    context.fillText(currentSystem.objects.length, display.x + 25 + context.measureText("# of Objects: ").width, display.y + 35 + 40);
    
    context.font = "bold 16px Ubuntu Mono";
    context.fillText("Total Mass: ", display.x + 25, display.y + 35 + 65);
    context.font = "16px Ubuntu Mono";
    context.fillText(currentSystem.getTotalMass() + " kg", display.x + 25 + context.measureText("Total Mass: ").width, display.y + 35 + 65);
    
    context.font = "bold 16px Ubuntu Mono";
    context.fillText("Total Energy: ", display.x + 25, display.y + 35 + 90);
    context.font = "16px Ubuntu Mono";
    context.fillText(currentSystem.getTotalEnergy().toFixed(2) + " J", display.x + 25 + context.measureText("Total Energy: ").width, display.y + 35 + 90);
    
    context.font = "bold 16px Ubuntu Mono";
    context.fillText("CM Velocity: ", display.x + 25, display.y + 35 + 140);
    context.font = "16px Ubuntu Mono";
    context.fillText("<" + (currentSystem.getCMVelocity().getXComponent()/METRE).toFixed(2) + ", " + (currentSystem.getCMVelocity().getYComponent()/METRE).toFixed(2) + "> m/s", display.x + 25 + context.measureText("CM Velocity: ").width, display.y + 35 + 140);
  }
  
  var display2 = generateTextBox(25,25,0,1,100,250);
  toolbar[SELECT_MODE] = new Interactable(52, 55, 0, 1, [new Sprite([new Renderable([[-18,-18],[-18,18],[18,18],[18,-18]], "rgba(170,170,170,.5)", "rgba(0,0,0,0)"), new Renderable([[-8,-8],[-6,-9],[1,0],[0,1]], "rgba(255,255,255,1)", "rgba(0,0,0,0)"),new Renderable([[-5,0],[2,-6],[7,10]], "rgba(255,255,255,1)", "rgba(0,0,0,0)")])], new Mask(50,50,0,0), function() {
      cursorMode = SELECT_MODE;
      for (w = 0; w < toolbar.length; w++) {
        toolbar[w].sprite.renderables[0].colour = "rgba(120,120,120,.5)";
      }
      toolbar[SELECT_MODE].sprite.renderables[0].colour = "rgba(170,170,170,.5)";
    }, function() {
      this.sprite.scale = 1.25;
    }, function() {
      this.sprite.scale = 1;
    });
    
  toolbar[RECTANGLE_MODE] = new Interactable(52 + 45, 55, 0, 1, [new Sprite([new Renderable([[-18,-18],[-18,18],[18,18],[18,-18]], "rgba(120,120,120,.5)", "rgba(0,0,0,0)"), new Renderable([[-1,10],[1,10],[1,-10],[-1,-10]], "rgba(255,255,255,1)", "rgba(0,0,0,0)"),new Renderable([[-10,-1],[10,-1],[10,1],[-10,1]], "rgba(255,255,255,1)", "rgba(0,0,0,0)")])], new Mask(50,50,0,0), function() {
      cursorMode = RECTANGLE_MODE;
      for (w = 0; w < toolbar.length; w++) {
        toolbar[w].sprite.renderables[0].colour = "rgba(120,120,120,.5)";
      }
      toolbar[RECTANGLE_MODE].sprite.renderables[0].colour = "rgba(170,170,170,.5)";
    }, function() {
      this.sprite.scale = 1.25;
    }, function() {
      this.sprite.scale = 1;
    });
  
  //console.log(sys2.getCMX() / METRE + " / " + sys2.getCMY() / METRE);

  setInterval(update, 10);
}

function update() {
  ACCURACY = gravityMode===GRAVITY_GENERAL ? 400 : 100;
  centreX = window.innerWidth / 2;
  centreY = window.innerHeight / 2;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  var d = new Date();
  if (firstTime === -1) {
    firstTime = d.getTime() / 1000;
    lastTime = firstTime;
  }
  var currentTime = d.getTime() / 1000;
  var deltaTime = DELTA_T;
  lastTime = currentTime;
  
  if (cursorMode === RECTANGLE_MODE) {
    selectorSprite.x = (mouseX);
    selectorSprite.y = (mouseY);
  }
  
  physics(deltaTime);

  render();
  
  
}

var flag = false;

function physics(deltaTime) {
  if (deltaTime > 0) {
    deltaTime /= ACCURACY;
    for (w = 0; w < ACCURACY; w++) {
      for (var r in ropes) {
        var node1 = ropes[r].node1;
        var node2 = ropes[r].node2;
        var obj = null;
        
        if (node1.object !== null) {
          var obj = node1.object;
          if (!obj.forces['R' + r])
            obj.forces['R' + r] = {};
          obj.forces['R' + r]['TENSION'] = [new Vector(ropes[r].tension.magnitude, (ropes[r].tension.angle + 180)%360),node1.xOffset,-node1.yOffset];
        }
        
        if (node2.object !== null) {
          obj = node2.object;
          node2.x = obj.x+node2.xOffset;
          node2.y = obj.y-node2.yOffset;
          obj.pivotX = node2.xOffset;
          obj.pivotY = node2.yOffset;
          
          if (!obj.forces['R' + r])
            obj.forces['R' + r] = {};
          
          if ((distance(node1.x,node1.y,node2.x,node2.y) - ropes[r].ropeLength) >= 25) {
            var theta = 90-atanNormalised((node2.y-node1.y)/(node2.x-node1.x),node2.x-node1.x,node2.y-node1.y);
            if (ropes[r].tension.magnitude === 0) {
              var angle = 0;
              if (obj.velocity.magnitude*Math.sin(toRadians(theta+270-obj.velocity.angle)) < 0) {
                angle = 360+theta;
              } else {
                angle= 180+theta;
              }
              obj.velocity = new Vector(Math.abs(obj.velocity.magnitude*Math.sin(toRadians(theta+270-obj.velocity.angle))), angle);
            }
            
            var magnitude = 0;
            for (var k in obj.forces) {
              for (var f in obj.forces[k]) {
                if (k !== "R" + r)
                  magnitude += obj.forces[k][f][0].magnitude * Math.cos(toRadians(270-obj.forces[k][f][0].angle + theta))/METRE;
              }
            }
            var tension = new Vector((obj.mass *Math.pow(obj.velocity.magnitude/METRE,2) / (ropes[r].ropeLength/ METRE) + Math.abs(magnitude))*METRE,90+theta===-90 ? 90 : (90+theta));
            ropes[r].tension = tension;
            obj.forces['R' + r]['TENSION'] = [tension,node2.xOffset,-node2.yOffset];
          } else {
            ropes[r].tension = new Vector(0,0);
            obj.forces['R' + r]['TENSION'] = [new Vector(0,0),0,0];
          }
        }
        
      }
      
      for (var o in objects) {
        var obj = objects[o];
        obj.PE = 0;
        obj.KE = 0;
        
        if (obj.type === "default") {
          if (gravityMode === GRAVITY_GENERAL) {
            if (obj.mass > 0) {
              for (var p in objects) {
                var obj2 = objects[p];
                if (obj2.type === "default") {
                  if (obj !== obj2) {
                    if (!obj2.forces['' + obj.id]) {
                      obj2.forces['' + obj.id] = {};
                    }
                    var dX = (obj.x - obj2.x);
                    var dY = -(obj.y - obj2.y);
                    
                    //in pixels
                    obj2.forces['' + obj.id]['GRAVITY'] = [new Vector((_G*obj.mass * obj2.mass/Math.pow(distance(obj.x, obj.y, obj2.x, obj2.y) / METRE, 2)) * METRE, atanNormalised(dY / dX, dX, dY)), 0, 0];
                  }
                }
              }
            }
          } else if (gravityMode === GRAVITY_EARTH) {
            if (!obj.forces['E'])
              obj.forces['E'] = {};
            obj.forces['E']['GRAVITY'] = [new Vector(_g * obj.mass * METRE, 270),0,0];
          }
        }
        
        obj.acceleration = new Vector(0,0);
        obj.angularAcceleration = new Vector(0,0);
        var netForce = new Vector(0,0);
        var netTorque = new Vector(0,0);
        for (var k in obj.forces) {
          for (var f in obj.forces[k]) {
            netForce.addVector(obj.forces[k][f][0]);
            var force = obj.forces[k][f];
            var nForce = rotateAbout(force[1],force[2],obj.pivotX,-obj.pivotY,-toDegrees(obj.angle));
            
            var dp = new Vector(distance(nForce[0],nForce[1],obj.pivotX,-obj.pivotY), atanNormalised((nForce[1]-obj.pivotY) / (nForce[0]-obj.pivotX), nForce[0]-obj.pivotX, nForce[1]-obj.pivotY));
            if (dp.magnitude > 0) {
              var angle = force[0].angle - dp.angle;
              var torqueM = (dp.magnitude / METRE)*(force[0].magnitude/METRE)*Math.sin(toRadians(angle));
              var torque = null;
              
              if (torqueM > 0) {
                torque = new Vector(Math.abs(torqueM), 0);
              } else {
                torque = new Vector(Math.abs(torqueM), 180);
              }
              netTorque.addVector(torque);
            }
          }
          
        }
        

        if (netTorque.magnitude !== 0) {
          obj.angularAcceleration = new Vector(netTorque.magnitude / obj.MOI, netTorque.angle);
        }
        
        if (obj.dynamic) {
          if (netForce.magnitude > 0) {
            obj.acceleration = new Vector(netForce.magnitude / obj.mass, netForce.angle);
            obj.acceleration.updateSprite(30);
          }
          
          if (obj.acceleration.magnitude > 0) {
            obj.velocity.addVector(obj.acceleration.copyVector().magScale(deltaTime));
            obj.velocity.updateSprite(10);
          }
          
          if (obj.angularAcceleration.magnitude > 0) {
            obj.angularVelocity.addVector(obj.angularAcceleration.copyVector().magScale(deltaTime));
          }
        }
        
      }
      
      for (var o in objects) {
        var obj = objects[o];
        obj.KE=0;
        if (obj.velocity.magnitude > 0) {
          obj.x += obj.velocity.getXComponent() * deltaTime;
          obj.y -= obj.velocity.getYComponent() * deltaTime;
          
          //Check collisions
          for (var d in objects) {
            var obj2 = objects[d];
            for (l = 0; l < obj.mask.points.length; l++) {
              if (inOrOut(obj.mask.points[l], obj2.mask)) {
                
              }
            }
          }
          
          obj.KE += .5 * obj.mass * Math.pow(obj.velocity.magnitude / METRE, 2);
          
          if (obj.frictionForce.magnitude > 0) {
            obj.frictionForce.angle = addCircular(obj.velocity.angle, 180, 360);
            obj.forces['E']['FRICTION'] = [obj.frictionForce,0,0];
          }
        } else {
          delete obj.forces['E']['FRICTION'];
        }
        
        if (obj.angularVelocity.magnitude > 0) {
          obj.angle += obj.angularVelocity.getXComponent() * deltaTime;
          obj.KE += .5 * obj.MOI * Math.pow(obj.angularVelocity.magnitude, 2);
        }
        
        obj.PE = 0;
        if (obj.type === "default" && gravityMode === GRAVITY_GENERAL) {
          if (obj.mass > 0) {
            for (var p in objects) {
              var obj2 = objects[p];
              if (obj2.type === "default") {
                if (obj !== obj2) {
                  if (!obj.PETypes['' + obj2.id]) {
                    obj.PETypes['' + obj2.id] = {};
                  }
                  var energy = _G*obj.mass * obj2.mass / (distance(obj.x, obj.y, obj2.x, obj2.y) / METRE);
                  obj.PE -= energy;
                  obj.PETypes['' + obj2.id]['GRAVITY'] = -energy;
                }
              }
            }
          }
        }
        obj.TE = obj.KE + obj.PE;
        
        for (var k in obj.forces) {
          for (var f in obj.forces[k]) {
            if (obj.forces[k][f][0].magnitude / (obj.mass*10) > .1) {
              obj.forces[k][f][0].updateSprite((obj.mass) * 10);
              obj.forces[k][f][0].vectorSprite.colour = "rgba(240,50,50,1)";
            } else {
              obj.forces[k][f][0].updateSprite(obj.forces[k][f].magnitude / 15);
              obj.forces[k][f][0].vectorSprite.colour = "rgba(180,0,0,.3)";
            }
          }
        }
      }
    }
  }
}

function getIntersection(m1, b1, m2, b2) {
  return [(b2-b1)/(m1-m2), ((b2-b1)/(m1-m2))*m1 + b1];
}

function collisionCheck(obj,obj2) {
  if (obj2.type === "default") {
    var check = false;
    for (l = 0; l < obj.mask.points.length; l++) {
      var intersectionCount = 0;
      var point = obj.mask.points[l];
      var mask = obj2.mask;
      for(var ii = 0; ii<mask.points.length;ii++){
    		var right = [0,point[1]+obj.y];
        var nextii = (ii+1)%mask.points.length;
      	var line = getLine([mask.points[ii][0]+obj2.x, mask.points[ii][1]+obj2.y], [mask.points[nextii][0]+obj2.x,mask.points[nextii][1]+obj2.y]);
        var interse = [];
        if(line[0]==0)
        	continue;
        if(line[0] == Number.NEGATIVE_INFINITY ||line[0] == Number.POSITIVE_INFINITY){
          interse = [mask.points[ii][0]+obj2.x,point[1]+obj.y];
        } else {
        	interse = getIntersection(right[0],right[1],line[0],line[1]);
        }
        var maskp1 = mask.points[ii][1]+obj2.y >= interse[1];
        var maskp2 = mask.points[nextii][1]+obj2.y >= interse[1];
    
        if(interse[0]>=point[0]+obj.x&&(maskp1 ^ maskp2)){
          intersectionCount++;
        }
      }
      if (intersectionCount & 2 !== 0) {
        return true;
      }
    }
  }
  return false;
}

function inOrOut(point,mask){
 var intersectionCount = 0;
  for(var ii = 0; ii<mask.points.length;ii++){  
		var right = [0,point[1]];
    var nextii = (ii+1)%mask.points.length;
  	var line = getLine(mask.points[ii], mask.points[nextii]);
    var interse = [];
    if(line[0]==0)
    	continue;
    console.log(line[0]);
    if(line[0] == Number.NEGATIVE_INFINITY ||line[0] == Number.POSITIVE_INFINITY){
      interse = [mask.points[ii][0],point[1]];
    } else {
    	interse = getIntersection(right[0],right[1],line[0],line[1]);
    }
    var maskp1 = mask.points[ii][1] >= interse[1];
    var maskp2 = mask.points[nextii][1] >= interse[1];

    if(interse[0]>=point[0]&&(maskp1 ^ maskp2)){
      intersectionCount++;
    }
  }
  return !(intersectionCount % 2 == 0);
}
       
function getLine(p1, p2) {
  var m2 = (p2[1] - p1[1]) / (p2[0] - p1[0]);
  var b2 = p1[1] - m2*(p1[0]);
  return [m2,b2];
}

function shortestAngularDistance(a1, a2) {
  var d1 = Math.abs(a2-a1);
  var d2 = 360-d1;
  if (d1 > d2)
    return d2;
  return d1;
}

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (o = 0; o < guiSprites.length; o++) {
    drawSprite(guiSprites[o], guiSprites[o].anchorX, guiSprites[o].anchorY);
  }
  
  for (o = 0; o < looseSprites.length; o++) {
    drawSprite(looseSprites[o], looseSprites[o].anchorX, looseSprites[o].anchorY);
  }
  
  for (var o in objects) {
    if (objects[o].sprite !== null) {
      drawObject(objects[o], objects[o].x, objects[o].y);
    }
  }
  
  for (o = 0; o < nodes.length; o++) {
    drawSprite(nodeSprite, nodes[o].x, nodes[o].y);
  }
  
  for (var o in ropes) {
    drawLine(new LinearSprite([0,0],[ropes[o].node2.x-ropes[o].node1.x,-ropes[o].node2.y+ropes[o].node1.y],4,"white"), ropes[o].node1.x, ropes[o].node1.y, "rgba(255,255,255,1)");
  
    
  }
  
  for (var o in objects) {
    if (objects[o].showVectors) {
      var coord = rotateAbout(0, 0, objects[o].pivotX, -objects[o].pivotY, -toDegrees(objects[o].angle));
      drawRay(objects[o].velocity.vectorSprite, coord[0]+objects[o].x, coord[1]+objects[o].y, "rgba(240,240,240,1)");
      drawRay(objects[o].acceleration.vectorSprite, coord[0]+objects[o].x, coord[1]+objects[o].y, "rgba(160,160,160,1)");
    } else if (objects[o].freebodyDiagram) {
      for (var c in objects[o].forces) {
        for (var f in objects[o].forces[c]) {
          var coord = rotateAbout(objects[o].forces[c][f][1], objects[o].forces[c][f][2], objects[o].pivotX, -objects[o].pivotY, -toDegrees(objects[o].angle));
          drawRay(objects[o].forces[c][f][0].vectorSprite, objects[o].x + coord[0], objects[o].y + coord[1], objects[o].forces[c][f][0].vectorSprite.colour);
        }
      }
    }
  }
  
  for (o = 0; o < interfaces.length; o++) {
    if ((interfaces[o] === selectorSprite && cursorMode === RECTANGLE_MODE) || interfaces[o] !== selectorSprite) {
      if (interfaces[o].sprite !== null)
        drawFixedSprite(interfaces[o].sprite, anchorX(interfaces[o].x, interfaces[o].anchorX), anchorY(interfaces[o].y, interfaces[o].anchorY));
    
      if (interfaces[o].specialRender !== null)
        interfaces[o].specialRender();
    }
  }
  
  for (o = 0; o < interactables.length; o++) {
    if (interactables[o].sprite !== null)
      drawFixedSprite(interactables[o].sprite, anchorX(interactables[o].x, interactables[o].anchorX), anchorY(interactables[o].y, interactables[o].anchorY));
  }
  
  if (currentSelection !== null)
    drawRect(currentSelection.x, currentSelection.y, currentSelection.width, currentSelection.height, 3, "", "rgba(255,255,255,1)");
}

function Renderable(points, colour, outlineColour) {
  this.points = points;
  this.colour = colour;
  this.outlineColour = outlineColour;
}

function generateEllipse(rX, rY, po, cX, cY, colour, outlineColour) {
  var points = [];
  for (p = 0; p < po; p++) {
    points.push([rX * Math.cos(p * 2 * Math.PI / po), rY * Math.sin(p * 2 * Math.PI / po)]);
  }
  return new Renderable(points, colour, outlineColour);
}

function Sprite(renderables) {
  this.renderables = renderables;
  this.scale = 1;
}

function LooseSprite(renderables, aX, aY) {
  this.renderables = renderables;
  this.anchorX = aX;
  this.anchorY = aY;
  looseSprites.push(this);
}

function GUISprite(renderables, aX, aY) {
  this.renderables = renderables;
  this.anchorX = aX;
  this.scale = 1;
  this.anchorY = aY;
  guiSprites.push(this);
}

function Object(x, y, mass, sprite, mask, moment) {
  this.x = x;
  this.y = y;
  this.type = "default";
  this.mass = mass;
  this.mask = mask;
  this.sprite = sprite;
  this.velocity = new Vector(0,0);
  this.acceleration = new Vector(0,0);
  this.forces = {};
  this.forces['E'] = {};
  this.frictionForce = new Vector(0,0);
  this.netTorque = new Vector(0,0);
  this.pivotX = 0;
  this.pivotY = 0;
  this.angle = 0;
  this.angularVelocity = new Vector(0,0);
  this.angularAcceleration = new Vector(0,0);
  this.momentType = moment;
  this.MOI = 0;
  if (this.momentType === "disk") {
    this.MOI = .5 * this.mass * this.mask.radius + this.mass * Math.pow(distance(0, 0, this.pivotX, this.pivotY) / METRE,2);
  } else if (this.momentType === "hoop" || this.momentType === "point") {
    this.MOI = this.mass * this.mask.radius + this.mass * Math.pow(distance(0, 0, this.pivotX, this.pivotY) / METRE,2);
  } else if (this.momentType === "rectangle") {
    this.MOI = this.mass * (Math.pow(this.mask.width / METRE, 2) + Math.pow(this.mask.height / METRE, 2)) / 12 + this.mass * Math.pow(distance(0, 0, this.pivotX, this.pivotY) / METRE,2);
  }
  
  console.log(this.MOI);
  
  this.id = nextID;
  this.KE = 0;
  this.PE = 0;
  this.PETypes = {};
  this.TE = this.KE + this.PE;
  this.iWidth = 50;
  this.iHeight = 50;
  this.dynamic = true;
  this.getCMX = function() {
    return this.x;
  }
  this.getCMY = function() {
    return this.y;
  }
  this.onenter = function() {
    this.sprite.scale = 1.3;
  }
  this.onleave = function() {
    this.sprite.scale = 1;
  }
  this.over = false;
  
  this.showVectors = false;
  this.freebodyDiagram = false;
  
  nextID++;
  objects['' + this.id] = (this);
  universe.objects.push(this);
}

function AbstractObject(x, y, mass) {
  this.x = x;
  this.y = y;
  this.type = "abstract";
  this.mass = mass;
  this.sprite = null;
  this.velocity = new Vector(0,0);
  this.acceleration = new Vector(0,0);
  this.angle = 0;
  this.angularVelocity = new Vector(0,0);
  this.angularAcceleration = new Vector(0,0);
  this.forces = {};
  this.forces['E'] = {};
  this.torques = [];
  this.kineticFriction = .3;
  this.frictionForce = new Vector(mass * 1500 * this.kineticFriction,0);
  this.id = nextID;
  this.dynamic = true;
  nextID++;
  objects['' + this.id] = (this);
}

function System(objects, name) {
  this.objects = objects;
  this.name = name;
  this.getCMX = function() {
    var CMX = 0;
    for (z = 0; z < this.objects.length; z++) {
      CMX += this.objects[z].mass * this.objects[z].getCMX();
    }
    CMX /= this.getTotalMass();
    return CMX;
  }
  this.getCMY = function() {
    var CMY = 0;
    for (z = 0; z < this.objects.length; z++) {
      CMY += this.objects[z].mass * this.objects[z].getCMY();
    }
    CMY /= this.getTotalMass();
    return CMY;
  }
  this.getCM = function() {
    return [this.getCMX(), this.getCMY()];
  }
  this.getTotalMass = function() {
    var tMass = 0;
    for (m = 0; m < this.objects.length; m++) {
      tMass += this.objects[m].mass;
    }
    return tMass;
  }
  this.getTotalEnergy = function() {
    var TE = 0;
    for (z = 0; z < this.objects.length; z++) {
      TE += this.objects[z].KE;
      for (var p in this.objects[z].PETypes) {
        for (var l in this.objects[z].PETypes[p]) {
          if (this.containsID(parseInt(p))) {
            TE += this.objects[z].PETypes[p][l] / 2;
          } else {
            TE += this.objects[z].PETypes[p][l];
          }
        }
      }
    }
    return TE;
  }
  this.getMomentum = function() {
    var momentum = new Vector(0,0);
    for (z = 0; z < this.objects.length; z++) {
      momentum.addVector(this.objects[z].velocity.copyVector().magScale(this.objects[z].mass));
    }
    
    return momentum;
  }
  
  this.getCMVelocity = function() {
    
    return this.getMomentum().magScale(1/this.getTotalMass());
  }
  
  this.containsID = function(id) {
    for (o = 0; o < this.objects.length; o++) {
      if (this.objects[o].id === id) {
        return true;
      }
    }
    return false;
  }
  systems.push(this);
}

function drawObject(object, x, y) {
  var sprite = object.sprite;
  for (i = 0; i < sprite.renderables.length; i++) {
    var r = sprite.renderables[i];
    context.beginPath();
    context.strokeStyle = r.outlineColour;
    
    var coord = rotateAbout(r.points[0][0], r.points[0][1], object.pivotX, object.pivotY, toDegrees(object.angle));
    context.moveTo(centreX + (-camera.x + x + coord[0]*sprite.scale)*scale, centreY - (-camera.y + coord[1]*sprite.scale - y)*scale);
    for (j = 0; j < r.points.length; j++) {
      var coord = rotateAbout(r.points[j][0], r.points[j][1], object.pivotX, object.pivotY, toDegrees(object.angle));
      context.lineTo(centreX + (-camera.x + x + coord[0]*sprite.scale)*scale, centreY - (-camera.y + coord[1]*sprite.scale - y)*scale);
    }
    context.closePath();
    context.stroke();
    context.fillStyle = r.colour;
    context.fill();
  }
}

function drawSprite(sprite, x, y) {
  for (i = 0; i < sprite.renderables.length; i++) {
    var r = sprite.renderables[i];
    context.beginPath();
    context.strokeStyle = r.outlineColour;
    
    context.moveTo(centreX + (-camera.x + x + r.points[0][0]*sprite.scale)*scale, centreY - (-camera.y + r.points[0][1]*sprite.scale - y)*scale);
    for (j = 0; j < r.points.length; j++) {
      context.lineTo(centreX + (-camera.x + x + r.points[j][0]*sprite.scale)*scale, centreY - (-camera.y + r.points[j][1]*sprite.scale - y)*scale);
    }
    context.closePath();
    context.stroke();
    context.fillStyle = r.colour;
    context.fill();
  }
}

function drawLine(sprite, x, y, colour) {
  context.beginPath();
  context.strokeStyle = colour;
  context.lineWidth = (sprite.lineWidth)*scale;
  context.moveTo(centreX + (-camera.x + x + sprite.p1[0])*scale, centreY - scale *(-camera.y - y + sprite.p1[1]));
  context.lineTo(centreX + (-camera.x + x + sprite.p2[0])*scale, centreY - scale *(-camera.y - y + sprite.p2[1]));
  context.closePath();
  context.stroke();
}

function drawRect(x, y, width, height, lineWidth, type, colour) {
  context.beginPath();
  context.strokeStyle = colour;
  context.lineWidth = lineWidth;
  context.moveTo(centreX + (-camera.x + x)*scale, centreY - scale *(-camera.y - y));
  context.lineTo(centreX + (-camera.x + x + width)*scale, centreY - scale *(-camera.y - y));
  context.lineTo(centreX + (-camera.x + x + width)*scale, centreY - scale *(-camera.y - y+height));
  context.lineTo(centreX + (-camera.x + x)*scale, centreY - scale *(-camera.y - y+height));
  context.closePath();
  context.stroke();
}

function drawRay(sprite, x, y, colour) {
  context.beginPath();
  context.strokeStyle = colour;
  context.lineWidth = (sprite.lineWidth)*scale;
  context.moveTo(centreX + (-camera.x + x + sprite.p1[0])*scale, centreY - scale *(-camera.y - y + sprite.p1[1]));
  context.lineTo(centreX + (-camera.x + x + sprite.p2[0])*scale, centreY - scale *(-camera.y - y + sprite.p2[1]));
  context.closePath();
  context.stroke();
  
  
  var points = [[8,0],[0,-6],[0,6]];
  var convert = rotateAbout(points[0][0], points[0][1], 0, 0, 180-atanNormalised(-(sprite.p2[1] - sprite.p1[1]) / (sprite.p2[0] - sprite.p1[0]), (sprite.p2[0]-sprite.p1[0]), -(sprite.p2[1]-sprite.p1[1])));
  context.moveTo(centreX + (-camera.x + x + sprite.p2[0] + convert[0])*scale, centreY - scale *(-camera.y - y + sprite.p2[1] + convert[1]));
  for (j = 0; j < points.length; j++) {
    var convert = rotateAbout(points[j][0], points[j][1], 0, 0, 180-atanNormalised(-(sprite.p2[1] - sprite.p1[1]) / (sprite.p2[0] - sprite.p1[0]), (sprite.p2[0]-sprite.p1[0]), -(sprite.p2[1]-sprite.p1[1])));
    context.lineTo(centreX + (-camera.x + x + sprite.p2[0] + convert[0])*scale, centreY - scale *(-camera.y - y + sprite.p2[1] + convert[1]));
  }
  context.closePath();
  context.stroke();
  
}

function drawFixedSprite(sprite, x, y) {
  for (i = 0; i < sprite.renderables.length; i++) {
    var r = sprite.renderables[i];
    context.beginPath();
    context.strokeStyle = r.outlineColour;
    
    context.moveTo(centreX + x + (r.points[0][0]) * sprite.scale, centreY - (r.points[0][1]) * sprite.scale+y);
    for (j = 0; j < r.points.length; j++) {
      context.lineTo(centreX + x + (r.points[j][0]) * sprite.scale, centreY - (r.points[j][1]) * sprite.scale+y);
    }
    context.closePath();
    context.stroke();
    context.fillStyle = r.colour;
    context.fill();
  }
}

function toRadians(degrees) {
  return degrees * Math.PI /180;
}

function toDegrees(radians) {
  return radians * 180 / Math.PI;
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}

function removeFromList(list, obj) {
  if (list.includes(obj)) {
    for (y = 0; y < list.length; y++) {
      if (list[y] === obj) {
        list.splice(y,1);
      }
    }
  }
}

function addCircular(init, add, max) {
  if (add + init >= 0) {
    return (init + add) % max;
  } else {
    var dist = init + add;
    return (max - 1) - dist;
  }
}

function Vector(magnitude, angle) {
  this.magnitude = magnitude;
  this.angle = angle;
  
  this.getXComponent = function() {
    return this.magnitude * Math.cos(toRadians(this.angle));
  }
  this.getYComponent = function() {
    return this.magnitude * Math.sin(toRadians(this.angle));
  }
  this.addVector = function(v) {
    var vec = addVector(this, v);
    this.magnitude = vec.magnitude;
    this.angle = vec.angle;
    return this;
  }
  this.copyVector = function() {
    return new Vector(this.magnitude, this.angle);
  }
  this.magScale = function(s) {
    this.magnitude *= s;
    return this;
  }
  this.magAdd = function(a) {
    this.magnitude += a;
    return this;
  }
  this.updateSprite = function(mod) {
    this.vectorSprite.p2[0] = this.getXComponent() / mod;
    this.vectorSprite.p2[1] = this.getYComponent() / mod;
  }
  
  
  
  //Clockwise
  this.rotate = function(a) {
    this.angle = addCircular(this.angle, a, 360);
    return this;
  }
  
  this.vectorSprite = new LinearSprite([0,0],[this.getXComponent()/10,this.getYComponent()/10],6,"white");
}

function LinearSprite(p1, p2, lineWidth, colour) {
  this.p1 = p1;
  this.p2 = p2;
  this.lineWidth = lineWidth;
  this.colour = colour;
}

function addVector(v1, v2) {
  var x1 = v1.getXComponent();
  var y1 = v1.getYComponent();
  var x2 = v2.getXComponent();
  var y2 = v2.getYComponent();
  
  var x3 = x1 + x2;
  var y3 = y1 + y2;

  var magnitude = Math.sqrt(Math.pow(x3,2) + Math.pow(y3,2));
  
  if (magnitude === 0) {
    return new Vector(0,0);
  } else {
    var angle = atanNormalised(y3 / x3, x3, y3);
    return new Vector(magnitude, angle);
  }
}

function atanNormalised(slope, dX, dY) {
  var angle = toDegrees(Math.atan(slope));
  var effectiveAngle = angle;
  if (dX < 0 && dY < 0) {
    effectiveAngle += 180;
  } else if (dX < 0 && dY > 0) {
    effectiveAngle += 180;
  } else if (dX > 0 && dY < 0) {
    effectiveAngle = 360 + effectiveAngle;
  }
  
  if (dX === 0 && dY < 0) {
    effectiveAngle = 90;
  } else if (dX === 0 && dY > 0) {
    effectiveAngle = 270;
  } else if (dX > 0 && dY === 0) {
    effectiveAngle = 0;
  } else if (dX < 0 && dY === 0) {
    effectiveAngle = 180;
  }
  return effectiveAngle;
}


function Interactable(x, y, anchorX, anchorY, sprites, mask, action, enter, leave) {
  this.x = x;
  this.y = y;
  this.sprites = sprites;
  this.mask = mask;
  this.action = action;
  this.onenter = enter;
  this.onleave = leave;
  this.over = false;
  this.state = 0;
  this.sprite = this.sprites[0];
  
  this.anchorX = anchorX;
  this.anchorY = anchorY;
  interactables.push(this);
}

function Interface(x, y, anchorX, anchorY, width, height, sprite) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.anchorX = anchorX;
  this.anchorY = anchorY;
  this.sprite = sprite;
  this.specialRender = null;
  interfaces.push(this);
}

function generateTextBox(x, y, anchorX, anchorY, width, height) {
  var int = new Interface(x, y, anchorX, anchorY, width, height, new Sprite([new Renderable([[0,0],[width,0],[width,-height],[0,-height]],"rgba(120,120,120,.5)","rgba(0,0,0,0)")]));
  return int;
}

function Selection(x, y) {
  this.x = x;
  this.y = y;
  this.width = 0;
  this.height = 0;
}

function Mask(width, height, xOffset, yOffset) {
  this.width = width;
  this.height = height;
  this.xOffset = xOffset;
  this.yOffset = yOffset;
}

function CollisionMask(points, xOffset, yOffset) {
  this.points = points;
  this.xOffset = xOffset;
  this.yOffset = yOffset;
}

function CirculeCollisionMask(radius, xOffset, yOffset) {
  this.radius = radius;
  this.xOffset = xOffset;
  this.yOffset = yOffset;
}

function RectangleCollisionMask(width, height, xOffset, yOffset) {
  this.points = [[-width / 2, -height / 2],[width/2, -height/2],[width/2,height/2],[-width/2, height/2]];
  this.xOffset = xOffset;
  this.yOffset= yOffset;
  this.width = width;
  this.height = height;
}

function Node(x, y, xOffset, yOffset) {
  this.x = x;
  this.y = y;
  this.xOffset = 0;
  this.yOffset = 0;
  this.object = null;
  this.connections = [];
  nodes.push(this);
}

function ObjectNode(object, xOffset, yOffset) {
  this.x = object.x+xOffset;
  this.y = object.y-yOffset;
  this.xOffset = xOffset;
  this.yOffset = yOffset;
  this.object = object;
  this.connections = [];
  nodes.push(this);
}

function Rope(node1, node2) {
  this.node1 = node1;
  node1.connections.push(this);
  this.node2 = node2;
  node2.connections.push(this);
  
  
  this.ropeLength = distance(node1.x+node1.xOffset,node1.y+node1.yOffset,node2.x+node2.xOffset,node2.y+node2.yOffset);
  this.tension = new Vector(-1,0);
  
  this.id = nextRopeID;
  nextRopeID++;
  ropes['' + this.id] = (this);
}

window.addEventListener('wheel', function(e) {
  scale -= e.deltaY / 1000;
  if (scale < minScale)
    scale = minScale;
  if (scale > maxScale)
    scale = maxScale;
}
);

var drag = false;
var pCamX = 0;
var pCamY = 0;
var prevMouseX = 0;
var prevMouseY = 0;
var startDrag =0;

var prevTime = -1;
var prevDTime = 0;
var prevDX = 0;
var prevDY = 0;

var mouseX = 0;
var mouseY = 0;

var pointer = false;
window.onmousemove = function(e) {
  pointer = false;
  if (drag) {
    camera.x = pCamX - (e.clientX - prevMouseX)/scale;
    camera.y = pCamY + (e.clientY - prevMouseY)/scale;
    var currentTime = (new Date()).getTime() / 1000;
    if (prevTime === -1)
      prevTime = (currentTime);
    var deltaTime = currentTime - prevTime;
    prevDTime = deltaTime;
    prevDX = -(e.clientX - prevMouseX);
    prevDY = -(e.clientY - prevMouseY);
  }
  
  for (i = 0; i < interactables.length; i++) {
    var mX = e.clientX - centreX;
    var mY = e.clientY - centreY;
    if (mX > -interactables[i].mask.width/2 + anchorX(interactables[i].x, interactables[i].anchorX) +interactables[i].mask.xOffset &&
    mX < interactables[i].mask.width/2 + anchorX(interactables[i].x, interactables[i].anchorX) +interactables[i].mask.xOffset &&
    mY > -interactables[i].mask.height/2 + anchorY(interactables[i].y, interactables[i].anchorY) +interactables[i].mask.yOffset &&
    mY < interactables[i].mask.height/2 + anchorY(interactables[i].y, interactables[i].anchorY) +interactables[i].mask.yOffset) {
      pointer = true;
      if (!interactables[i].over) {
        interactables[i].onenter();
        interactables[i].over = true;
      }
    } else {
      if (interactables[i].over) {
        interactables[i].onleave();
        interactables[i].over = false;
      }
    }
  }
  
  if (!SIMULATION_STATE) {
    for (var k in objects) {
      if (mX > (-objects[k].iWidth/2 + objects[k].x - camera.x)*scale &&
      mX < (objects[k].iWidth/2 + objects[k].x - camera.x)*scale &&
      mY > (-objects[k].iHeight/2 + objects[k].y + camera.y)*scale &&
      mY < (objects[k].iHeight/2 + objects[k].y + camera.y)*scale) {
        pointer = true;
        if (!objects[k].over) {
          objects[k].over = true;
          objects[k].onenter();
        }
      } else {
        if (objects[k].over) {
          objects[k].over = false;
          objects[k].onleave();
        }
      }
    }
  }
  
  mouseX = mX;
  mouseY = mY;
  
  if (currentSelection !== null) {
    currentSelection.width = ((mX + camera.x*scale)/scale - currentSelection.x);
    currentSelection.height = -((mY - camera.y*scale)/scale - currentSelection.y);
  }
  
  if (pointer) {
    canvas.style.cursor = "pointer";
  } else {
    if (cursorMode === RECTANGLE_MODE) {
      canvas.style.cursor = "none";
    } else {
      canvas.style.cursor = "default";
    }
  }
}

function anchorX(x, anchorX) {
  if (anchorX === 0) {
    return -window.innerWidth / 2 + x;
  } else if (anchorX === 1) {
    return x;
  } else if (anchorX === 2) {
    return window.innerWidth / 2 + x;
  }
}

function anchorY(y, anchorY) {
  if (anchorY === 0) {
    return -window.innerHeight / 2 + y;
  } else if (anchorY === 1) {
    return y;
  } else if (anchorY === 2) {
    return window.innerHeight / 2 + y;
  }
}

function rotateAbout(x, y, cX, cY, angle) {
  var r = distance(x,y,cX,cY);
  var a = atanNormalised((cY-y) / dezeroify(cX - x), dezeroify(cX - x), cY-y);
  a += angle;
  var x2 = r * Math.cos(toRadians(a));
  var y2 = r * Math.sin(toRadians(a));
  return [x2 + cX, y2 + cY];
}

function dezeroify(n) {
  if (n === 0) {
    return .0000001;
  } else {
    return n;
  }
}

window.onclick = function(e) {
  var mX = e.clientX - centreX;
  var mY = e.clientY - centreY;
  for (i = 0; i < interactables.length; i++) {
    if (interactables[i].over) {
      interactables[i].action();
      return;
    }
  }
  
  if (!SIMULATION_STATE) {
    for (var k in objects) {
      if (objects[k].over) {
        if (objects[k].showVectors) {
          objects[k].showVectors = false;
          objects[k].freebodyDiagram = true;
        } else if (objects[k].freebodyDiagram) {
          objects[k].freebodyDiagram = false;
        } else  {
          objects[k].showVectors = true;
        }
      }
    }
  }
}

window.onmousedown = function(e) {
  if (cursorMode === SELECT_MODE) {
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
    pCamX = camera.x;
    pCamY = camera.y;
    drag = true;
    camera.velocity = new Vector(0,0);
    startDrag = (new Date()).getTime() / 1000;
  } else if (cursorMode === RECTANGLE_MODE) {
    if (currentSelection === null) {
      currentSelection = new Selection((mouseX + camera.x*scale)/scale, (mouseY-camera.y*scale)/scale);
    }
  }
}

window.onmouseup = function(e) {
  if (cursorMode === SELECT_MODE) {
    var dX = prevDX;
    var dY = prevDY;
    drag = false;
    if ((prevDX !== 0 || prevDY !== 0) && prevDTime !== 0) {
      camera.velocity = new Vector(.2*(distance(0,0,dX,dY) / prevDTime) / scale, atanNormalised(dY/dX, dX, dY));
    }
    prevTime = -1;
    prevDX = 0;
    prevDY = 0;
    prevDTime = 0;
  } else if (cursorMode === RECTANGLE_MODE) {
    var s = currentSelection;
    currentSelection = null;
    var x1 = s.x;
    var x2 = s.x + s.width;
    var y1 = -s.y;
    var y2 = -s.y + s.height;
    
    var objs = [];
    
    for (var o in objects) {
      if (objects[o].x > min(x1,x2) && objects[o].x < max(x1,x2) && -objects[o].y < max(y1,y2) && -objects[o].y > min(y1,y2) && objects[o].type === "default") {
        objs.push(objects[o]);
      }
    }
    if (objs.length > 0)
      currentSystem = new System(objs, "New System");
  }
}

function min(x1, x2) {
  if (x1 < x2) {
    return x1;
  } else {
    return x2;
  }
}
function max(x1, x2) {
  if (x1 > x2) {
    return x1;
  } else {
    return x2;
  }
}
