const router = require('koa-router')();
const {upload} = require('../controller/home');

router.put("/upload",upload);
module.exports = router;