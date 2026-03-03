import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingCard from '../LoadingCard';
import { uploadUserImage } from '../api';

const EditProfile = ({ user, setUser }) => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [tel, setTel] = useState('');
    const [pw, setPw] = useState('');
    const [pwConfirm, setPwConfirm] = useState('');
    const [major, setMajor] = useState('');
    const [brand, setBrand] = useState('');
    const [contents, setContents] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [imgPreview, setImgPreview] = useState('');
    const [categories, setCategories] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        Promise.all([
            fetch(`/api/user/profile/${user.userId}`).then(r => r.json()),
            fetch('/api/category/all').then(r => r.json()),
        ])
            .then(([prof, cats]) => {
                setProfile(prof);
                setName(prof.name || '');
                setEmail(prof.email || '');
                setTel(prof.tel || '');
                setMajor(prof.major || '');
                setBrand(prof.brand || '');
                setContents(prof.contents || '');
                setImgUrl(prof.imgUrl || '');
                setImgPreview(prof.imgUrl || '');
                setCategories(cats);
                setLoading(false);
            })
            .catch(err => { console.error(err); setLoading(false); });
    }, [user, navigate]);

    const handleImgChange = async e => {
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
        setSuccessMsg('');

        if (pw && pw !== pwConfirm) {
            setErrorMsg('비밀번호가 일치하지 않습니다.');
            return;
        }

        const body = { name, email, tel, pw: pw || '', major, brand, contents, imgUrl };

        fetch(`/api/user/profile/${user.userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
            .then(res => {
                if (!res.ok) throw new Error('수정 실패');
                const updated = { ...user, userName: name };
                setUser(updated);
                setSuccessMsg('정보가 성공적으로 수정되었습니다.');
                setPw('');
                setPwConfirm('');
            })
            .catch(() => setErrorMsg('정보 수정 중 오류가 발생했습니다.'));
    };

    if (!user) return null;
    if (loading) return <LoadingCard message="정보를 불러오는 중입니다" />;

    const isArtisan = user.role === 1;

    return (
        <div className="login-page" style={{ alignItems: 'flex-start', paddingBottom: 80 }}>
            <div className="login-deco-left"></div>
            <div className="login-deco-right"></div>

            <div className="join-card">
                <Link to="/" className="login-logo" style={{ textDecoration: 'none' }}>
                    MAISON <span>ARTISAN</span>
                </Link>
                <p className="login-sub">
                    {isArtisan ? '장인 판매자 정보 수정' : '회원 정보 수정'}
                </p>

                <form className="login-form" onSubmit={handleSubmit}>
                    {/* 공통 필드 */}
                    <div className="login-field">
                        <label className="login-label">이름</label>
                        <input className="login-input" type="text" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="login-field">
                        <label className="login-label">아이디</label>
                        <input className="login-input" type="text" value={profile?.loginId || ''} disabled
                            style={{ background: 'rgba(92,79,74,0.06)', cursor: 'not-allowed' }} />
                    </div>
                    <div className="login-field">
                        <label className="login-label">이메일</label>
                        <input className="login-input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="login-field">
                        <label className="login-label">연락처</label>
                        <input className="login-input" type="tel" placeholder="변경할 연락처" value={tel} onChange={e => setTel(e.target.value)} />
                    </div>
                    <div className="login-field">
                        <label className="login-label">새 비밀번호</label>
                        <input className="login-input" type="password" placeholder="변경할 비밀번호 (그대로면 빈칸)" value={pw} onChange={e => setPw(e.target.value)} />
                    </div>
                    <div className="login-field">
                        <label className="login-label">비밀번호 확인</label>
                        <input className="login-input" type="password" placeholder="새 비밀번호를 한번 더 입력하세요" value={pwConfirm} onChange={e => setPwConfirm(e.target.value)} />
                    </div>

                    {/* 장인 전용 필드 */}
                    {isArtisan && (
                        <>
                            <div style={{ borderTop: '1px solid var(--vanilla-dark)', margin: '20px 0 16px', paddingTop: 16 }}>
                                <div className="section-label">장인 정보</div>
                            </div>
                            <div className="login-field">
                                <label className="login-label">공방·브랜드명</label>
                                <input className="login-input" type="text" value={brand} onChange={e => setBrand(e.target.value)} />
                            </div>
                            <div className="login-field">
                                <label className="login-label">전문 분야</label>
                                <select className="login-input" style={{ cursor: 'pointer' }} value={major} onChange={e => setMajor(e.target.value)}>
                                    <option value="">전문 분야를 선택하세요</option>
                                    {categories.map(cat => (
                                        <option key={cat.categoryId} value={cat.categoryName}>{cat.categoryName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="login-field">
                                <label className="login-label">자기소개</label>
                                <textarea className="login-input" value={contents} onChange={e => setContents(e.target.value)}
                                    style={{ resize: 'vertical', minHeight: 80 }} />
                            </div>
                            <div className="login-field">
                                <label className="login-label">대표 이미지</label>
                                <input type="file" accept="image/*" className="login-input" onChange={handleImgChange} />
                                {imgPreview && (
                                    <img src={imgPreview} alt="미리보기"
                                        style={{ marginTop: 8, width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                                        onError={e => { e.target.onerror = null; e.target.src = '/uploads/user/default_user.png'; }} />
                                )}
                            </div>
                        </>
                    )}

                    {errorMsg && <p style={{ color: 'red', fontSize: 13, marginBottom: 8 }}>{errorMsg}</p>}
                    {successMsg && <p style={{ color: 'green', fontSize: 13, marginBottom: 8 }}>{successMsg}</p>}

                    <button type="submit" className="login-btn">저장하기</button>
                </form>

                <div className="login-footer">
                    <Link to="/mypage" className="login-join-link">마이페이지로 돌아가기</Link>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
