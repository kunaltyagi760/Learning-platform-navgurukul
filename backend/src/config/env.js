const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5000,
  DB_URI: process.env.DB_URI || 'mongodb://127.0.0.1:27017/learning_platform',
  JWT_SECRET: process.env.JWT_SECRET || 'replace_this_secret',
};
