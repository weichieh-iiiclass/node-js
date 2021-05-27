// node_modules, package-lock.json, .env檔不要上傳到gitHub
require('dotenv').config();

const {MY_USER, MY_DBNAME} = process.env;

console.log({MY_USER, MY_DBNAME});