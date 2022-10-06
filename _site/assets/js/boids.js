/* one pixel is *roughly* 1/4 of mm. */


// class Boid {
//   constructor(x, y, size, speed, color){
//     this.x = x; 
//     this.y = y;

//     this.size = size;

//     /* pixels per second */
//     this.dir_angle = Math.random() * 2 * Math.PI;

//     /* multiplying speed by pxl_ratio is weird and shouldnt have to be the case. 
//     I should be able to say i wan't to traverse s pixles per second. Regardless of 
//     the pixel size. */
//     this.speed = speed; 

//     this.color = color;
//     this.arc_rads = 25.;
//   }

//   velocity(){
//     return {vx: speed * Math.cos(this.dir_angle), vy: speed * Math.sin(this.dir_angle)};
//   }

//   draw(canvas){
//     canvas.context.fillStyle = this.color;

//     canvas.context.beginPath();
//     canvas.context.arc(this.x, this.y, this.size, dir - this.arc_rads / 2., dir + this.arc_rads / 2.);
//     canvas.context.endPath();
//   }
// }


// class Canvas{
//   /* Update to get the length and height as expected for retina and so on */ 
//   constructor(canvas){
//     this.el = canvas;
//     this.context = canvas.getContext('2d');
//     this.pxl_ratio = window.devicePixelRatio;

//     this.w = canvas.offsetWidth * this.pxl_ratio;
//     this.h = canvas.offsetHeight * this.pxl_ratio;
//   }

// }

// /* The bounding box will represent every obstalce. 
// Instead of using many bounding boxes for close objects, use one big one. 
// Issue: If we have many bounding boxes close together, 
// they should ideally act as one obstacle, but will have an 
// additive reuplsive force.  */
// class BoundingBox{
//   constructor(x, y, width, height, is_inwards){
//     this.x = x;
//     this.y = y;
//     this.width = width;
//     this.height = height;
//     this.is_inwards = is_inwards;
//   }

//   distance(px, py){
//     if (this._is_inside(px, py)){
//       return null;
//     }

//     var upper_side = Math.abs(this.y + this.height - py);
//     var lower_side = Math.abs(this.y - py);
//     var right_side = Math.abs(this.y + this.height - py);
//     var upper_side = Math.abs(this.y + this.height - py);

//     var upper_side = Math.abs(this.y + this.height - py);
//     var upper_side = Math.abs(this.y + this.height - py);
//     var upper_side = Math.abs(this.y + this.height - py);
//     var upper_side = Math.abs(this.y + this.height - py);
//   }

//   _is_inside(px, py){
//     var inside_width = (px >= this.x) && (px <= this.x + this.width);
//     var inside_height = (py >= this.y) && (py <= this.y + this.height);
//     return inside_width && inside_height;
//   }
// }


// var initBoids = function(canvas, size, speed, color, N){
//   var boids = [];
//   size = size * canvas.pxl_ratio;

//   /* pixels per second */
//   /* multiplying speed by pxl_ratio is weird and shouldnt have to be the case. 
//   I should be able to say i wan't to traverse s pixles per second. Regardless of 
//   the pixel size. */
//   speed = speed * canvas.pxl_ratio; 

//   for(var i = 0; i < N; i++){
//     var x = Math.random() * canvas.w;
//     var y = Math.random() * canvas.h;
//     boids.push(new Boid(x, y, speed, color));
//   }
//   return boids;
// };



// var canvas = new Canvas(canvas);
// var boids = initBoids(size, speed, color, N);
// var boundaries = [new BoundingBox(0, 0, canvas.w, canvas.h, is_inwards=true)]; 




// var bJS = function(canvas_el){

//   /* this in a way lays out the class structure */
//   this.bJS = {


//     canvas: {
//       el: canvas_el,
//       w: canvas_el.offsetWidth,
//       h: canvas_el.offsetHeight
//     },
//     boids: {
//       number: {
//         value: 400,
//       },
//       color: {
//         value: '#fff', 
//         opactiy: 1
//       },

