const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "youtube",
  timezone : 'Asia/Seoul',
  password: "0000", // 비밀번호 입력
  dataString : true
});

connection.query(
    'SELECT * FROM users',
    function(err, results, fileds){
      var {id,email,name, created_at} = results[0];
        console.log(results[0].id);
        console.log(results[0].email);
        console.log(results[0].name);
        console.log(results[0].created_at);
        console.log(fileds);
    }
);