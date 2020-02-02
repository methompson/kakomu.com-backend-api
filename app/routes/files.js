const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const filesController = require('../controllers/files');
const { getTokenFromCookies, getTokenFromHeaders, authenticateToken } = require('../controllers/auth.js');

const router = express.Router();

// These paths will be reached via AJAX requests
router.get(
  '/',
  bodyParser.json(),
  getTokenFromHeaders,
  authenticateToken,
  filesController.getBaseFolders
);

router.post(
  '/folder',
  bodyParser.json(),
  getTokenFromHeaders,
  authenticateToken,
  filesController.getFolderList
);

// These paths will be reached via browser get requests
router.get(
  '/video',
  // cookieParser(),
  // getTokenFromCookies,
  // authenticateToken,
  filesController.streamVideoFile
);
router.get(
  '/file',
  // cookieParser(),
  // getTokenFromCookies,
  // authenticateToken,
  filesController.getFile
);

module.exports = router;