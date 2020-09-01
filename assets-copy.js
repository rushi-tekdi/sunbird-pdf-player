var wrench = require("wrench"),
  util = require("util");

var source = "projects/sunbird-pdf-player/node_modules/ngx-extended-pdf-viewer/assets";
var target = "dist/sunbird-pdf-player/lib/assets/";

wrench.copyDirSyncRecursive(source, target, {
  forceDelete: true
});

console.log("Asset files successfully copied!");