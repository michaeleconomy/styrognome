const runSync = require("./run").runSync;


function push() {
  if (runSync("ruby generate.rb") != 0) {
    console.error("build failed");
    return;
  }
  console.log("clearing old files from s3");
  if (runSync("aws s3 rm s3://styrognome-web --recursive --profile styrognome-web") != 0) {
    console.error("remove failed");
    return;
  }

  console.log("clearing old files from s3 -- done");

  console.log("uploading new files to s3");
  if (runSync("aws s3 sync public/ s3://styrognome-web --profile styrognome-web") != 0) {
    console.error("sync failed");
    return;
  }
  console.log("uploading new files to s3 -- done");


  console.log("invalidating cloudfront");
  if (runSync('aws cloudfront create-invalidation --distribution-id E3VP0XJ18Z489P --paths "/*" --profile styrognome-web') != 0) {
    console.error("create-invalidation failed");
    return;
  }
  console.log("invalidating cloudfront -- done");
}


push();