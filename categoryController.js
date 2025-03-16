const conn = require("../mysql");
const { StatusCodes } = require("http-status-codes");

// 회원가입
const users = (req, res) => {
  const sql = `SELECT * FROM users;`;

  conn.query(sql, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: `Error: ${err.code}`,
      });
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = { users };
