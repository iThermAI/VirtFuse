const { createProxyMiddleware } = require('http-proxy-middleware');
const proxy = {
    target: 'http://flask_backend:5000',
    changeOrigin: true
}
const node_proxy = {
  target: 'http://node_backend:4000',
  changeOrigin: true
}
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware(proxy)
  );
  app.use(
    '/node',
    createProxyMiddleware(node_proxy)
  );
};