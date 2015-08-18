
var scale="./images/scale.png";
var move="./images/move.png";
var grab="./images/grab.png";



$(function(){
    
   	$("#grab").mouseover(function(){
    	$("#tutorial").attr("src", grab);
    	callDialog();
    });
    $("#scaling").mouseover(function(){
    	$("#tutorial").attr("src", scale);
    	callDialog();
    });
    $("#move").mouseover(function(){
    	$("#tutorial").attr("src", move);
    	callDialog();
    });

});

function callDialog(){
	$(function() {
		$( "#dialog" ).dialog();
  	});
}

