import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addToCart } from './Cart';
import LoadingCard from '../LoadingCard';
import api from '../api';

const ProductView = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCnt, setLikeCnt] = useState(0);
    const [qty, setQty] = useState(1);

    // 상품 데이터 로드
    useEffect(() => {
        fetch(`/api/product/view/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('상품을 불러올 수 없습니다.');
                return res.json();
            })
            .then(data => {
                setProduct(data);
                setLikeCnt(data.likeCnt || 0);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    // 로그인 상태일 때 좋아요 여부 확인
    useEffect(() => {
        if (!user) return;
        api.get('/api/like/my')
            .then(res => setIsLiked(res.data.includes(Number(id))))
            .catch(err => console.error('좋아요 확인 실패:', err));
    }, [user, id]);

    const handleLikeToggle = () => {
        if (!user) {
            if (window.confirm('로그인이 필요합니다. 로그인 페이지로 이동할까요?')) {
                navigate('/login');
            }
            return;
        }

        const request = isLiked ? api.delete(`/api/like/${id}`) : api.post(`/api/like/${id}`);
        request
            .then(() => {
                setIsLiked(prev => !prev);
                setLikeCnt(prev => isLiked ? prev - 1 : prev + 1);
            })
            .catch(err => console.error(err));
    };

    const isSoldOut = !product || product.status !== 0 || product.pdCnt === 0;

    const handleQtyDown = () => setQty(q => Math.max(1, q - 1));
    const handleQtyUp   = () => setQty(q => Math.min(product?.pdCnt || 1, q + 1));

    if (loading) return <LoadingCard message="상품 정보를 불러오는 중입니다" />;

    if (!product) {
        return (
            <div className="loading-page">
                <div className="loading-card">
                    <p className="loading-message">상품을 찾을 수 없습니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ paddingTop: '80px' }}>

            {/* 페이지 헤더 */}
            <div className="page-banner" style={{ paddingBottom: 40 }}>
                <div className="page-banner-inner">
                    <div className="section-label">{product.categoryName || 'Product Detail'}</div>
                    <h1 className="page-banner-title"><em>{product.pdName}</em></h1>
                    <p className="page-banner-desc">{product.userName} · {product.userMajor}</p>
                </div>
                <div className="product-view-like-wrap">
                    <button
                        className="product-view-like-btn"
                        type="button"
                        onClick={handleLikeToggle}
                        style={isLiked ? { borderColor: 'var(--rose-taupe)', background: 'rgba(184,142,141,0.08)' } : {}}
                    >
                        <span className="product-view-like-icon" style={{ color: isLiked ? '#c0474a' : 'var(--rose-taupe)' }}>
                            {isLiked ? '♥' : '♡'}
                        </span>
                        <span className="product-view-like-text">좋아요</span>
                        <span className="product-view-like-count">{likeCnt}</span>
                    </button>
                </div>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="product-view-wrap">
                <div className="product-view-layout">

                    {/* 이미지 */}
                    <div className="product-view-gallery">
                        <div className="product-view-main-img">
                            <img
                                src={product.imgUrl || '/images/product_placeholder.svg'}
                                alt={product.pdName}
                                onError={e => { e.target.onerror = null; e.target.src = '/images/product_placeholder.svg'; }}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                            <span className="product-badge">HANDMADE</span>
                        </div>
                    </div>

                    {/* 상품 정보 */}
                    <div className="product-view-info">

                        {/* 카테고리 + 상태 */}
                        <div className="product-view-meta">
                            <span className="product-list-category">{product.categoryName}</span>
                            <span className={`product-status-badge ${isSoldOut ? 'off' : 'on'}`}>
                                {isSoldOut ? '품절' : '판매중'}
                            </span>
                        </div>

                        {/* 상품명 */}
                        <h2 className="product-view-name">{product.pdName}</h2>
                        <p className="product-view-maker">{product.userName} · {product.userMajor}</p>

                        {/* 가격 */}
                        <div className="product-view-price-area">
                            <span className="product-view-price">{product.pdPrice?.toLocaleString()}</span>
                            <span className="product-view-price-unit">원</span>
                        </div>

                        <hr className="product-view-divider" />

                        {/* 상세 설명 */}
                        <div className="product-view-desc-section">
                            <div className="product-form-label" style={{ marginBottom: '12px' }}>상품 설명</div>
                            <p className="product-view-desc">
                                {product.contents || '상품 설명이 없습니다.'}
                            </p>
                        </div>

                        <hr className="product-view-divider" />

                        {/* 구매 박스 */}
                        <div className="product-view-purchase">

                            {/* 수량 선택 */}
                            <div className="product-view-qty-row">
                                <span className="product-view-qty-label">수량</span>
                                <div className="cart-item-qty">
                                    <button
                                        className="qty-btn"
                                        type="button"
                                        onClick={handleQtyDown}
                                        disabled={isSoldOut || qty <= 1}
                                    >−</button>
                                    <span className="qty-num">{isSoldOut ? 0 : qty}</span>
                                    <button
                                        className="qty-btn"
                                        type="button"
                                        onClick={handleQtyUp}
                                        disabled={isSoldOut || qty >= product.pdCnt}
                                    >+</button>
                                </div>
                                <span className="product-view-stock-info">
                                    {isSoldOut ? '품절된 상품입니다' : `재고 ${product.pdCnt}개`}
                                </span>
                            </div>

                            {/* 합계 */}
                            <div className="product-view-total-row">
                                <span className="product-view-total-label">합계</span>
                                <span className="product-view-total-price">
                                    {isSoldOut ? '—' : (product.pdPrice * qty).toLocaleString()}
                                    {!isSoldOut && <small>원</small>}
                                </span>
                            </div>

                            {/* 버튼 */}
                            <div className="product-view-btn-row">
                                <button
                                    className="product-view-buy-btn"
                                    type="button"
                                    disabled={isSoldOut}
                                    onClick={() => {
                                        if (!user) {
                                            if (window.confirm('로그인이 필요합니다. 로그인 페이지로 이동할까요?')) {
                                                navigate('/login');
                                            }
                                            return;
                                        }
                                        const subtotal = product.pdPrice * qty;
                                        const shipping = subtotal < 50000 ? 3000 : 0;
                                        navigate('/checkout', {
                                            state: {
                                                cartItems: [{
                                                    pdId: product.pdId,
                                                    pdName: product.pdName,
                                                    pdPrice: product.pdPrice,
                                                    imgUrl: product.imgUrl,
                                                    userName: product.userName,
                                                    qty,
                                                }],
                                                subtotal,
                                                shipping,
                                                total: subtotal + shipping,
                                            }
                                        });
                                    }}
                                >결제하기</button>
                                <button
                                    className="product-view-cart-btn"
                                    type="button"
                                    disabled={isSoldOut}
                                    onClick={() => {
                                        if (!user) {
                                            if (window.confirm('로그인이 필요합니다. 로그인 페이지로 이동할까요?')) {
                                                navigate('/login');
                                            }
                                            return;
                                        }
                                        addToCart(product.pdId, qty)
                                            .then(() => {
                                                if (window.confirm('장바구니에 담았습니다.\n장바구니로 이동하시겠습니까?')) {
                                                    navigate('/cart');
                                                }
                                            })
                                            .catch(() => alert('장바구니 추가에 실패했습니다.'));
                                    }}
                                >장바구니</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductView;
