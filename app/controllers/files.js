const http = require('http');

const {makeError, makeErrorResponse, sendError, valsInBody} = require('./utilities.js');

const fileServerUrl = 'http://10.10.10.5';

const test = (req, res, next) => {
  res.status(200).json({
    folders: [],
  });
};

const getBaseFolders = (req, res, next) => {
  http.get(`${fileServerUrl}/api/folders.php`, (httpRes) => {
    parseHttpJSONResponse(req, res, next, httpRes);
  });
};

const getFolderList = (req, res, next) => {
  if (!('path' in req.body)){
    const error = makeErrorResponse(
      makeError("Required Data Not Provided", "Path not provided", 401)
    );
    sendError(error, res);
    return;
  }
  const path = encodeURIComponent(req.body.path);
  http.get(`${fileServerUrl}/api/fileList.php?path=${path}`, (httpRes) => {
    parseHttpJSONResponse(req, res, next, httpRes);
  });
};

const parseHttpJSONResponse = (req, res, next, httpRes) => {
  const { statusCode } = httpRes;
  const contentType = httpRes.headers['content-type'];

  let error = null;
  if (statusCode !== 200) {
    error = makeErrorResponse(
      makeError("File Server Error", "File server Responded with status code " + statusCode, 500)
    );
  } else if (!/^application\/json/.test(contentType)) {
    error = makeErrorResponse(
      makeError("File Server Error", `Invalid content-type. Expected application/json but received ${contentType}`, 500)
    );
  }

  if (error !== null){
    sendError(error, res);
    return;
  }

  httpRes.setEncoding('utf8');
  let rawData = "";
  httpRes.on('data', (chunk) => {
    rawData += chunk;
  });

  httpRes.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      res.status(200).json(parsedData);
    } catch (e) {
      const error = makeErrorResponse(
        makeError("File Server Error", `Invalid data received: ${e}`, 500)
      );
      sendError(error, res);
      return;
    }
  });

};

/**
 *
 * @param {Object} req Express Request Object
 * @param {Object} res Express Response Object
 *
 * This middleware requests a video from a web server operating on a file server.
 * The file server streams the video to the requester. This middleware acts as a
 * middleman between the file server and client. It receives the file server's
 * stream and then pipes the stream to the client.
 *
 * There are 4 possible responses from this function
 *
 * 206 - Everything is fine and the file will be streamed
 * 401 - The user didn't provide a path
 * 404 - The user provided path was not found on the file server
 * 500 - An unexpected status code was received by the server.
 */
const streamVideoFile = (req, res) => {
  if (!('path' in req.query)){
    res.status(401).end();
    return;
  }

  const path = encodeURIComponent(req.query.path);
  const url = `${fileServerUrl}/api/video.php?filepath=${path}`;

  // If the client requests a portion of the video other than the beginning
  // we need to get that portion from the headers of the request.
  let start = 0;
  let rangeEnd = 0;
  if ('range' in req.headers) {
    let range = req.headers.range.replace(/bytes=/, '').split("-");

    if (range[0]) {
      start = range[0];
    }

    if (range[1]){
      rangeEnd = range[1];
    }
  }

  // Here we request the video from the file server. We're passing the bytes
  // range as defined earlier in the script.
  http.get(url, {
      headers: {
        Range: 'bytes=' + start + "-",
      },
    },
    (streamRes) => {

      // If the client closes their connection, we will close the connection with the file server.
      req.on("close", () => {
        streamRes.destroy();
      });

      const { statusCode } = streamRes;

      // The file server will respond with 404 if the file doesn't exist on the server
      if (statusCode === 404) {
        res.status(404).end();
        return;
      }

      // If we receive something OTHER than 206, we will end the connection.
      // Code 206 is "partial content", referring to streamed video
      if (statusCode !== 206) {
        res.status(500).end();
        return;
      }

      // We assemble all of the aspects of the video stream
      // so that we can set the headers correctly
      const range = streamRes.headers['content-range'].split('/');
      const totalSize = range[1];

      const end = totalSize - 1;
      if (rangeEnd === 0){
        rangeEnd = start + 1024 * 1024 * 2;
      }

      res.status(206);
      res.append('Content-Range', 'bytes ' + start + '-' + end + '/' + totalSize)
      res.append('Accept-Ranges', 'bytes');
      res.append('Content-Length', rangeEnd - start + 1);
      res.append('Content-Type', 'video/mp4');

      streamRes.pipe(res);
    }
  );
};

/**
 *
 * @param {Object} req Express Request Object
 * @param {Object} res Express Response Object
 *
 * This middleware retrieves an image from a web server operating on a file server
 * and streams the response from that file server to the requester.
 *
 * There are 4 possible responses from this function
 *
 * 200 - Everything is fine and the file will be streamed
 * 401 - The user didn't provide a path
 * 404 - The user provided path was not found on the file server
 * 500 - An unexpected status code was received by the server.
 */
const getFile = (req, res) => {
  // We get the full path to the image file from they query parameters
  // If it doesn't exist, we throw an error.
  if (!('path' in req.query)){
    res.status(401).end();
    return;
  }

  const path = encodeURIComponent(req.query.path);
  const url = `${fileServerUrl}/api/getFile.php?filepath=${path}`;

  http.get(url, (httpRes) => {
    const { statusCode } = httpRes;

    // The file server will respond with 404 if the file doesn't exist on the server
    if (statusCode === 404) {
      res.status(404).end();
      return;
    }

    // If we receive something OTHER than 200, we will end the connection
    if (statusCode !== 200) {
      res.status(500).end();
      return;
    }

    // We get the content type from the file server and just pass it along
    // in the response
    const contentType = httpRes.headers['content-type'];
    res.set('Content-Type', contentType);

    // Here, we pipe the httpRes stream directly to the response stream
    httpRes.pipe(res);
  });

};

module.exports = {
  test,
  getBaseFolders,
  getFolderList,
  parseHttpJSONResponse,
  streamVideoFile,
  getFile,
};