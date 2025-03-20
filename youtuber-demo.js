const express = require("express");
const app = express();

let youtuber1 = {
  channelTitle: "침착맨",
  sub: "274만명",
  videoNum: "7.4천개",
};

let youtuber2 = {
  channelTitle: "테오",
  sub: "124만명",
  videoNum: "1.2천개",
};

let youtuber3 = {
  channelTitle: "뜬뜬",
  sub: "253만명",
  videoNum: "292개",
};

let youtuberDb = new Map();

let id = 1;
youtuberDb.set(id++, youtuber1);
youtuberDb.set(id++, youtuber2);
youtuberDb.set(id++, youtuber3);

app.get("/youtuber/:id", function (req, res) {
  let { id } = req.params;
  id = parseInt(id);

  if (youtuberDb.get(id) == undefined) {
    res.json({ message: "모르는 유튜버입니다." });
  } else {
    var youtuber = youtuberDb.get(id);
    youtuber["id"] = id;

    res.json(youtuber);
  }
});

app.get("/youtubers", function (req, res) {
  let youtubers = {};

  if (youtuberDb.size > 0) {
    youtuberDb.forEach((val, idx) => (youtubers[idx] = val));
    res.json(youtubers);
  } else {
    res.status(404).json({
      message: "조회할 유튜버가 없습니다",
    });
  }
});

app.use(express.json());
app.post("/youtubers", function (req, res) {
  const channelTitle = req.body.channelTitle;
  if (channelTitle) {
    youtuberDb.set(id, req.body);

    res.status(201).json({
      message: youtuberDb.get(id++).channelTitle + "님이 추가되었습니다.",
    });
  } else {
    res.status(400).json({
      message: "유튜버 정보를 정확히 입력해주세요",
    });
  }
});

app.delete("/youtubers/:id", function (req, res) {
  let { id } = req.params;
  id = parseInt(id);

  let youtuber = youtuberDb.get(id);
  if (youtuber) {
    res.json({
      message: `id ${id}에 해당되는 유튜버가 없습니다.`,
    });
  } else {
    const channelTitle = youtuber.channelTitle;
    youtuberDb.delete(id);

    res.json({
      message: `${channelTitle}님이 삭제되었습니다.`,
    });
  }
});

app.delete("/youtubers", function (req, res) {
  if (youtuberDb.size == 0) {
    res.json({
      message: "유튜버가 존재하지 않습니다.",
    });
  } else {
    youtuberDb.clear();
    res.json({
      message: "전체 유튜버가 초기화되었습니다.",
    });
  }
});

app.put("/youtuber/:id", function (req, res) {
  let { id } = req.params;
  id = parseInt(id);

  let youtuber = youtuberDb.get(id);
  if (youtuber) {
    res.json({
      message: `id ${id}에 해당되는 유튜버가 없습니다.`,
    });
  } else {
    let channelTitle = youtuber.channelTitle;
    youtuberDb.set(id, req.body);

    res.json({
      message: `${channelTitle}님의 정보가 수정되었습니다..`,
    });
  }
});

app.listen(3000);