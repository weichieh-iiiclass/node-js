const multer = require('multer');
const {v4: uuidv4} = require('uuid');

const extMap = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
};

const storage = multer.diskStorage({
    destination : (req, file, cb)=>{ //相當於路由的req
        cb(null, __dirname + '/../../public/img'); //回到上上層的public/img
    },
    filename: (req, file, cb)=>{
        let ext = extMap[file.mimetype]; //副檔名
        cb(null, uuidv4() + ext); //uuidv4 隨機檔名 
    }
});

const fileFilter = (req, file, cb)=>{
    cb(null, !!extMap[file.mimetype]); //null= 沒有錯誤 //!!(not not):轉boolean值true/false
};

module.exports = multer({storage, fileFilter});