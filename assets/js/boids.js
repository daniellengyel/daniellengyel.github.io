/* For now we update both position and force at time step i with values from i - 1
Later I would like to use a leapfrog procedue or something similar */


/* one pixel is *roughly* 1/4 of mm. */

class Boid {
  constructor(x, y, size, max_size, speed, color, opacity){
    this.x = x; 
    this.y = y;

    this.size = size;
    this.rel_size = size / max_size;

    /* pixels per second */
    this.dir_angle = Math.random() * 2 * Math.PI;

    /* multiplying speed by pxl_ratio is weird and shouldnt have to be the case. 
    I should be able to say i wan't to traverse s pixles per second. Regardless of 
    the pixel size. */
    this.base_speed = speed; 
    this.speed = speed;

    this.color = color;
    this.opacity = opacity;
    this.arc_rads = Math.PI / 6;
  }

  velocity(){
    return {x: this.speed * Math.cos(this.dir_angle), y: this.speed * Math.sin(this.dir_angle)};
  }

  updatePosition(time_delta){
    var v_cartesian = this.velocity();
    this.x += time_delta * v_cartesian.x;
    this.y += time_delta * v_cartesian.y;
  }

  applyForce(f, time_delta){
    if(f == null){
      return
    }
    var v_cartesian = this.velocity();
    v_cartesian.x += time_delta * f.x / this.rel_size;
    v_cartesian.y += time_delta * f.y / this.rel_size;

    this.speed = Math.sqrt(Math.pow(v_cartesian.x, 2) + Math.pow(v_cartesian.y, 2));
    this.dir_angle = Math.atan2(v_cartesian.y, v_cartesian.x);
  }

  flockingBehavior(boids, time_delta){
    var separation_raduis = 40;
    var v_algin_radius = 100;
    var centering_radius = 50;
    var eps = 0.0001;

    var sep_f = {x: 0, y: 0, count:0};
    var v_align_f = {x: 0, y: 0, count:0};
    var cent_f = {x: 0, y: 0, count:0};

    var _sep_func = function(d, disp_unit){
      var c = 0.005;
      // return {x: -c/Math.pow(d, 1/4) * disp_unit.x, y: -c/Math.pow(d, 1/4) * disp_unit.y};
      return {x: -c * disp_unit.x, y: -c * disp_unit.y}
    }

    var v = this.velocity();
    var _v_align_func = function(d, disp_unit, v_b){
      var c = 0.01;
      return {x: c*(v_b.x - v.x), y: c*(v_b.y - v.y)};
    }

    var _centering_func = function(d, disp_unit){
      var c = 0.006
      return {x: c * disp_unit.x, y: c * disp_unit.y}
    }

    for(var i = 0; i<boids.length; i++){
      var disp = {x: boids[i].x - this.x, y: boids[i].y - this.y}

      var d = Math.sqrt(Math.pow(disp.x, 2) + Math.pow(disp.y, 2));
      if((d < eps)){
        continue
      }
      var disp_unit = {x: disp.x / d, y: disp.y / d}

      // Seperation 
      if(d < separation_raduis){
        var curr_sep_f = _sep_func(d, disp_unit);
        sep_f.x += curr_sep_f.x;
        sep_f.y += curr_sep_f.y;
        sep_f.count += 1;

      }

      if(d < v_algin_radius){
        var curr_v_align_f = _v_align_func(d, disp_unit, boids[i].velocity());
        v_align_f.x += curr_v_align_f.x;
        v_align_f.y += curr_v_align_f.y;
        v_align_f.count += 1;

      }

      if(d < centering_radius){
        var curr_cent_f = _centering_func(d, disp_unit);
        cent_f.x += curr_cent_f.x;
        cent_f.y += curr_cent_f.y;
        cent_f.count += 1;

      }

    }

    var total_f = {
      x: sep_f.x + v_align_f.x / Math.max(1, v_align_f.count) + cent_f.x / Math.max(1, cent_f.count),
      y: sep_f.y + v_align_f.y / Math.max(1, v_align_f.count) + cent_f.y / Math.max(1, cent_f.count)
    }


    this.applyForce(total_f, time_delta);

  }

  checkAdjustSpeed(time_delta){
    if(this.speed > this.base_speed){
      this.speed -= time_delta * 0.1
    }
    if(this.speed < this.base_speed){
      this.speed += time_delta * 0.1
    }
  }

  draw(canvas){
    var drawFullCircle = true;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = this.color;
    var lower_angle = this.dir_angle - this.arc_rads / 2. + Math.PI;
    var upper_angle = this.dir_angle + this.arc_rads / 2. + Math.PI;
    ctx.beginPath();
    ctx.globalAlpha = this.opacity;
    ctx.moveTo(this.x, this.y);
    if(drawFullCircle){
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    } else {
      ctx.arc(this.x, this.y, this.size, lower_angle, upper_angle);
    }
    ctx.closePath();
    ctx.fill();
  }
}


