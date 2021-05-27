//我們宣告了一個Person物件，用require方法載入/Person.js檔案，他會回傳一個物件
//Person.js可以不要加副檔名，它會自己抓，優先順序是先js檔再json檔
const Person = require(__dirname + '/Person.js');  //引入模組

const p2 = new Person('Andy',27); //使用new建立一個擁有Person類別的物件



console.log(p2);
console.log('' + p2);
console.log(JSON.stringify(p2));