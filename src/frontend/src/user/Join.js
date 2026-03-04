import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { uploadUserImage } from '../api';

const PW_RULES = [
    { key: 'length',  label: '8자 이상',     test: v => v.length >= 8 },
    { key: 'letter',  label: '영문 포함',     test: v => /[a-zA-Z]/.test(v) },
    { key: 'number',  label: '숫자 포함',     test: v => /[0-9]/.test(v) },
    { key: 'special', label: '특수문자 포함', test: v => /[!@#$%^&*\-_=+,.?]/.test(v) },
];

const STRENGTH = ['', 'weak', 'weak', 'medium', 'strong'];
const STRENGTH_LABEL = { weak: '약함', medium: '보통', strong: '강함' };

const Join = () => {
    const [memberType, setMemberType] = useState('buyer');
    const [name, setName] = useState('');
    const [loginId, setLoginId] = useState('');
    const [idChecked, setIdChecked] = useState(false);
    const [idCheckMsg, setIdCheckMsg] = useState('');
    const [pw, setPw] = useState('');
    const [pwConfirm, setPwConfirm] = useState('');
    const [email, setEmail] = useState('');
    const [tel, setTel] = useState('');
    const [brand, setBrand] = useState('');
    const [major, setMajor] = useState('');
    const [contents, setContents] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [imgPreview, setImgPreview] = useState('');
    const [agree1, setAgree1] = useState(false);
    const [agree2, setAgree2] = useState(false);
    const [agree3, setAgree3] = useState(false);
    const [categories, setCategories] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const passCount = pw ? PW_RULES.filter(r => r.test(pw)).length : 0;
    const strengthLevel = STRENGTH[passCount];
    const strengthLabel = STRENGTH_LABEL[strengthLevel] || '';

    useEffect(() => {
        fetch('/api/category/all')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error('카테고리 로드 실패:', err));
    }, []);

    const handleLoginIdChange = (e) => {
        setLoginId(e.target.value);
        setIdChecked(false);
        setIdCheckMsg('');
    };

    const handleCheckId = () => {
        if (!loginId.trim()) {
            setIdCheckMsg('아이디를 입력하세요.');
            return;
        }
        fetch(`/api/user/check-id/${loginId}`)
            .then(res => res.json())
            .then(isDuplicate => {
                if (isDuplicate) {
                    setIdChecked(false);
                    setIdCheckMsg('이미 사용 중인 아이디입니다.');
                } else {
                    setIdChecked(true);
                    setIdCheckMsg('사용 가능한 아이디입니다.');
                }
            })
            .catch(() => setIdCheckMsg('중복 확인 중 오류가 발생했습니다.'));
    };

    const handleImgChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setImgPreview(URL.createObjectURL(file));
            const url = await uploadUserImage(file);
            setImgUrl(url);
        }
    };

    const handleSubmit = e => {
        e.preventDefault();
        setErrorMsg('');

        if (passCount < 4) {
            setErrorMsg('비밀번호 규칙을 모두 충족해주세요.');
            return;
        }
        if (pw !== pwConfirm) {
            setErrorMsg('비밀번호가 일치하지 않습니다.');
            return;
        }
        if (!idChecked) {
            setErrorMsg('아이디 중복 확인을 완료해주세요.');
            return;
        }
        if (!agree1 || !agree2) {
            setErrorMsg('필수 약관에 동의해주세요.');
            return;
        }

        setLoading(true);
        const role = memberType === 'artisan' ? 1 : 0;

        fetch('/api/user/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                loginId,
                pw,
                email,
                tel,
                role,
                major: memberType === 'artisan' ? major : '',
                brand: memberType === 'artisan' ? brand : '',
                contents: memberType === 'artisan' ? contents : '',
                imgUrl: imgUrl,
            }),
        })
            .then(res => {
                if (!res.ok) throw new Error('회원가입 실패');
                navigate('/login');
            })
            .catch(() => {
                setLoading(false);
                setErrorMsg('회원가입 중 오류가 발생했습니다.');
            });
    };

    return (
        <div className="login-page" style={{ alignItems: 'flex-start', paddingBottom: 80 }}>
            <div className="login-deco-left"></div>
            <div className="login-deco-right"></div>

            <div className="join-card">
                <Link to="/" className="login-logo" style={{ textDecoration: 'none' }}>
                    MAISON <span>ARTISAN</span>
                </Link>
                <p className="login-sub">새로운 계정을 만들어보세요</p>

                {/* 회원 유형 선택 */}
                <div className="join-type-wrap">
                    <button
                        type="button"
                        className={`join-type-btn${memberType === 'buyer' ? ' active' : ''}`}
                        onClick={() => setMemberType('buyer')}
                    >
                        <span className="join-type-icon">🛍️</span>
                        <span className="join-type-label">일반 회원</span>
                        <span className="join-type-desc">작품 구경·구매</span>
                    </button>
                    <button
                        type="button"
                        className={`join-type-btn${memberType === 'artisan' ? ' active' : ''}`}
                        onClick={() => setMemberType('artisan')}
                    >
                        <span className="join-type-icon">🏺</span>
                        <span className="join-type-label">장인 판매자</span>
                        <span className="join-type-desc">작품 등록·판매</span>
                    </button>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {/* 이름 */}
                    <div className="login-field">
                        <label className="login-label">이름</label>
                        <input
                            className="login-input"
                            type="text"
                            placeholder="실명을 입력하세요"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    {/* 로그인 아이디 + 중복확인 */}
                    <div className="login-field">
                        <label className="login-label">아이디</label>
                        <div className="join-input-row">
                            <input
                                className="login-input"
                                type="text"
                                placeholder="사용할 아이디를 입력하세요"
                                value={loginId}
                                onChange={handleLoginIdChange}
                                style={{ flex: 1 }}
                            />
                            <button type="button" className="join-verify-btn" onClick={handleCheckId}>중복확인</button>
                        </div>
                        {idCheckMsg && (
                            <p style={{ fontSize: 12, marginTop: 4, color: idChecked ? 'green' : 'red' }}>
                                {idCheckMsg}
                            </p>
                        )}
                    </div>

                    {/* 이메일 */}
                    <div className="login-field">
                        <label className="login-label">이메일</label>
                        <input
                            className="login-input"
                            type="email"
                            placeholder="이메일 주소를 입력하세요"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    {/* 비밀번호 */}
                    <div className="login-field">
                        <label className="login-label">비밀번호</label>
                        <input
                            className="login-input"
                            type="password"
                            placeholder="영문·숫자·특수문자 포함 8자 이상"
                            value={pw}
                            onChange={e => setPw(e.target.value)}
                        />
                        {pw && (
                            <div className="pw-strength-wrap">
                                <div className="pw-strength-bar">
                                    {[1, 2, 3, 4].map(i => (
                                        <div
                                            key={i}
                                            className={`pw-strength-segment${passCount >= i ? ` ${strengthLevel}` : ''}`}
                                        />
                                    ))}
                                </div>
                                {strengthLabel && (
                                    <span className={`pw-strength-label ${strengthLevel}`}>
                                        비밀번호 강도: {strengthLabel}
                                    </span>
                                )}
                                <ul className="pw-rules">
                                    {PW_RULES.map(rule => (
                                        <li key={rule.key} className={`pw-rule-item${rule.test(pw) ? ' pass' : ''}`}>
                                            {rule.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* 비밀번호 확인 */}
                    <div className="login-field">
                        <label className="login-label">비밀번호 확인</label>
                        <input
                            className="login-input"
                            type="password"
                            placeholder="비밀번호를 한번 더 입력하세요"
                            value={pwConfirm}
                            onChange={e => setPwConfirm(e.target.value)}
                        />
                        {pwConfirm && (
                            <p className={`pw-match-msg ${pw === pwConfirm ? 'match' : 'mismatch'}`}>
                                {pw === pwConfirm ? '비밀번호가 일치합니다' : '비밀번호가 일치하지 않습니다'}
                            </p>
                        )}
                    </div>

                    {/* 연락처 */}
                    <div className="login-field">
                        <label className="login-label">연락처</label>
                        <input
                            className="login-input"
                            type="tel"
                            placeholder="'-' 없이 숫자만 입력하세요"
                            value={tel}
                            onChange={e => setTel(e.target.value)}
                        />
                    </div>

                    {/* 장인 판매자 전용 필드 */}
                    {memberType === 'artisan' && (
                        <>
                            <div className="login-field">
                                <label className="login-label">공방·브랜드명</label>
                                <input
                                    className="login-input"
                                    type="text"
                                    placeholder="공방 또는 브랜드 이름을 입력하세요"
                                    value={brand}
                                    onChange={e => setBrand(e.target.value)}
                                />
                            </div>
                            <div className="login-field">
                                <label className="login-label">전문 분야</label>
                                <select
                                    className="login-input"
                                    style={{ cursor: 'pointer' }}
                                    value={major}
                                    onChange={e => setMajor(e.target.value)}
                                >
                                    <option value="">전문 분야를 선택하세요</option>
                                    {categories.map(cat => (
                                        <option key={cat.categoryId} value={cat.categoryName}>
                                            {cat.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="login-field">
                                <label className="login-label">자기소개</label>
                                <textarea
                                    className="login-input"
                                    placeholder="간단한 자기소개를 입력하세요"
                                    value={contents}
                                    onChange={e => setContents(e.target.value)}
                                    style={{ resize: 'vertical', minHeight: 80 }}
                                />
                            </div>
                            <div className="login-field">
                                <label className="login-label">대표 이미지</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="login-input"
                                    onChange={handleImgChange}
                                />
                                {imgPreview && (
                                    <img
                                        src={imgPreview}
                                        alt="미리보기"
                                        style={{ marginTop: 8, width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                                    />
                                )}
                            </div>
                        </>
                    )}

                    {/* 약관 동의 */}
                    <div className="join-agree-wrap">
                        <label className="join-agree-item">
                            <input
                                type="checkbox"
                                className="join-checkbox"
                                checked={agree1}
                                onChange={e => setAgree1(e.target.checked)}
                            />
                            <span>[필수] 서비스 이용약관에 동의합니다</span>
                            <a href="#" className="join-agree-view">보기</a>
                        </label>
                        <label className="join-agree-item">
                            <input
                                type="checkbox"
                                className="join-checkbox"
                                checked={agree2}
                                onChange={e => setAgree2(e.target.checked)}
                            />
                            <span>[필수] 개인정보 수집·이용에 동의합니다</span>
                            <a href="#" className="join-agree-view">보기</a>
                        </label>
                        <label className="join-agree-item">
                            <input
                                type="checkbox"
                                className="join-checkbox"
                                checked={agree3}
                                onChange={e => setAgree3(e.target.checked)}
                            />
                            <span>[선택] 마케팅·이벤트 알림 수신에 동의합니다</span>
                        </label>
                    </div>

                    {errorMsg && <p style={{ color: 'red', fontSize: 13, marginBottom: 8 }}>{errorMsg}</p>}

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? (
                            <span className="btn-loading">
                                <span className="btn-spinner"></span>
                                처리 중...
                            </span>
                        ) : (memberType === 'artisan' ? '장인으로 가입하기' : '회원가입')}
                    </button>
                </form>

                <div className="login-footer">
                    이미 계정이 있으신가요?&nbsp;
                    <Link to="/login" className="login-join-link">로그인</Link>
                </div>
            </div>
        </div>
    );
};

export default Join;
