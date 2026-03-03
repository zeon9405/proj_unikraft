import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const InquiryWrite = ({ user }) => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSecret, setIsSecret] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (!user) navigate('/login');
    }, [user, navigate]);

    const handleSubmit = e => {
        e.preventDefault();
        setErrorMsg('');
        if (!title.trim()) { setErrorMsg('제목을 입력해주세요.'); return; }
        if (!content.trim()) { setErrorMsg('내용을 입력해주세요.'); return; }

        api.post('/api/inquiry/write', { title, content, isSecret })
            .then(() => navigate('/inquiry'))
            .catch(() => setErrorMsg('문의 작성 중 오류가 발생했습니다.'));
    };

    if (!user) return null;

    return (
        <div className="login-page" style={{ alignItems: 'flex-start', paddingBottom: 80 }}>
            <div className="login-deco-left"></div>
            <div className="login-deco-right"></div>

            <div className="join-card">
                <Link to="/" className="login-logo" style={{ textDecoration: 'none' }}>
                    MAISON <span>ARTISAN</span>
                </Link>
                <p className="login-sub">문의 작성</p>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label className="login-label">제목</label>
                        <input
                            className="login-input"
                            type="text"
                            placeholder="문의 제목을 입력하세요"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="login-field">
                        <label className="login-label">내용</label>
                        <textarea
                            className="login-input"
                            placeholder="문의 내용을 상세히 입력해주세요"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            style={{ resize: 'vertical', minHeight: 180 }}
                        />
                    </div>
                    <div className="login-field">
                        <label className="join-agree-item" style={{ cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                className="join-checkbox"
                                checked={isSecret}
                                onChange={e => setIsSecret(e.target.checked)}
                            />
                            <span>🔒 비밀글로 작성 (본인만 열람 가능)</span>
                        </label>
                    </div>

                    {errorMsg && <p style={{ color: 'red', fontSize: 13, marginBottom: 8 }}>{errorMsg}</p>}

                    <div style={{ display: 'flex', gap: 12 }}>
                        <button type="submit" className="login-btn" style={{ flex: 1 }}>작성하기</button>
                        <button type="button" className="login-btn"
                            style={{ flex: 1, background: 'transparent', border: '1px solid var(--vanilla-dark)', color: 'var(--dark)' }}
                            onClick={() => navigate('/inquiry')}
                        >취소</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InquiryWrite;
