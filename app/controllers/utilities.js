// This generates a standardized error message that I can use in responses to the
// browser. Message should be a simple explanation of what happened. E.g. "Post
// Not Created". Error should be why. E.g. "Invalid Credentials". httpStatus
// is an error status code.
function makeError(message, error, httpStatus){
  const er = new Error(message);
  er.status = httpStatus;
  er.error = error;
  return er;
}

// Companion function to makeError. Makes an error object to send to browsers
// right before they're sent to the browser. This functions is cautious about
// whether the error sent to it was made by the makeError function or by another
// promise in the chain.
function makeErrorResponse(err){
  let error;

  if ( 'status' in err
    && 'message' in err
    && 'error' in err
  ){
    error = {
      status: err.status,
      message: err.message,
      error: err.error,
    };
  } else {
    error = {
      status: 500,
      message: "Server Error",
      error: err,
    };
  }

  return error;
};

function sendError(err, res){
  const error = makeErrorResponse(err);

  return res.status(error.status).json({
    error: error.error,
    message: error.message,
  });
}

// This function takes an array of values and checks for their existence in
// an object.
function valsInBody(obj, values){
  // Let's do some type checking
  if (typeof obj !== typeof {} || !Array.isArray(values)){
    return false;
  }

  // Cycle through all values, see if any aren't in obj
  for (let x = 0; x < values.length; ++x){
    if (!(values[x] in obj)){
      return false;
    }
  }

  return true;
}

module.exports = {
  makeError,
  makeErrorResponse,
  sendError,
  valsInBody,
};