const { StatusCodes } = require("http-status-codes");
const connection = require("../mysql");

const order = async (req, res) => {
  const conn = await connection();

  const { items, delivery, totalCounts, totalPrice, userId, firstBookTitle } =
    req.body;

  let deliveryId;
  let orderId;

  // 먼저 deliveries 테이블에 배송 데이터 추가
  const deliverySql = `INSERT INTO deliveries (address, receiver, contact)
                  VALUES (?, ?, ?);`;

  const deliveryValues = [
    delivery.address,
    delivery.receiver,
    delivery.contact,
  ];

  const [deliveryResults] = await conn.execute(deliverySql, deliveryValues);
  deliveryId = deliveryResults.insertId;

  // 이어서 orders 테이블에 주문 데이터 추가
  const orderSql = `INSERT INTO orders
                            (book_title, total_counts, total_price, user_id, delivery_id)
                            VALUES (?, ?, ?, ?, ?);`;
  const orderValues = [
    firstBookTitle,
    totalCounts,
    totalPrice,
    userId,
    deliveryId,
  ];

  const [orderResults] = await conn.execute(orderSql, orderValues);
  orderId = orderResults.insertId;

  // items(장바구니 id)로부터 book_id, counts 받아옴
  const getCartItemsSql = `SELECT book_id, counts FROM cart_items WHERE id IN (?);`;
  const [orderItems, fields] = await conn.query(getCartItemsSql, items);

  // 이어서 ordered_books 테이블에 주문의 전체 도서 데이터 추가
  const orderedBooksSql = `INSERT INTO ordered_books (order_id, book_id, counts)
                                  VALUES ?;`;
  let orderedBooksValues = [];
  orderItems.forEach((item) => {
    orderedBooksValues.push([orderId, item.bookId, item.counts]);
  });
  const [orderedBooksReults] = await conn.query(orderedBooksSql, [
    orderedBooksValues,
  ]);

  // 이어서 장바구니의 목록 삭제
  const deleteResults = await deleteCartItems(conn, items);

  // 모든 과정이 완료되었다면 OK 리턴
  return res.status(StatusCodes.OK).json(results);
};

const deleteCartItems = async (conn, items) => {
  const sql = `DELETE FROM cart_items WHERE id IN (?);`;

  return await conn.query(sql, items);
};

const getOrders = async (req, res) => {
  const conn = await connection();

  const sql = `SELECT orders.id, book_title, total_counts, total_price, created_at,
  address, receiver, contact
  FROM orders LEFT JOIN deliveries
  ON orders.delivery_id = deliveries.id;`;

  const [rows, fields] = await conn.query(sql);

  return res.status(StatusCodes.OK).json(rows);
};

const getOrderDetails = async (req, res) => {
  const { id } = req.params;

  const conn = await connection();

  const sql = `SELECT book_id, title, author, price, counts
  FROM ordered_books LEFT JOIN books
  ON ordered_books.book_id = books.id 
  WHERE order_id = ?;`;

  const [rows, fields] = await conn.query(sql, id);

  return res.status(StatusCodes.OK).json(rows);
};

module.exports = {
  order,
  getOrders,
  getOrderDetails,
};