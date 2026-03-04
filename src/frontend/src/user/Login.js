import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = e => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        fetch('/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ loginId, pw: password }),
        })
            .then(res => {
                if (res.status === 401) {
                    setLoading(false);
                    setErrorMsg('아이디 또는 비밀번호가 올바르지 않습니다.');
                    return null;
                }
                if (!res.ok) throw new Error('서버 오류');
                return res.json();
            })
            .then(data => {
                if (!data) return;
                // JWT 토큰 저장
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                const userData = { userId: data.userId, userName: data.name, role: data.role };
                localStorage.setItem('user', JSON.stringify(userData));
                if (setUser) setUser(userData);
                navigate('/');
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
                setErrorMsg('로그인 중 오류가 발생했습니다.');
            });
    };

    return (
        <div className="login-page">
            <div className="login-deco-left"></div>
            <div className="login-deco-right"></div>

            <div className="login-card">
                <Link to="/" className="login-logo" style={{ textDecoration: 'none' }}>
                    MAISON <span>ARTISAN</span>
                </Link>
                <p className="login-sub">장인의 손끝에서 피어난 작품들</p>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label className="login-label">아이디</label>
                        <input
                            className="login-input"
                            type="text"
                            placeholder="아이디를 입력하세요"
                            value={loginId}
                            onChange={e => setLoginId(e.target.value)}
                        />
                    </div>
                    <div className="login-field">
                        <label className="login-label">비밀번호</label>
                        <input
                            className="login-input"
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <Link to="/find-account" className="login-forgot">비밀번호를 잊으셨나요?</Link>
                    </div>
                    {errorMsg && <p style={{ color: 'red', fontSize: 13, marginBottom: 8 }}>{errorMsg}</p>}
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? (
                            <span className="btn-loading">
                                <span className="btn-spinner"></span>
                                로그인 중...
                            </span>
                        ) : '로그인'}
                    </button>
                </form>

                <div className="login-divider"><span>또는</span></div>

                <div className="login-social">
                    <button
                        type="button"
                        className="social-login-btn kakao"
                        onClick={() => { window.location.href = '/oauth2/authorization/kakao'; }}
                    >
                        <span>💬</span> 카카오로 시작하기
                    </button>
                    <button
                        type="button"
                        className="social-login-btn google"
                        onClick={() => { window.location.href = '/oauth2/authorization/google'; }}
                    >
                        <span style={{ fontWeight: 900, fontSize: 14 }}>G</span> 구글로 시작하기
                    </button>
                </div>

                <div className="login-footer">
                    아직 회원이 아니신가요?&nbsp;
.                    <Link to="/join" className="login-join-link">회원가입</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
