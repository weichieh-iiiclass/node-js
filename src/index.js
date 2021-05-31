
require('dotenv').config();  // 連環境參數
const port = process.env.PORT || 3000;
const express = require('express');  // 連express

// 呼叫它，拿到express的實體
const app = express(); 

// 在 Express 中使用範本引擎ejs(把「呈現」和「邏輯處理」分開，易於管理。)
// 放在所有路由的前面，需要建立一個views資料夾
app.set('view engine', 'ejs'); 

// 將body-parser 設定成頂層middleware，放在所有路由之前。
// 包含兩種解析功能：urlencoded和json
app.use(express.urlencoded({extended:false})); //bodyparser可放頂層，因為很輕巧
app.use(express.json()); //看檔頭決定哪個會運作 json類型又是post

// 靜態內容通常放前面
app.use(express.static(__dirname + '/../public')); 

//---------- 定義路由開始 (路由一定是/開頭)---------- 
app.get('/',(req, res)=>{ 
    // 用get方法發送的req，必須路徑跟方法都符合
    // res.send('hello'); //send是html
    //home不用副檔名
    res.render('home', {name: 'Jessica'}); 
});
app.get('/json-test',(req, res)=>{
    const d = require(__dirname + '/../data/sales'); 
    res.render('json-test',{sales:d});

});

app.get('/try-qs', (req, res)=>{
    res.json(req.query);
});

// form01.html (5/31)
// bodyparser放底層的寫法: middleware = 中介軟體，express底下掛的一個方法urlencoded
// const urlencodedParser = express.urlencoded({extended:false}); //用qs功能的話寫true
// app.post('/try-post', urlencodedParser, (req, res)=>{ // 路由.方法 (path, middleware,處理的callback fcn ) 
//     res.json(req.body); // 有middleware才會有東西，從req那邊做解析，放到req.body裡
// });

app.post('/try-post', (req, res)=>{ // 路由.方法 (path, middleware,處理的callback fcn ) 
    res.json(req.body); // 有middleware才會有東西，從req那邊做解析，放到req.body裡
});

// 路徑一樣，方法不同 get post
app.get('/try-post-form', (req, res)=>{ 
    res.render('try-post-form', {email:'', password:''});
    
});
app.post('/try-post-form', (req, res)=>{ 
    res.render('try-post-form', req.body); 
    
});

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