// require('dotenv').config();
import dEnv from 'dotenv';

dEnv.config();
module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
};