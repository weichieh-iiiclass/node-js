
require('dotenv').config();  // 連環境參數
const port = process.env.PORT || 3000;
const express = require('express');  // 連express
const session = require('express-session');

express.weichieh = '嗨嗨';

// const multer = require('multer');
// const upload = multer({dest:'tmp_uploads/'}); //設定暫存的資料夾
// const {v4: uuidv4} = require('uuid'); //把v4改名為uuidv4
const upload = require(__dirname + '/modules/upload-img'); 

const fs = require('fs');

const app = express(); 

app.set('view engine', 'ejs'); 

app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: 'lgheuifunldaoiewaifebwfoweafewd', //加密cookie
    cookie: { //這裡指的是存放在cookie裡的sessionid
        maxAge: 1200000,
    }
}));
app.use(express.urlencoded({extended:false})); 
app.use(express.json()); 

// 靜態內容通常放前面
app.use(express.static(__dirname + '/../public')); //前面省略根目錄

// 全域的middleware，因為要用到session所以要放在app.use(session)後面
// 進到middleware先設定res.locals
// middle 過濾器: 拿到req,res，針對這兩個加工，第一個完成之後給第二個middle
app.use((req, res, next)=>{
    // res.locals = { 
    //     email: '全域的middleware: email',
    //     password: '全域的middleware: password',
    // }; 

    // 有登入的話把資料傳給templates的admin變數，沒登入會是空物件
    // 因為是在全域，所以後面的路由都會吃到這個設定
    res.locals.admin = req.session.admin || {}; //把登入的管理者資料放到locals傳給templates
    next(); //不加的話會pending
});

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
    //會進到templates的變數都會掛在locals身上，templates是回應給客戶的樣板，所以掛在res身上
    // res.locals = { 
    //     email: '這是預設email',
    //     password: '這是預設password',
    // }
    // res.render('try-post-form', {email:'', password:''});
    res.render('try-post-form');
    
});
app.post('/try-post-form', (req, res)=>{ 
    res.render('try-post-form', req.body); 
    
});

// 在原本的/try-upload路由新增一個get
app.get('/try-upload', (req, res)=>{
    res.render('try-upload');
});

// 上傳的欄位名稱叫avatar，single最多一次上傳一個檔案
app.post('/try-upload', upload.single('avatar'), async (req, res)=>{
    console.log(req.file);
    res.json({
           filename: req.file && req.file.filename,
           body: req.body,
        });
});

// 上傳的欄位名稱叫photo，array最多一次上傳6個檔案
app.post('/try-uploads', upload.array('photo', 6), (req, res)=>{
    console.log(req.files);
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

// i: case ignore,-?:選擇性的
app.get(/\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res)=>{
    // res.json(req.params);
    let u = req.url.slice(3); //去除/m/
    u = u.split('?')[0];        //去除query string ?後面的東西
    u = u.replace(/-/g, ''); //去除global的-
    // u = u.split('-').join('');  // 去除-
    res.send(`<h2>${u}</h2>`);
});

// app.use(require(__dirname + '/routes/admin2')); //簡寫成一行但可讀性差
const admin2 = require(__dirname + '/routes/admin2');
app.use('/admin3',admin2); // 講義路由模組化方式三:使用use，前面可以自己多加一個路徑，後面接admin.js設定的路由，因此可以方便管理
app.use(admin2); //走原路，相當於app.use('/', admin2); ，前面是根目錄

app.get('/try-sess', (req, res)=>{
    req.session.my_var = req.session.my_var || 0;
    req.session.my_var ++;
    res.json({
        my_var: req.session.my_var,
        session: req.session,
    })
});

app.get('/login', (req, res)=>{
    if(req.session.admin){ //如果admin不是undefined，已登入
        res.redirect('/');
    } else {
        res.render('login');
    }
});
app.post('/login', (req, res)=>{
    const accounts = {
        wei: {
            nickname: '小倢',
            pw: 'wei',
        },
        sun: {
            nickname: '晴晴',
            pw: 'sun',
        },
    };
    const output = {
        success: false,
        code: 0, //除錯方便追蹤
        error: '帳號或密碼錯誤',
        body: req.body, //除錯檢查
    }

    // 有沒有值是不是個物件, 有沒有account這個欄位, 把這個帳號當作key丟到accounts就會拿到那個物件，代表帳號比對ok
    if(req.body && req.body.account && accounts[req.body.account]){
        output.code = 100;
        const item = accounts[req.body.account];
        // 密碼核對ok //&&邏輯運算子(只有not優先權最高)，===關係運算子(優先權比較高，會先做)
        if(req.body.password && req.body.password===item.pw){ 
            
            req.session.admin = {
                account: req.body.account,
                ...item, //copy,nickname&password都會進來
            }
            output.success = true;
            output.error = '';
            output.code = 200; //這邊的自訂義200跟網頁定義的200(頁面正常就會是200)不同

        }
    }

    res.json(output);
});
app.get('/logout', (req, res)=>{
    //刪除req.session的admin屬性
    delete req.session.admin;
    res.redirect('/'); //轉向頁面，後面不該出現res.send,end,render等
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