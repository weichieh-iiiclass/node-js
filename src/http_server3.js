const http = require('http'),
        fs  = require('fs');


//async(包promises)
const server = http.createServer(async(req, res)=>{
    try{
        await fs.promises.writeFile(__dirname + '/headers02.txt', JSON.stringify(req.headers) ); //fs...;是一個promise物件
        res.end('ok');
    }
    catch(ex){
        res.end('err' + ex);
    }
    
});

server.listen(3000); 