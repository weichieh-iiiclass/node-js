// 參考: https://ithelp.ithome.com.tw/articles/10185302
const http = require('http');  // 1 - 載入 Node.js 原生模組 http


// 2 - 建立server
const server = http.createServer((req, res)=>{ 
    // cb fnc(request[=incomming msg], response[=server response]) 
    // 在此處理 客戶端向 http server 發送過來的 req
    res.writeHead(200, { //200是狀態碼，網頁ok的意思
        'Content-Type': 'text/html', //headers的設定
        'Jessica': 'jessica'
        // 'Content-Type': 'text/plain' //顯示純文字

    }); //ser告訴用戶端的內容

    res.end(`
    <h2>Hola </h2>
    <p>${req.url}</p>
    `)
});

server.listen(3000); //3 - 進入此網站的監聽 port, 就是 localhost:xxxx 的 xxxx
 //通常使用3000~5000  不要1024以下


// 程式會跟作業系統註冊port num
// 用法是先佔先贏，被用走的就不能用
// 1024以下會有既定的通訊協定在用
// mysql 3306
// 連到哪個port就會知道是哪個程式
// server: web, database ...
// port num: 像銀行特定承辦業務的窗口編號

// network
// 重新整理會有兩個檔案，點進去會看到headers...
// http 協定: 先有req 才有res
// headers: request header 瀏覽器發出去的要求


// 執行機器碼，已經和原始碼脫離關係，所以必須重啟terminal
// 可用nodemon來解決這個不方便的動作，用nodemon來啟動node 
// (正式環境推薦用PM2可以背景執行，開發可用nodemon)
// npm install pm2 -g
// pm2 ls
// pm2 stop 0
// pm2 del 0