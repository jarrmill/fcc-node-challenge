exports.image_upload = function(req, res, next){
  let file = req.file;
  let filesize = req.file.size;
  console.log("Pic: ", file.size);
  if(filesize!== undefined){
    res.status(200).json(filesize);
  }else{
    res.status(400);
  }
}
