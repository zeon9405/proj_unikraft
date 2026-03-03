import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingCard from '../LoadingCard';
import api from '../api';

const Mypage = ({ user }) => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [likedProducts, setLikedProducts] = useState([]);
    const [myProducts, setMyProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('liked'); // 'liked' | 'myproducts'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }

        Promise.all([
            api.get(`/api/user/profile/${user.userId}`).then(r => r.data),
            api.get('/api/like/my/products').then(r => r.data),
            user.role === 1 ? api.get('/api/product/my').then(r => r.data) : Promise.resolve([]),
        ])
            .then(([prof, liked, my]) => {
                setProfile(prof);
                setLikedProducts(liked);
                setMyProducts(my);
                setLoading(false);
            })
            .catch(err => { console.error(err); setLoading(false); });
    }, [user, navigate]);

    if (!user) return null;

    if (loading) {
        return <LoadingCard message="마이페이지를 불러오는 중입니다" />;
    }

    const isArtisan = user.role === 1;

    return (
        <div style={{ paddingTop: '80px' }}>
            {/* 페이지 배너 */}
            <div className="page-banner">
                <div className="page-banner-inner">
                    <div className="section-label">{isArtisan ? 'Artisan' : 'Member'}</div>
                    <h1 className="page-banner-title">
                        <em>{isArtisan ? '장인 마이페이지' : '마이페이지'}</em>
                    </h1>
                    <p className="page-banner-desc">{profile?.name}님, 환영합니다.</p>
                </div>
            </div>

            <div className="mypage-wrap">
                <div className="mypage-layout">

                    {/* 사이드바 */}
                    <aside className="mypage-sidebar">
                        <div className="mypage-profile-card">
                            {isArtisan && (
                                <div className="mypage-profile-img">
                                    <img src={profile?.imgUrl || '/uploads/user/default_user.png'} alt={profile?.name}
                                        onError={e => { e.target.onerror = null; e.target.src = '/uploads/user/default_user.png'; }} />
                                </div>
                            )}
                            <div className="mypage-profile-name">{profile?.name}</div>
                            {isArtisan && <div className="mypage-profile-brand">{profile?.brand}</div>}
                            <div className="mypage-profile-badge">{isArtisan ? '장인 판매자' : '일반 회원'}</div>
                        </div>

                        <div className="mypage-nav">
                            <button
                                className={`mypage-nav-item${activeTab === 'liked' ? ' active' : ''}`}
                                onClick={() => setActiveTab('liked')}
                            >♥ 좋아요한 상품</button>
                            {isArtisan && (
                                <button
                                    className={`mypage-nav-item${activeTab === 'myproducts' ? ' active' : ''}`}
                                    onClick={() => setActiveTab('myproducts')}
                                >🏺 내 등록 상품</button>
                            )}
                            <Link to="/mypage/orders" className="mypage-nav-item">📦 내 주문 내역</Link>
                            <Link to="/mypage/edit" className="mypage-nav-item">✏️ 정보 수정</Link>
                            <Link to="/inquiry" className="mypage-nav-item">💬 문의게시판</Link>
                        </div>

                        <div className="mypage-info-card">
                            <div className="mypage-info-row">
                                <span>이메일</span><span>{profile?.email}</span>
                            </div>
                            <div className="mypage-info-row">
                                <span>연락처</span><span>{profile?.tel}</span>
                            </div>
                            {isArtisan && (
                                <>
                                    <div className="mypage-info-row">
                                        <span>전문분야</span><span>{profile?.major}</span>
                                    </div>
                                    <div className="mypage-info-row">
                                        <span>공방명</span><span>{profile?.brand}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </aside>

                    {/* 메인 콘텐츠 */}
                    <main className="mypage-content">

                        {/* 좋아요한 상품 */}
                        {activeTab === 'liked' && (
                            <div>
                                <div className="mypage-section-header">
                                    <h2 className="mypage-section-title">♥ 좋아요한 상품</h2>
                                    <span className="mypage-count">{likedProducts.length}개</span>
                                </div>
                                {likedProducts.length === 0 ? (
                                    <div className="mypage-empty">
                                        <p>아직 좋아요한 상품이 없습니다.</p>
                                        <Link to="/category/ALL" className="mypage-empty-link">상품 둘러보기</Link>
                                    </div>
                                ) : (
                                    <div className="mypage-product-grid">
                                        {likedProducts.map(p => (
                                            <div
                                                key={p.pdId}
                                                className="mypage-product-card"
                                                onClick={() => navigate(`/product/view/${p.pdId}`)}
                                            >
                                                <div className="mypage-product-thumb">
                                                    <img src={p.imgUrl || '/images/product_placeholder.svg'} alt={p.pdName}
                                                        onError={e => { e.target.onerror = null; e.target.src = '/images/product_placeholder.svg'; }} />
                                                </div>
                                                <div className="mypage-product-info">
                                                    <div className="mypage-product-category">{p.categoryName}</div>
                                                    <div className="mypage-product-name">{p.pdName}</div>
                                                    <div className="mypage-product-price">{p.pdPrice?.toLocaleString()}원</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 내 등록 상품 (장인 전용) */}
                        {activeTab === 'myproducts' && isArtisan && (
                            <div>
                                <div className="mypage-section-header">
                                    <h2 className="mypage-section-title">🏺 내 등록 상품</h2>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                        <span className="mypage-count">{myProducts.length}개</span>
                                        <Link to="/product/write" className="mypage-add-btn">+ 상품 등록</Link>
                                    </div>
                                </div>
                                {myProducts.length === 0 ? (
                                    <div className="mypage-empty">
                                        <p>등록된 상품이 없습니다.</p>
                                        <Link to="/product/write" className="mypage-empty-link">상품 등록하기</Link>
                                    </div>
                                ) : (
                                    <div className="mypage-my-product-list">
                                        {myProducts.map(p => (
                                            <div key={p.pdId} className="mypage-my-product-row">
                                                <div className="mypage-my-product-thumb">
                                                    <img src={p.imgUrl || '/images/product_placeholder.svg'} alt={p.pdName}
                                                        onError={e => { e.target.onerror = null; e.target.src = '/images/product_placeholder.svg'; }} />
                                                </div>
                                                <div className="mypage-my-product-info">
                                                    <div className="mypage-product-category">{p.categoryName}</div>
                                                    <div className="mypage-product-name">{p.pdName}</div>
                                                    <div className="mypage-product-price">{p.pdPrice?.toLocaleString()}원</div>
                                                </div>
                                                <div className="mypage-my-product-meta">
                                                    <span className={`product-status-badge ${p.status === 0 && p.pdCnt > 0 ? 'on' : 'off'}`}>
                                                        {p.status === 0 && p.pdCnt > 0 ? '판매중' : '품절'}
                                                    </span>
                                                    <span className="mypage-stock">재고 {p.pdCnt}개</span>
                                                </div>
                                                <div className="mypage-my-product-actions">
                                                    <button
                                                        className="mypage-edit-btn"
                                                        onClick={() => navigate(`/product/edit/${p.pdId}`)}
                                                    >수정</button>
                                                    <button
                                                        className="mypage-view-btn"
                                                        onClick={() => navigate(`/product/view/${p.pdId}`)}
                                                    >보기</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Mypage;
