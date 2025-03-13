const express = require("express");
const app = express();

const fruits = [
  { id: 1, name: "apple" },
  { id: 2, name: "banana" },
  { id: 3, name: "watermelon" },
  { id: 4, name: "strawberry" },
];

// 과일 전체 조회
app.get("/fruits", (req, res) => {
  res.json(fruits);
});

// 과일 개별 조회
app.get("/fruits/:id", (req, res) => {
  let { id } = req.params;
  //   var fruit = "";

  //   fruits.forEach((fruit) => {
  //     if (fruit.id == id) {
  //       fruit = res.json(fruit);
  //     }
  //   });

  var fruit = fruits.find((fruit) => fruit.id == id);

  if (fruit) {
    res.json(fruit);
  } else {
    res.status(404).send(`${id}에 해당되는 값이 없습니다.`);
  }

  res.json(fruit);
});

app.listen(3000);