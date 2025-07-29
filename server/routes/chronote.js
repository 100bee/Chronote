// server/routes/chronote.js
const express = require('express');
const router = express.Router();
const user_info = require('../controller/Cuser_info');

router.post('/signup', user_info.userRegister);
router.post('/login', user_info.userLogin);
router.post('/check-userid', user_info.checkUserId);
router.post('/check-nickname', user_info.checkUserName);

module.exports = router;
