const conn = require("../mysql");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();

// 회원가입
const userJoin = (req, res) => {
  const { email, password } = req.body;

  // 비밀번호 암호화
  const salt = crypto.randomBytes(10).toString("base64");
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");

  const sql = `INSERT INTO users (email, password, salt) VALUES (?, ?, ?);`;
  const values = [email, hashPassword, salt];

  conn.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: `Error: ${err.code}`,
      });
    }
    return res.status(StatusCodes.CREATED).json(results);
  });
};

// 로그인
const userLogin = (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM users WHERE email = ?;`;
  const values = email;

  conn.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: `Error: ${err.code}`,
      });
    }
    const loginUser = results[0];

    const salt = loginUser.salt;
    const hashPassword = crypto
      .pbkdf2Sync(password, salt, 10000, 10, "sha512")
      .toString("base64");

    if (loginUser && hashPassword == loginUser.password) {
      const token = jwt.sign(
        {
          email: loginUser.email,
        },
        process.env.PRIVATE_KEY,
        {
          expiresIn: "5m",
          issuer: "user",
        }
      );
      res.cookie("token", {
        httpOnly: true,
      });
      return res.status(StatusCodes.OK).json(results);
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
};

// 비밀번호 초기화 요청
const userPasswordResetRequest = (req, res) => {
  const { email } = req.body;
  const sql = `SELECT * FROM users WHERE email = ?;`;
  const values = email;

  conn.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: `Error: ${err.code}`,
      });
    }
    const user = results[0];
    if (user) {
      return res.status(StatusCodes.OK).json({
        email: email,
      });
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
};

// 비밀번호 초기화
const userPasswordReset = (req, res) => {
  const { email, password } = req.body;

  const salt = crypto.randomBytes(10).toString("base64");
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");

  const sql = `UPDATE users SET password = ?, salt = ? WHERE email = ?;`;
  const values = [hashPassword, salt, email];

  conn.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: `Error: ${err.code}`,
      });
    }
    if (results.affectedRows == 0) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    } else {
      return res.status(StatusCodes.OK).json(results);
    }
  });
};

module.exports = {
  userJoin,
  userLogin,
  userPasswordResetRequest,
  userPasswordReset,
};
