const conn = require("../mysql");
const { StatusCodes } = require("http-status-codes");

const addLike = (req, res) => {
  const { userId, likedUserId } = req.body;

  const sql = `INSERT INTO likes (user_id, liked_user_id) VALUES (?, ?);`;
  const values = [userId, likedUserId];

  conn.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: `Error: ${err.code}`,
      });
    }
    return res.status(StatusCodes.CREATED).json(results);
  });
};

const removeLike = (req, res) => {
  const { userId, likedUserId } = req.body;

  const sql = `DELETE FROM likes WHERE user_id=? AND liked_user_id=?;`;
  const values = [userId, likedUserId];

  conn.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: `Error: ${err.code}`,
      });
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = {
  addLike,
  removeLike,
};
