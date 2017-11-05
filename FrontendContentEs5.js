/**
 * Main frontend class.
 * Takes address of Guestbook backend server and id of HTML page where to place output data (comments etc.)
 * @param {HTML} endpointAddress address of HTML backend server
 * @param {id} mountPoint id of HTML page element to place output data there
 * @returns Your mom
 */
function FrontendContent(endpointAddress, mountPoint) {
    this.idHashPrevious = 0;
    this.endpointAddress = endpointAddress;
    this.mountPoint = mountPoint;
}

/**
 * Takes id of comment and deletes it from server with DELETE query
 * @param {id} currentComment comment Object from server response commentsArray
 * @returns none
 */
FrontendContent.prototype.deleteComment = function (id) {
    var xhrDelete = new XMLHttpRequest();
    var that = this;
    xhrDelete.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            that.getAllComments();
        }
    });
    xhrDelete.open("DELETE", this.endpointAddress + "/" + id);
    xhrDelete.send();
}

/**
 * Takes array of comments and writes formatted html on page index.html
 * @param {Array} commentsArray Array of comments from backend CRUD service
 * @returns Resulting html
 */
FrontendContent.prototype.refreshView = function (commentsArray) {
    var result = '';
    console.log("refreshed");
    commentsArray.sort((a, b) => b.id - a.id); //lambda comparator
    for (var i = 0; i < commentsArray.length; i++) {
        var currentComment = commentsArray[i];
        // Append html elements
        result += '<div class = "delete">';
        result += '<input type="button" onclick="frontendContent.deleteComment(' + currentComment.id + ')" value="[X]"></input>';
        result += '</div>';
        result += '<div class = "comment">';
        result += '<h3>' + currentComment.header + '</h3>';
        result += '<pre>' + currentComment.body + '</pre>';
        result += '</div>';
    }
    // Put result on page`
    document.getElementById(this.mountPoint).innerHTML = result;
    return result;
}

/**
 * Query server for all comments
 */
FrontendContent.prototype.getAllComments = function () {
    var xhr = new XMLHttpRequest();
    var that = this;
    xhr.addEventListener('readystatechange', function () {
        if (xhr.readyState === xhr.DONE) {
            var responseArray = JSON.parse(xhr.responseText);
            var hash = 0;
            for (var i = 0; i < responseArray.length; i++) {
                hash += responseArray[i].id;
            }
            console.log(hash);
            if (hash !== that.idHashPrevious) {
                that.refreshView(responseArray);
                that.idHashPrevious = hash;
            }
        }
    })
    xhr.open("GET", this.endpointAddress);
    xhr.send();
}

/**
 * Takes text from "formHeader" and "formBody" elements of page joined them into string dataOutput and send by POST query
 */
FrontendContent.prototype.postComment = function () {
    console.log(this.endpointAddress);
    var that = this;
    var headerElement = document.getElementById("formHeader");
    var bodyElement = document.getElementById("formBody");
    if ((headerElement.value !== "") && (bodyElement.value !== "")) {
        var dataOutput = "header=" + encodeURIComponent(headerElement.value)
            + "&body=" + encodeURIComponent(bodyElement.value);
        var xhrPostForm = new XMLHttpRequest();
        xhrPostForm.addEventListener("readystatechange", function () {
            if (xhrPostForm.readyState === xhrPostForm.DONE) {
                that.getAllComments();
            }
        })
        xhrPostForm.open("POST", this.endpointAddress);
        xhrPostForm.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=utf8");
        xhrPostForm.send(dataOutput);
    }
    else alert("Some field looks empty, please enter something");
}
