"use strict";

var frontendContent = new FrontendContent("http://5.79.97.34:8090/guestbook","comments");

var postButton = document.getElementById("buttonPost");

var modal = document.getElementById('myModal');
var span = document.getElementsByClassName('close')[0];

var labelSize = document.getElementById('size');

postButton.addEventListener('click', frontendContent.postComment.bind(frontendContent));

frontendContent.getAllComments();

setInterval(function(){
  frontendContent.getAllComments();
  labelSize.innerText = "Visible area width: " + labelSize.offsetWidth + ' px';
}, 5000);