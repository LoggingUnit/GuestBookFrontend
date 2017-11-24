'use strict';
/**
 * Main frontend class.
 * Takes address of Guestbook backend server and id of HTML page where to place output data (comments etc.)
 * @param {HTML} endpointAddress address of HTML backend server
 * @param {id} mountPoint id of HTML page element to place output data there
 * @returns nope
 */
class FrontendContent {

    constructor(endpointAddress, mountPoint) {
        this.idHashPrevious = 0;
        this.endpointAddress = endpointAddress;
        this.mountPoint = mountPoint;
    }

    /**
     * Takes id of comment and deletes it from server with DELETE query
     * @param {id} currentComment comment Object from server response commentsArray
     * @returns none
     */
    deleteComment(id) {
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
    refreshView(commentsArray) {
        var result = '';
        var mount = document.getElementById(this.mountPoint);
        // Removes all child nodes (removes all already uploaded comments in mount point)
        // maybe it is not perfect idea all the time delete and create agaim comment even if they did not changed
        while (mount.firstChild) {
            console.log(mount.firstChild, "removed");
            mount.removeChild(mount.firstChild);
        }
        commentsArray.sort((a, b) => b.id - a.id); //lambda comparator
        for (var i = 0; i < commentsArray.length; i++) {
            var currentComment = commentsArray[i];
            mount.appendChild(this.createMessage(currentComment));
        }
    }

    /**
     * Takes one comment from comments array and returns a <div> with filled body, header
     * and delete button
     * @param {*} comment one of the comments from comments array
     * @returns Filled <div> message
     */
    createMessage(comment) {
        // Creates main message div (comment + delete)
        var that = this;
        let message = document.createElement('div');
        message.className = 'message';
        // Creates div for header and body (header + body)
        let com = document.createElement('div');
        message.className = 'comment';
        // Creates button del  
        let del = document.createElement('div')
        del.className = 'delete';
        del.textContent = '[X]';
        del.addEventListener('click', function () {
            console.log('del clicked');
            that.deleteComment(comment.id);
        })
        // Creates field header  
        let head = document.createElement('h3');
        head.textContent = comment.header;
        // Creates field body  
        let bod = document.createElement('pre');
        bod.textContent = comment.body;
        // Append child to parents
        com.appendChild(head);
        com.appendChild(bod);
        message.appendChild(del);
        message.appendChild(com);

        console.log(message);
        return message;
    }

    /**
     * Query server for all comments
     */
    getAllComments() {
        var that = this;
        var promise = new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", that.endpointAddress);
            xhr.onload = function () {
                if (this.status == 200) {
                    resolve(xhr.responseText);
                } else {
                    var error = new Error(this.statusText);
                    error.code = this.status;
                    reject(error);
                }
            };

            xhr.onerror = function () {
                reject(new Error("Network Error"));
            };

            xhr.send();
        });

        promise
            .then(result => {
                var responseArray = JSON.parse(result);
                var hash = 0;
                for (var i = 0; i < responseArray.length; i++) {
                    hash += responseArray[i].id;
                }
                console.log(hash);
                if (hash !== that.idHashPrevious) {
                    that.refreshView(responseArray);
                    that.idHashPrevious = hash;
                }
            }, error => { console.log("Get all comments error"); }
            );
    }

    /**
    * Takes text from "formHeader" and "formBody" elements of page joined them into string dataOutput and send by POST query
    */
    postComment() {
        console.log(this.endpointAddress);
        var that = this;
        var headerElement = document.getElementById("formHeader");
        var bodyElement = document.getElementById("formBody");
        if ((headerElement.value !== "") && (bodyElement.value !== "")) {
            var dataOutput = "header=" + encodeURIComponent(headerElement.value)
                + "&body=" + encodeURIComponent(bodyElement.value);
            headerElement.value = '';
            bodyElement.value = '';
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
        else {
            // When the user clicks the button, open the modal
            modal.style.display = "block";
            // When the user clicks on <span> (x), close the modal
            span.onclick = function () {
                modal.style.display = "none";
            }
            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function (event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }
        }
    }
}
