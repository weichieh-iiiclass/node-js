const f1 = a => a*a;

console.log(f1(9));
console.log(__dirname);
// 想讓別人看到的放在module
module.export = f1;