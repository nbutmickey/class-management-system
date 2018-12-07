let multer = require('multer');
let upload = multer({
    storage:multer.diskStorage({
        destination:function (req,file,cb) {
            cb(null,'../static/upload')
        },
        filename:function (req,file,cb) {
            cb(null,file.originalname);
        }
    })
})
module.exports= upload;