var IdHashPrevious= 0;

/**
 * Takes id of comment and deletes it from server with DELETE query
 * @param {id} currentComment comment Object from server response commentsArray
 * @returns none
 */
var deleteComment = function(id) {
  var xhrDelete = new XMLHttpRequest();
  xhrDelete.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      getAllComments();
    }
  });
  xhrDelete.open("DELETE", "http://5.79.97.34:8090/guestbook/" + id);
  xhrDelete.send();
}

/**
 * Takes array of comments and writes formatted html on page index.html
 * @param {Array} commentsArray Array of comments from backend CRUD service
 * @returns Resulting html
 */
var refreshView = function(commentsArray) {
  var result = '';
  console.log("refreshed");
  for (var i = 0; i < commentsArray.length; i++) {
    var currentComment = commentsArray[i];
    // Append html elements
    result += '<div class = "delete">';
    result += '<input type="button" onclick=" deleteComment(' + currentComment.id+')" value="[X]"></input>';
    result += '</div>';
    result += '<div class = "comment">';
    result += '<h3>' + currentComment.header + '</h3>';
    result += '<pre>' + currentComment.body + '</pre>';
    result += '</div>';
  }
  // Put result on page`
  document.getElementById('comments').innerHTML = result;
  return result;
}

/**
 * Query server for all comments
 */
var getAllComments = function() {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function () {
    if (xhr.readyState === xhr.DONE) {
      var responseArray= JSON.parse(xhr.responseText);
      var idHash = 0;
      for (var i = 0; i < responseArray.length; i++) {
        idHash += responseArray[i].id;
      }
      console.log(idHash);
      if (idHash !== IdHashPrevious) {
        refreshView(responseArray);
        IdHashPrevious = idHash;
      }
    }
  })
  xhr.open("GET", "http://5.79.97.34:8090/guestbook");
  xhr.send();
}

/**
 * Takes text from "formHeader" and "formBody" elements of page joined them into string dataOutput and send by POST query
 */
var postComment = function() {
  var headerElement = document.getElementById("formHeader");
  var bodyElement = document.getElementById("formBody");
  if ((headerElement.value !== "")&&(bodyElement.value !== ""))
  {
    var dataOutput = "header=" + encodeURIComponent(headerElement.value) 
                   + "&body=" + encodeURIComponent(bodyElement.value);
    var xhrPostForm = new XMLHttpRequest();
    xhrPostForm.addEventListener("readystatechange", function () {
      if (xhrPostForm.readyState === xhrPostForm.DONE) {
        getAllComments();
      }
    })
    xhrPostForm.open("POST", "http://5.79.97.34:8090/guestbook");
    xhrPostForm.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=utf8");
    xhrPostForm.send(dataOutput);
  }
  else alert("Some field looks empty, please enter something");
}
var postButton = document.getElementById("buttonPost");
postButton.addEventListener("click", postComment);

getAllComments();

setInterval(function(){
  getAllComments();
}, 5000);