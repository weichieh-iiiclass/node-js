// 注意非同步問題
// 同步的API後面會有Sync(python PHP都是同步，都有多執行緒)
// 我們使用非同步的API，才能避免卡住的問題
const http = require('http'),
        fs  = require('fs');


//錯誤先行 
const server = http.createServer((req, res)=>{
    fs.writeFile(
        __dirname + '/headers01.txt', //path
        JSON.stringify(req.headers),
        error =>{
            if(error){
                console.log(error);
                return;
            } else {
                res.end('ok');
            }
        }
    )

});

server.listen(3000); 