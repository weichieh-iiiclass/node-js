require('dotenv').config(); //載入設定檔，放最前面
const port = process.env.PORT || 3000; //如果有設定PORT就用PORT值，沒有就用3000
// env設定檔不能有空白跟雙引號，全部都字串


const express = require('express'); // 如果用http原本的語法去寫，會寫很多麻煩的內容，所以用express
const app = express(); //呼叫它，拿到express的實體

//去定義路由
app.get('/',(req, res)=>{
    res.send('Hello');
});

app.listen(port, ()=>{
    console.log(`server started ${port}`);
});