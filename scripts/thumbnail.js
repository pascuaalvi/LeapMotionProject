var images = {};
$ = jQuery;

Leap.loop(function(frame) {

  frame.hands.forEach(function(hand, index) {

    var image = ( images[index] || (images[index] = new Image()) );    
    image.setTransform(hand.screenPosition(), hand.roll());
    
  });
  
}).use('screenPosition', {scale: 0.25});


var Image = function(imgNo) {
  var image = this;
  var img = document.createElement('img');
  img.src = 'images/images'+imgNo+'.jpg';
  img.style.position = 'inline-block';
  img.style.width = '200px';
  img.style.height = '25%';
  img.onload = function () {
    //image.setTransform([window.innerWidth/2,window.innerHeight/2], 0);
    //document.body.appendChild(img);
    $("#thumbnail").append(img);
  }

  image.setAsCurrentImage = function(){
    $("#thumbnail img").removeClass("selected");
    img.classList.add("selected");
  }
  
  image.setTransform = function(position, rotation) {
    if($(this).hasClass("selected")){
      console.log(position+" X "+rotation);
      img.style.left = position[0] - img.width  / 2 + 'px';
      img.style.top  = position[1] - img.height / 2 + 'px';

      img.style.transform = 'rotate(' + -rotation + 'rad)';
      
      img.style.webkitTransform = img.style.MozTransform = img.style.msTransform =
      img.style.OTransform = img.style.transform;
    }
  };

};

images[0] = new Image(1);
images[1] = new Image(2);
images[2] = new Image(3);
images[3] = new Image(4);

// This allows us to move the image even whilst in an iFrame.
Leap.loopController.setBackground(true)