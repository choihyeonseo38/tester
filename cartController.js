const conn = require("../mysql");
const { StatusCodes } = require("http-status-codes");

// 장바구니 추가
const addCartItems = (req, res) => {
  const { book_id, counts, user_id } = req.body;

  const sql = `INSERT INTO cart_items (book_id, counts, user_id) VALUES (?, ?, ?);`;
  const values = [book_id, counts, user_id];

  conn.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: `Error: ${err.code}`,
      });
    }
    return res.status(StatusCodes.CREATED).json(results);
  });
};

// 장바구니 아이템 목록 조회
const getCartItems = (req, res) => {
  const { user_id, selected } = req.body;

  const sql = `SELECT cart_items.id, book_id, title, summary, counts, price 
                FROM cart_items LEFT JOIN books 
                ON cart_items.book_id = books.id
                WHERE user_id = ? AND cart_items.id IN (?);`;
  const values = [user_id, selected];

  conn.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: `Error: ${err.code}`,
      });
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

// 장바구니 제거
const removeCartItems = (req, res) => {
  const { id } = req.body;

  const sql = `DELETE FROM cart_items WHERE id = ?;`;
  const values = [id];

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
  addCartItems,
  getCartItems,
  removeCartItems,
};