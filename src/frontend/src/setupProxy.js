const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    // 일반 API 요청 프록시
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true,
        })
    );
    // OAuth2 소셜 로그인 시작 경로 (/oauth2/authorization 만 프록시, /oauth2/callback은 React 라우트이므로 제외)
    app.use(
        '/oauth2/authorization',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true,
        })
    );
    // OAuth2 콜백 처리 경로 (카카오/구글 → 백엔드 콜백)
    app.use(
        '/login/oauth2',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true,
        })
    );
    // 업로드 이미지 정적 파일 프록시
    app.use(
        '/uploads',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true,
        })
    );
};
