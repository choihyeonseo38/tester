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

// app.get("/:channelName", function (req, res) {
//   const { channelName } = req.params;
//   console.log(channelName);
//   if (channelName == "침착맨") {
//     res.json(youtuber1);
//   } else if (channelName == "테오") {
//     res.json(youtuber2);
//   } else if (channelName == "뜬뜬") {
//     res.json(youtuber3);
//   } else {
//     res.json({ message: "모르는 유튜버입니다." });
//   }
// });

let youtuberDb = new Map();
youtuberDb.set(1, youtuber1);
youtuberDb.set(2, youtuber2);
youtuberDb.set(3, youtuber3);

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

app.listen(3000);