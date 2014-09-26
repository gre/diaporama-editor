var Dropzone  = require("./lib/dropzone");
var $         = require("jquery");

var imgurDropzone;

Dropzone.options.dropzone = { // The camelized version of the ID of the form element
  autoProcessQueue: false, /* we want to handle uploads ourselves */
  uploadMultiple: true,
  parallelUploads: 25,
  addRemoveLinks: true,
  maxFiles: 25,
  /* The setting up of the dropzone */
  init: function() {
    imgurDropzone = this;
    window.imgurDropzone = this;
  }
};

module.exports = function (onImageUploaded, onImageError) {

  var uploadToImgur = function(file) {

    /* imgur accepts only base64 images */
    var FR= new FileReader();
    FR.onload = function(e) {
      var imgurUrl            = "https://api.imgur.com/3/image";
      var imgurAuthorization  = 'Client-ID e44fba7377de423';
      var image               = e.target.result.replace(/^data:image\/(png|jpg|gif|jpeg);base64,/, "");
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
          imgurDropzone.emit("success", file, "data", null);
          onImageUploaded(data);

        },
        failure: function(msg) {
          imgurDropzone.emit("error", file, "data", null);
          onImageError(msg);
        }
      });
    };

    FR.readAsDataURL(file);
  };

  $("#upload-all").click(function (e) {
    var files = imgurDropzone.getQueuedFiles();
    for(var i=0; i<files.length; i++) {
      uploadToImgur(files[i]);
    }
  });

};
