const express = require("express");
const app = express();

// GET
app.get("/hello", function (req, res) {
  res.json({
    say: "안녕하세요",
  });
});

app.listen(3000);