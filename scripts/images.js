var images = [];
var idCounter = 0;

function Image(source) {
  this.z = 0;
  this.img = document.createElement('img');
  this.img.src = source;
  this.img.style.position = 'absolute';
  this.img.onload = function () {
    this.setTransform([window.innerWidth/2,window.innerHeight/2], 0);
    document.body.appendChild(img);
  }

  this.setTransform = function(position, rotation) {
    this.z = position[2];

    this.img.style.left = position[0] - img.width  / 2 + 'px';
    this.img.style.top  = position[1] - img.height / 2 + 'px';

    this.img.style.transform = 'rotate(' + -rotation + 'rad)';

    this.img.style.webkitTransform = img.style.MozTransform = img.style.msTransform =
    this.img.style.OTransform = img.style.transform;

  };

  this.isPointOn = function(pointX, pointY){
    // Have to rotate the point around the center of the image
    var angle = -this.angle;
    var newX = Math.cos(angle) * (pointX-this.x) - Math.sin(angle) * (pointY-this.y) + this.x;
    var newY = Math.sin(angle) * (pointX-this.x) + Math.cos(angle) * (pointY-this.y) + this.y;

    // Then we can check if it is within the bounds
    newX = Math.abs(newX);
    newY = Math.abs(newY);
    return newX <= this.img.width && newY <= this.img.height;
  };

};

var grabImage = function(x, y){
  images.sort(function(obj1, obj2){
                return obj2.z - obj1.z;
              })
  for (image in images){
    if (image.isOnPoint(x, y)){
      return image;
    }
  }
  return void;
}
