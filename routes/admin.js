var express = require('express');
var router = express.Router();
// middleware
var multer = require('multer');
var upload = multer({});
// daos
var ProductDAO = require('../daos/ProductDAO.js');
var AdminDAO = require('../daos/AdminDAO.js');
var OrderDAO = require('../daos/OrderDAO.js');
// routes
router.get('/', function (req, res) {
  res.redirect('/admin/login');
});

router.get('/login', function (req, res) {
  res.render('admin/login.ejs');
});

router.post('/login', async function (req, res) {
  var username = req.body.txtUsername;
  var password = req.body.txtPassword;
  var admin = await AdminDAO.get(username, password);
  if (admin) {
    req.session.admin = admin;
    res.redirect('/admin/home');
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/home', function (req, res) {
  if (req.session.admin) {
    res.render('admin/home.ejs');
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/addproduct', function (req, res) {
  res.render('admin/addproduct.ejs');
});

router.post('/addproduct', upload.single('fileImage'), async function (req, res) {
  var name = req.body.txtName;
  var price = parseInt(req.body.txtPrice);
  if (req.file) {
    var image = req.file.buffer.toString('base64');
    var product = { name: name, price: price, image: image };
    var result = await ProductDAO.insert(product);
    if (result) {
      res.send('Thành công!');
    } else {
      res.send('Thất bại!');
    }
  }
});

router.get('/listorders', async function (req, res) {
  var orders = await OrderDAO.getAll();
  var id = req.query.id; // /listorders?id=XXX
  var order = await OrderDAO.getDetails(id);
  res.render('admin/listorders.ejs', { orders: orders, order: order });
});

router.get('/updatestatus', async function (req, res) {
  var id = req.query.id;
  var status = req.query.status;
  var result = await OrderDAO.update(id, status);
  res.redirect('/admin/listorders');
});

module.exports = router;