//       move: {
//         speed: 1
//       },
      
//       size: {
//         value: 20,
//       },
      
//       array: []
//     },
//     fn: {
//       vendors:{}
//     },
//     tmp: {}
//   };


//   var bJS = this.bJS;

//   bJS.fn.retinaInit = function(){

//     bJS.canvas.pxratio = window.devicePixelRatio; 

//     bJS.canvas.w = bJS.canvas.el.offsetWidth * bJS.canvas.pxratio;
//     bJS.canvas.h = bJS.canvas.el.offsetHeight * bJS.canvas.pxratio;

//     bJS.particles.size.value = bJS.tmp.obj.size_value * bJS.canvas.pxratio;
//     bJS.particles.move.speed = bJS.tmp.obj.move_speed * bJS.canvas.pxratio;

//   };

//    /* ---------- bJS functions - canvas ------------ */

//   bJS.fn.canvasInit = function(){
//     bJS.canvas.ctx = bJS.canvas.el.getContext('2d');
//   };

//   bJS.fn.canvasSize = function(){

//     bJS.canvas.el.width = bJS.canvas.w;
//     bJS.canvas.el.height = bJS.canvas.h;


//     window.addEventListener('resize', function(){

//         bJS.canvas.w = bJS.canvas.el.offsetWidth;
//         bJS.canvas.h = bJS.canvas.el.offsetHeight;

//         /* resize canvas */
//         if(bJS.tmp.retina){
//           bJS.canvas.w *= bJS.canvas.pxratio;
//           bJS.canvas.h *= bJS.canvas.pxratio;
//         }

//         bJS.canvas.el.width = bJS.canvas.w;
//         bJS.canvas.el.height = bJS.canvas.h;

//         /* repaint canvas on anim disabled */
//         if(!bJS.particles.move.enable){
//           bJS.fn.particlesEmpty();
//           bJS.fn.particlesCreate();
//           bJS.fn.particlesDraw();
//           bJS.fn.vendors.densityAutoParticles();
//         }

//       /* density particles enabled */
//       bJS.fn.vendors.densityAutoParticles();

//     });

//   };


//   bJS.fn.canvasPaint = function(){
//     bJS.canvas.ctx.fillRect(0, 0, bJS.canvas.w, bJS.canvas.h);
//   };

//   bJS.fn.canvasClear = function(){
//     bJS.canvas.ctx.clearRect(0, 0, bJS.canvas.w, bJS.canvas.h);
//   };


//   /* Boids */ 

//   // bJS.fn.createBoid = function(color, opacity){

//   // }





  

// };




/* global functions - vendors */


// window.requestAnimFrame = (function(){
//     return  window.requestAnimationFrame ||
//       window.webkitRequestAnimationFrame ||
//       window.mozRequestAnimationFrame    ||
//       window.oRequestAnimationFrame      ||
//       window.msRequestAnimationFrame     ||
//       function(callback){
//         window.setTimeout(callback, 1000 / 60);
//       };
//   })();
  
//   window.cancelRequestAnimFrame = ( function() {
//     return window.cancelAnimationFrame         ||
//       window.webkitCancelRequestAnimationFrame ||
//       window.mozCancelRequestAnimationFrame    ||
//       window.oCancelRequestAnimationFrame      ||
//       window.msCancelRequestAnimationFrame     ||
//       clearTimeout
//   } )();
  
//   function hexToRgb(hex){
//     // By Tim Down - http://stackoverflow.com/a/5624139/3493650
//     // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
//     var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
//     hex = hex.replace(shorthandRegex, function(m, r, g, b) {
//        return r + r + g + g + b + b;
//     });
//     var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//     return result ? {
//         r: parseInt(result[1], 16),
//         g: parseInt(result[2], 16),
//         b: parseInt(result[3], 16)
//     } : null;
//   };
  
//   function clamp(number, min, max) {
//     return Math.min(Math.max(number, min), max);
//   };
  