/* A bounding box will be used to represent any type of obstalce. 
Instead of using many bounding boxes for close objects, use one big one. 
Issue: If we have many bounding boxes close together, 
they should ideally act as one obstacle, but will have an 
additive reuplsive force.  */
class BoundingBox{
  constructor(x, y, width, height, is_inwards, effective_radius, force_c){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.is_inwards = is_inwards;
    this.force_c = force_c;

    this.effective_radius = effective_radius;
  }

  force(px, py){
    var force_c = this.force_c
    var _forceFunc = function(d){
      return force_c/Math.sqrt(d);
    }

    if(this.is_inwards){
      if(!this.isInside(px, py)){
        return null;
      }

      var fx = 0;
      var fy = 0;

      var upper_side = Math.abs(this.y - py);
      if(upper_side <= this.effective_radius){
        fy += _forceFunc(upper_side);
      }

      var lower_side = Math.abs(this.y + this.height - py);
      if(lower_side <= this.effective_radius){
        fy -= _forceFunc(lower_side);
      }

      var left_side = Math.abs(this.x - px);
      if(left_side <= this.effective_radius){
        fx += _forceFunc(left_side);
      }

      var right_side = Math.abs(this.x + this.width - px);
      if(right_side <= this.effective_radius){
        fx -= _forceFunc(right_side);
      }
      return {x: fx, y: fy};

    } else {
      if (this.isInside(px, py)){
        return null;
      }

      var f = {x: 0, y: 0};

      // are we directly over or under the obstacle 
      if ((px >= this.x) && (px <= this.x + this.width)){
        if ((py <= this.y) && (this.y - py) < this.effective_radius){
          f.y -= _forceFunc(this.y - py);
        } else if ((py >= this.y + this.height) && (py - this.y - this.height) < this.effective_radius){
          f.y += _forceFunc(py - (this.y + this.height));
        }

      } else if ((py >= this.y) && (py <= this.y + this.height)){
        if ((px <= this.x) && (this.x - px) < this.effective_radius){
          f.x -= _forceFunc(this.x - px);
        } else if ((px >= this.x + this.width) && (px - this.x - this.width) < this.effective_radius){
          f.x += _forceFunc(px - (this.x + this.width));
        }
      } else {
        
      }

      return f;

    // var upper_side = Math.abs(this.y - py);
    // var lower_side = Math.abs(this.y + this.height - py);
    // var right_side = Math.abs(this.x - px);
    // var left_side = Math.abs(this.y + this.width - px);

    // var upper_side = Math.abs(this.y + this.height - py);
    // var upper_side = Math.abs(this.y + this.height - py);
    // var upper_side = Math.abs(this.y + this.height - py);
    // var upper_side = Math.abs(this.y + this.height - py);

    }

  }

  isInside(px, py){
    var inside_width = (px >= this.x) && (px <= this.x + this.width);
    var inside_height = (py >= this.y) && (py <= this.y + this.height);
    return inside_width && inside_height;
  }
}

var canCreate = function(x, y, obstacles){
  for(var i=0; i < obstacles.length; i++){
    if((!obstacles[i].isInside(x, y)) && (obstacles[i].is_inwards)){
      return false;
    } else if ((obstacles[i].isInside(x, y)) && (!obstacles[i].is_inwards)){
      return false;
    }
  }
  return true;
}

var initBoids = function(canvas, size, speed, color, opacity, N, obstacles){
  var boids = [];

  var i = 0
  while(i < N){
    var x = Math.random() * canvas.width;
    var y = Math.random() * canvas.height;
    if(canCreate(x, y, obstacles)){
      var curr_size = size * Math.max(Math.random(), 0.4);
      boids.push(new Boid(x, y, curr_size, size, speed, color, opacity));
      i += 1
    }
    
  }
  return boids;
};

var getPixelRatio = function(){
  return window.devicePixelRatio;
}

var computeElementRect = function(canvas, elem){
  var canvas_rect = canvas.getBoundingClientRect();
  var el_rect = elem.getBoundingClientRect();

  var pxl_ratio = getPixelRatio(); 
  return {
    left: pxl_ratio * (el_rect.left - canvas_rect.left),
    top: pxl_ratio * (el_rect.top - canvas_rect.top),
    width: pxl_ratio * el_rect.width,
    height: pxl_ratio * el_rect.height
  }
}



