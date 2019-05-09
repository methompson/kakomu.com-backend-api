// We don't need this, per se, but the app will crash if sessions aren't
// installed, being a de facto enforcement of required packages
const session = require('express-session');

exports.initMessages = (req, res, next) => {
    if (req.session.errors){
        req.errors = req.session.errors;
    }

    req.session.errors = [];

    if (req.session.messages){
        req.messages = req.session.messages
    }

    req.session.messages = [];

    if (req.messages){
        console.log(req.messages);
    }

    next();
};

exports.addError = (req, err) => {
    req.session.errors.push({
        message: err,
        shown: false,
    });

    return true;
};

exports.addMessage = (req, msg) => {
    req.session.messages.push({
        message: msg,
        shown: false,
    });
};

function getMessages(source){
    let messages = [];
    source.forEach( (msg) => {
        messages.push(msg.message);
        messages.shown = true;
    });

    return messages;
}

exports.getErrors = (req) => {
    if (req.errors){
        return getMessages(req.errors);
    } else {
        return [];
    }
};

exports.getMessages = (req) => {
    if (req.messages){
        return getMessages(req.messages);
    } else {
        return [];
    }
};