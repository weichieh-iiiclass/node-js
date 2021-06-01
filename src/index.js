
require('dotenv').config();  // 連環境參數
const port = process.env.PORT || 3000;
const express = require('express');  // 連express

// const multer = require('multer');
// const upload = multer({dest:'tmp_uploads/'}); //設定暫存的資料夾
// const {v4: uuidv4} = require('uuid'); //把v4改名為uuidv4
const upload = require(__dirname + '/modules/upload-img'); 

const fs = require('fs');

const app = express(); 

app.set('view engine', 'ejs'); 
app.use(express.urlencoded({extended:false})); 
app.use(express.json()); 

// 靜態內容通常放前面
app.use(express.static(__dirname + '/../public')); 

//---------- 定義路由開始 (路由一定是/開頭)---------- 
app.get('/',(req, res)=>{ 
    res.render('home', {name: 'Jessica'}); 
});

app.get('/json-test',(req, res)=>{
    const d = require(__dirname + '/../data/sales'); 
    res.render('json-test',{sales:d});
});

app.get('/try-qs', (req, res)=>{
    res.json(req.query);
});

// 搭配form01.html
app.post('/try-post', (req, res)=>{  
    res.json(req.body); // 有middleware才會有東西，從req那邊做解析，放到req.body裡
});

// 路徑一樣，方法不同 get post
app.get('/try-post-form', (req, res)=>{ 
    res.render('try-post-form', {email:'', password:''});
    
});
app.post('/try-post-form', (req, res)=>{ 
    res.render('try-post-form', req.body); 
    
});

// const extMap ={
//     'image/png':'.png',
//     'image/jpeg': '.jpg',
// };

// get不需用到middleware，用傳統方式上傳檔案
// 在原本的/try-upload路由新增一個get
app.get('/try-upload', (req, res)=>{
    res.render('try-upload');
});

// 上傳的欄位名稱叫avatar，single最多一次上傳一個檔案
app.post('/try-upload', upload.single('avatar'), async (req, res)=>{
    console.log(req.file);
    // 寫成模組(upload-img.js)之後就不用再自己判定
    // let newName = '';
    // if(extMap[req.file.mimetype]){ 
    //     newName = uuidv4() + extMap[req.file.mimetype];
    //     await fs.rename(req.file.path, './public/img/' + newName, error=>{});
    // }

    res.json({
        // 不加的話會顯示typeerror
        // 加&&:如果前面是0就是0(會拿到undefined)，前面是1結果就會是filename
           filename: req.file && req.file.filename,
           body: req.body,
        //    newName,
        });
});


// 上傳的欄位名稱叫photo，array最多一次上傳6個檔案
app.post('/try-uploads', upload.array('photo', 6), (req, res)=>{
    console.log(req.files);//會把上傳的檔案放到req.files(注意有s)
    res.json({
           file: req.files,
           body: req.body,
        });
});

app.get('/pending', (req, res)=>{
    
});

// action id是代稱(類似變數名稱)，如果*拿到的是array(但不建議)
// http://localhost:3000/my-params1/edit/15
app.get('/my-params1/:action?/:id?', (req, res)=>{
    res.json(req.params);
});

// app.get('/my-params1/hello') 要放在 '/my-params1/:action?/:id?'前面才不會被擋到
// 越特殊,嚴謹的路由要放在前面

//404路由定義，要放在所有路由的後面，避免蓋到其他的設定
app.use((req, res) =>{ 
    res.type('text/html');
    res.status(404);
    res.send('404 - 找不到網頁'); 
});
// -------------- ------ 定義路由結束----------------- --- 
app.listen(port, ()=>{
    console.log(`server started ${port}`);
});