import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FindAccount = () => {
    const [tab, setTab] = useState('id'); // 'id' | 'pw'

    // 아이디 찾기
    const [idName, setIdName] = useState('');
    const [idEmail, setIdEmail] = useState('');
    const [foundId, setFoundId] = useState('');
    const [idMsg, setIdMsg] = useState('');

    // 비밀번호 찾기
    const [pwName, setPwName] = useState('');
    const [pwLoginId, setPwLoginId] = useState('');
    const [pwEmail, setPwEmail] = useState('');
    const [tempPw, setTempPw] = useState('');
    const [pwMsg, setPwMsg] = useState('');

    const handleFindId = e => {
        e.preventDefault();
        setFoundId('');
        setIdMsg('');
        fetch('/api/user/find-id', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: idName, email: idEmail }),
        })
            .then(res => {
                if (res.status === 404) { setIdMsg('일치하는 회원정보를 찾을 수 없습니다.'); return null; }
                if (!res.ok) throw new Error();
                return res.text();
            })
            .then(data => { if (data) setFoundId(data); })
            .catch(() => setIdMsg('오류가 발생했습니다. 다시 시도해주세요.'));
    };

    const handleFindPw = e => {
        e.preventDefault();
        setTempPw('');
        setPwMsg('');
        fetch('/api/user/find-pw', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: pwName, loginId: pwLoginId, email: pwEmail }),
        })
            .then(res => {
                if (res.status === 404) { setPwMsg('일치하는 회원정보를 찾을 수 없습니다.'); return null; }
                if (!res.ok) throw new Error();
                return res.text();
            })
            .then(data => { if (data) setTempPw(data); })
            .catch(() => setPwMsg('오류가 발생했습니다. 다시 시도해주세요.'));
    };

    return (
        <div className="login-page">
            <div className="login-deco-left"></div>
            <div className="login-deco-right"></div>

            <div className="login-card">
                <Link to="/" className="login-logo" style={{ textDecoration: 'none' }}>
                    MAISON <span>ARTISAN</span>
                </Link>
                <p className="login-sub">계정 정보를 찾아드립니다</p>

                {/* 탭 */}
                <div className="join-type-wrap" style={{ marginBottom: 28 }}>
                    <button
                        type="button"
                        className={`join-type-btn${tab === 'id' ? ' active' : ''}`}
                        onClick={() => { setTab('id'); setFoundId(''); setIdMsg(''); }}
                    >
                        <span className="join-type-icon">🔍</span>
                        <span className="join-type-label">아이디 찾기</span>
                        <span className="join-type-desc">이름·이메일로 찾기</span>
                    </button>
                    <button
                        type="button"
                        className={`join-type-btn${tab === 'pw' ? ' active' : ''}`}
                        onClick={() => { setTab('pw'); setTempPw(''); setPwMsg(''); }}
                    >
                        <span className="join-type-icon">🔑</span>
                        <span className="join-type-label">비밀번호 찾기</span>
                        <span className="join-type-desc">임시 비밀번호 발급</span>
                    </button>
                </div>

                {tab === 'id' && (
                    <>
                        {foundId ? (
                            <div className="find-result-box">
                                <div className="find-result-label">회원님의 아이디</div>
                                <div className="find-result-value">{foundId}</div>
                                <div className="find-result-hint">일부 정보는 보안을 위해 마스킹 처리됩니다.</div>
                                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                                    <Link to="/login" className="login-btn" style={{ textDecoration: 'none', textAlign: 'center', flex: 1 }}>로그인하기</Link>
                                    <button type="button" className="login-btn" style={{ flex: 1, background: 'transparent', border: '1px solid var(--vanilla-dark)', color: 'var(--dark)' }} onClick={() => { setTab('pw'); setFoundId(''); }}>비밀번호 찾기</button>
                                </div>
                            </div>
                        ) : (
                            <form className="login-form" onSubmit={handleFindId}>
                                <div className="login-field">
                                    <label className="login-label">이름</label>
                                    <input className="login-input" type="text" placeholder="가입 시 입력한 이름" value={idName} onChange={e => setIdName(e.target.value)} required />
                                </div>
                                <div className="login-field">
                                    <label className="login-label">이메일</label>
                                    <input className="login-input" type="email" placeholder="가입 시 입력한 이메일" value={idEmail} onChange={e => setIdEmail(e.target.value)} required />
                                </div>
                                {idMsg && <p style={{ color: 'red', fontSize: 13, marginBottom: 8 }}>{idMsg}</p>}
                                <button type="submit" className="login-btn">아이디 찾기</button>
                            </form>
                        )}
                    </>
                )}

                {tab === 'pw' && (
                    <>
                        {tempPw ? (
                            <div className="find-result-box">
                                <div className="find-result-label">임시 비밀번호</div>
                                <div className="find-result-value">{tempPw}</div>
                                <div className="find-result-hint">로그인 후 즉시 비밀번호를 변경해주세요.</div>
                                <Link to="/login" className="login-btn" style={{ textDecoration: 'none', textAlign: 'center', display: 'block', marginTop: 20 }}>로그인하기</Link>
                            </div>
                        ) : (
                            <form className="login-form" onSubmit={handleFindPw}>
                                <div className="login-field">
                                    <label className="login-label">이름</label>
                                    <input className="login-input" type="text" placeholder="가입 시 입력한 이름" value={pwName} onChange={e => setPwName(e.target.value)} required />
                                </div>
                                <div className="login-field">
                                    <label className="login-label">아이디</label>
                                    <input className="login-input" type="text" placeholder="가입한 아이디" value={pwLoginId} onChange={e => setPwLoginId(e.target.value)} required />
                                </div>
                                <div className="login-field">
                                    <label className="login-label">이메일</label>
                                    <input className="login-input" type="email" placeholder="가입 시 입력한 이메일" value={pwEmail} onChange={e => setPwEmail(e.target.value)} required />
                                </div>
                                {pwMsg && <p style={{ color: 'red', fontSize: 13, marginBottom: 8 }}>{pwMsg}</p>}
                                <button type="submit" className="login-btn">임시 비밀번호 받기</button>
                            </form>
                        )}
                    </>
                )}

                <div className="login-footer" style={{ marginTop: 24 }}>
                    <Link to="/login" className="login-join-link">로그인</Link>
                    &nbsp;·&nbsp;
                    <Link to="/join" className="login-join-link">회원가입</Link>
                </div>
            </div>
        </div>
    );
};

export default FindAccount;
