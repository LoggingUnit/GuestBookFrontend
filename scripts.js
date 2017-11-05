var frontendContent = new FrontendContent("http://5.79.97.34:8090/guestbook","comments");

var postButton = document.getElementById("buttonPost");
postButton.addEventListener("click", frontendContent.postComment.bind(frontendContent));

frontendContent.getAllComments();

setInterval(function(){
  frontendContent.getAllComments();
}, 5000);
