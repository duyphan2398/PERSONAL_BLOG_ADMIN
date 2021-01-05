'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ENDPOINT: '"https://tnguyenofficial-blog.herokuapp.com/api/cms"',
  USER_API_ENDPOINT: '"https://tnguyenofficial-blog.herokuapp.com/api/cms"',
  WEB_ENDPOINT: '"https://tnguyenofficial-blog.herokuapp.com/api/cms"',

  // API_ENDPOINT: '"http://personal_blog_api.test/api/cms"',
  // USER_API_ENDPOINT: '"http://personal_blog_api.test/api/cms"',
  // WEB_ENDPOINT: '"http://personal_blog_api.test/api/cms"',
  CLIENT_ENV: '"development"'
})