var bJS = function(tag_id){

  // var canvas = new Canvas(canvas);
  // var boids = initBoids(size, speed, color, N);
  // var boundaries = [new BoundingBox(0, 0, canvas.w, canvas.h, is_inwards=true)];
  this.bJS = {
    boids: {
      size: 4,
      speed: 0.75,
      color: "white",
      opacity: 1,
      N: 200,
      array: []
    }, 
    obstacles: []
  };
  
  var bJS = this.bJS;

  var init = function(){  
    var canvas_el = document.querySelector('#'+"boids-js"+' > .boids-js-canvas-el');
    var N = bJS.boids.N;

    bJS.obstacles.push(new BoundingBox(0, 0, canvas_el.width, canvas_el.height, true, 100, 0.1));
    // bJS.obstacles.push(new BoundingBox(500, 500, 800, 400, false, 50, 0.2));
    var parent_children_el = document.getElementById("Intro").children;
    for(var i = 0; i<parent_children_el.length; i++){
      var child = parent_children_el[i];
      if((child.className != "obstacle")){
        continue;
      }
      var elemRect = computeElementRect(canvas_el, child);
      bJS.obstacles.push(
        new BoundingBox(
          elemRect.left, 
          elemRect.top, 
          elemRect.width, 
          elemRect.height, 
          false, 50, 0.2));
    }


    bJS.boids.array = initBoids(canvas_el, bJS.boids.size, bJS.boids.speed, bJS.boids.color, bJS.boids.opacity, N, bJS.obstacles);
    
    for(var i = 0; i < N; i++){bJS.boids.array[i].draw(canvas_el);} 

  }

  var update = function(){
    var canvas_el = document.querySelector('#'+"boids-js"+' > .boids-js-canvas-el');
    const ctx = canvas_el.getContext('2d');

    /* clear canvas */
    ctx.clearRect(0, 0, canvas_el.width, canvas_el.height);
    var N = bJS.boids.N;

    var time_delta = 0.5;

    for(var i = 0; i < N; i++){bJS.boids.array[i].updatePosition(time_delta);}
    for(var i = 0; i < N; i++){bJS.boids.array[i].draw(canvas_el);}


    for(var i = 0; i < N; i++){
      for(var j = 0; j < bJS.obstacles.length; j++){
        var px = bJS.boids.array[i].x;
        var py = bJS.boids.array[i].y;
        bJS.boids.array[i].applyForce(bJS.obstacles[j].force(px, py), time_delta);
      }
    }

    for(var i = 0; i < N; i++){
      bJS.boids.array[i].flockingBehavior(bJS.boids.array, time_delta);
    }

    for(var i = 0; i < N; i++){
      bJS.boids.array[i].checkAdjustSpeed(time_delta);
    }


    // // draw rectangle
    for(var i = 0; i<bJS.obstacles.length; i++){
      ctx.strokeStyle = "white";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.rect(
        bJS.obstacles[i].x, bJS.obstacles[i].y, 
        bJS.obstacles[i].width, bJS.obstacles[i].height);
      ctx.stroke();
    }

    bJS.obstacles = [];
    bJS.obstacles.push(new BoundingBox(0, 0, canvas_el.width, canvas_el.height, true, 100, 0.1));
    // bJS.obstacles.push(new BoundingBox(500, 500, 800, 400, false, 50, 0.2));
    var parent_children_el = document.getElementById("Intro").children;
    for(var i = 0; i<parent_children_el.length; i++){
      var child = parent_children_el[i];
      if((child.className != "obstacle")){
        continue;
      }
      var elemRect = computeElementRect(canvas_el, child);
      bJS.obstacles.push(
        new BoundingBox(
          elemRect.left, 
          elemRect.top, 
          elemRect.width, 
          elemRect.height, 
          false, 50, 0.2));
    }


    requestAnimFrame(update);

  }

  init();
  update();
  
}
// };




/* global functions - vendors */


window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
      function(callback){
        window.setTimeout(callback, 1000 / 60);
      };
  })();
  
  window.cancelRequestAnimFrame = ( function() {
    return window.cancelAnimationFrame         ||
      window.webkitCancelRequestAnimationFrame ||
      window.mozCancelRequestAnimationFrame    ||
      window.oCancelRequestAnimationFrame      ||
      window.msCancelRequestAnimationFrame     ||
      clearTimeout
  } )();
  
  function hexToRgb(hex){
    // By Tim Down - http://stackoverflow.com/a/5624139/3493650
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
       return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  };
  
  function clamp(number, min, max) {
    return Math.min(Math.max(number, min), max);
  };
  
  function isInArray(value, array) {
    return array.indexOf(value) > -1;
  }


/* call this to start */



window.boidsJS = function(){

  var tag_id = "boids-js";

  var canvas_class = "boids-js-canvas-el";

  /* create canvas element */
  var canvas_el = document.createElement('canvas');
  canvas_el.className = canvas_class;

  /* set size canvas */
  canvas_el.style.width = "100%";
  canvas_el.style.height = "100%";

  /* append canvas */
  var canvas = document.getElementById(tag_id).appendChild(canvas_el);

  pxratio = getPixelRatio(); 


  var canvas_w = canvas_el.offsetWidth * pxratio;
  var canvas_h = canvas_el.offsetHeight * pxratio;

  ctx = canvas_el.getContext('2d');


  canvas_el.width = canvas_w;
  canvas_el.height = canvas_h;

  ctx.lineWidth = 5;
  ctx.strokeStyle = "white";

  bJS(tag_id);

}; 