//   function isInArray(value, array) {
//     return array.indexOf(value) > -1;
//   }


/* call this particlesJS to start */
window.particlesJS = function(){

  //console.log(params);
  var tag_id = "boids-js";

  /* pJS elements */
  var canvas_class = 'boids-js-canvas-el';

  /* create canvas element */
  var canvas_el = document.createElement('canvas');
  canvas_el.className = canvas_class;

  /* set size canvas */
  canvas_el.style.width = "100%";
  canvas_el.style.height = "100%";

  /* append canvas */
  var canvas = document.getElementById(tag_id).appendChild(canvas_el);



  pxratio = window.devicePixelRatio; 


  canvas_w = canvas_el.offsetWidth * pxratio;
  canvas_h = canvas_el.offsetHeight * pxratio;

  ctx = canvas_el.getContext('2d');

  console.log(canvas_el.height + 100);

  canvas_el.width = canvas_w;
  canvas_el.height = canvas_h;

  console.log(canvas_el.height + 100);
  console.log(canvas_el.width);
  ctx.moveTo(0, 0);
  ctx.lineTo(canvas_el.width, canvas_el.height);
  ctx.lineTo(0, canvas_el.height);
  ctx.lineTo(canvas_el.width, 0);
  ctx.lineTo(0, 0);
  ctx.lineTo(0, canvas_el.height);
  ctx.moveTo(canvas_el.width, canvas_el.height);
  ctx.lineTo(canvas_el.width, 0);
  ctx.lineWidth = 14;
  ctx.strokeStyle = "white";
  ctx.stroke();

};



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




  pxratio = window.devicePixelRatio; 


  var canvas_w = canvas_el.offsetWidth * pxratio;
  var canvas_h = canvas_el.offsetHeight * pxratio;

  ctx = canvas_el.getContext('2d');

  console.log(canvas_el.height + 100);

  canvas_el.width = canvas_w;
  canvas_el.height = canvas_h;

  console.log(canvas_el.height + 100);
  console.log(canvas_el.width);
  ctx.moveTo(0, 0);
  ctx.lineTo(canvas_el.width, canvas_el.height);
  ctx.lineTo(0, canvas_el.height);
  ctx.lineTo(canvas_el.width, 0);
  ctx.lineTo(0, 0);
  ctx.lineTo(0, canvas_el.height);
  ctx.moveTo(canvas_el.width, canvas_el.height);
  ctx.lineTo(canvas_el.width, 0);
  ctx.lineWidth = 14;
  ctx.strokeStyle = "white";
  ctx.stroke();

  // canvas_el.width = canvas_el.offsetWidth * 2;
  // canvas_el.height = canvas_el.offsetHeight * 2;
  // var canvas = document.getElementById("myCanvas");
  // var ctx = canvas_el.getContext("2d");
  // console.log(canvas_el.width);
  // console.log(canvas_el.scrollWidth);
  // console.log(canvas_el.offsetWidth);


  // console.log(canvas_el.style.width);

  // if (window.devicePixelRatio > 1) {
  //   var canvasWidth = canvas_el.offsetWidth;
  //   var canvasHeight = canvas_el.offsetHeight;

  //   canvas_el.width = canvasWidth * window.devicePixelRatio;
  //   canvas_el.height = canvasHeight * window.devicePixelRatio;
  // }

  // // var ctx = canvas.getContext("2d");
  // console.log(canvas_el.height + 100);
  // console.log(canvas_el.width);
  // ctx.moveTo(0, 0);
  // ctx.lineTo(canvas_el.width, canvas_el.height);
  // ctx.lineTo(0, canvas_el.height);
  // ctx.lineTo(canvas_el.width, 0);
  // ctx.lineTo(0, 0);
  // ctx.lineTo(0, canvas_el.height);
  // ctx.moveTo(canvas_el.width, canvas_el.height);
  // ctx.lineTo(canvas_el.width, 0);
  // ctx.lineWidth = 14;

  // ctx.stroke();


  // boids(canvas_el);

}; 