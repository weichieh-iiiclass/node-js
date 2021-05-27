const Person = require(__dirname + '/Person.js'); //可以不要加副檔名 先js檔再json檔

// console.log(f1(8)); //引用不到function01.js的f1
// console.log(Person);


const p2 = new Person('Andy',27);



console.log(p2);
console.log('' + p2);
console.log(JSON.stringify(p2));