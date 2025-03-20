const express = require("express");
const app = express();
app.listen(3000);
app.use(express.json());

let userDb = new Map();
var id = 1;

// 1. 로그인
app.post("/login", (req, res) => {
  let body = req.body;
  let userId = body.id;
  let password = body.password;
  let loginUser = {};

  // 정보가 누락된 경우 예외 처리
  if (!userId) {
    res.status(400).json({
      message: "id가 포함되어있지 않습니다.",
    });
  } else if (!password) {
    res.status(400).json({
      message: "password가 포함되어있지 않습니다.",
    });
  } else {
    userDb.forEach((val, idx) => {
      if (val.id === userId) {
        loginUser = val;
      }
    });

    if (Object.keys(loginUser).length !== 0) {
      if (loginUser.password === password) {
        res.json({
          message: `${loginUser.name}님 환영합니다!`,
        });
      } else {
        res.json({
          message: "패스워드가 일치하지 않습니다",
        });
      }
    } else {
      res.json({
        message: "아이디가 일치하지 않습니다.",
      });
    }
  }
});

// 2. 회원가입
app.post("/join", (req, res) => {
  let body = req.body;
  let userId = body.id;
  let password = body.password;
  let userName = body.name;

  let isIdDuplicated = false;
  for (let value of userDb.values()) {
    if (value.id === userId) {
      isIdDuplicated = true;
      break;
    }
  }

  // 정보가 누락된 경우 예외 처리
  if (!userId) {
    res.status(400).json({
      message: "id가 포함되어있지 않습니다.",
    });
  } else if (!password) {
    res.status(400).json({
      message: "password가 포함되어있지 않습니다.",
    });
  } else if (!userName) {
    res.status(400).json({
      message: "name이 포함되어있지 않습니다.",
    });
  }
  // 중복된 id인 경우 예외 처리
  else if (isIdDuplicated) {
    res.status(400).json({
      message: "이미 가입되어있는 id입니다.",
    });
  } else {
    userDb.set(id++, body);
    res.status(201).json({
      message: `${userName}님 환영합니다`,
    });
  }
});

// 3. 회원 개별 조회
app.get("/users/:id", (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  const user = userDb.get(id);

  if (user) {
    res.json({
      userId: user.id,
      name: user.name,
    });
  } else {
    res.status(404).json({
      message: `${id}에 해당되는 유저가 없습니다.`,
    });
  }
});

// 4. 회원 개별 탈퇴
app.delete("/users/:id", (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  const user = userDb.get(id);

  if (user) {
    userDb.delete(id);
    res.json({
      message: `${user.name}님이 탈퇴되었습니다.`,
    });
  } else {
    res.status(404).json({
      message: `${id}에 해당되는 유저가 없습니다.`,
    });
  }
});