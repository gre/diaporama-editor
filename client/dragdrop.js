var Dropzone  = require("./lib/dropzone");
var $         = require("jquery");

module.exports = function() {

  Dropzone.options.dropzone = { // The camelized version of the ID of the form element
    autoProcessQueue: false, /* we want to handle uploads ourselves */
    uploadMultiple: true,
    parallelUploads: 25,
    maxFiles: 25,
    /* The setting up of the dropzone */
    init: function() {
      /* storing it in window like a champ */
      window.imgurDropzone = this;
    }
  };

  var uploadToImgur = function(file) {

    /* imgur accepts only base64 images */
    var FR= new FileReader();
    FR.onload = function(e) {
      var imgurUrl            = "https://api.imgur.com/3/image";
      var imgurAuthorization  = 'Client-ID e44fba7377de423';
      var image               = e.target.result.replace(/^data:image\/(png|jpg);base64,/, "");
      $.ajax({ 
        url: imgurUrl,
        headers: {
            'Authorization': imgurAuthorization
        },
        type: "POST",
        data: {
            "image": image
        },
        success: function(data) {
          window.imgurDropzone.emit("success", file, "data", null);
          console.log(data);
        },
        failure: function(msg) {
          window.imgurDropzone.emit("error", file, "data", null);
          console.log(msg);
        }
      });
    };

    FR.readAsDataURL(file);
  };

  $("#upload-all").click(function (e) {
    var files = window.imgurDropzone.getQueuedFiles();
    for(var i=0; i<files.length; i++) {
      uploadToImgur(files[i]);
    }
  });

  //console.log(myDropzone);
  return "drag & drop";
};