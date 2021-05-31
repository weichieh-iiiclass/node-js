require('dotenv').config();  // 連環境參數
const port = process.env.PORT || 3000;
const express = require('express');  // 連express

// 呼叫它，拿到express的實體
const app = express(); 

// 在 Express 中使用範本引擎ejs(把「呈現」和「邏輯處理」分開，易於管理。)
// 放在所有路由的前面，需要建立一個views資料夾
app.set('view engine', 'ejs'); 

// 靜態內容通常放前面
// 參考:https://ithelp.ithome.com.tw/articles/10186000
// public會變成網站的根目錄(所以public內的檔案可以直接接在localhost:3000/後面)
// 寫法1:因為啟動server的路徑在最外層，往下看剛好看到public
// app.use(exprss.static('public')); 
// 寫法2:確實指定路徑寫法
app.use(express.static(__dirname + '/../public')); 

//---------- 定義路由開始 (路由一定是/開頭)---------- 
// express的路由，先定義的優先
app.get('/',(req, res)=>{ 
    // 用get方法發送的req，必須路徑跟方法都符合
    // res.send('hello'); //send是html
    //home不用副檔名
    res.render('home', {name: 'Jessica'}); 
});
app.get('/json-test',(req, res)=>{
    const d = require(__dirname + '/../data/sales'); //會轉成原生的物件或陣列，附檔名可省略
    // res.json(d);
    res.render('json-test',{sales:d});

});

app.get('/try-qs', (req, res)=>{
    res.json(req.query);
});

//404路由定義，要放在所有路由的後面，避免蓋到其他的設定
app.use((req, res) =>{ 
    // use允許所有http的方法，是屬於express的方法
    res.type('text/html');
    res.status(404);
    res.send('404 - 找不到網頁'); 
});
// -------------- ------ 定義路由結束----------------- --- 
app.listen(port, ()=>{
    console.log(`server started ${port}`);
});