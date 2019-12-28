const Post = require('./post.js');
const User = require('./user.js');

User.hasMany(Post);
Post.belongsTo(User);

module.exports = {
  Post,
  User,
};