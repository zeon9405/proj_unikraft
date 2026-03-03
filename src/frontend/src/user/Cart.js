import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export const addToCart = async (pdId, qty = 1) => {
    await api.post(`/api/cart/${pdId}`, null, { params: { qty } });
    window.dispatchEvent(new Event('cart-updated'));
};

const Cart = ({ user }) => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);

    const loadCart = useCallback(() => {
        if (!user) return;
        api.get('/api/cart')
            .then(res => setCartItems(res.data))
            .catch(err => console.error('장바구니 로드 실패:', err));
    }, [user]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadCart();
    }, [user, navigate, loadCart]);

    useEffect(() => {
        window.addEventListener('cart-updated', loadCart);
        return () => window.removeEventListener('cart-updated', loadCart);
    }, [loadCart]);

    const updateQty = (pdId, delta) => {
        const item = cartItems.find(i => i.pdId === pdId);
        if (!item) return;
        const newQty = Math.max(1, item.qty + delta);
        api.patch(`/api/cart/${pdId}`, null, { params: { qty: newQty } })
            .then(() => window.dispatchEvent(new Event('cart-updated')))
            .catch(err => console.error('수량 변경 실패:', err));
    };

    const removeItem = (pdId) => {
        api.delete(`/api/cart/${pdId}`)
            .then(() => window.dispatchEvent(new Event('cart-updated')))
            .catch(err => console.error('상품 제거 실패:', err));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.pdPrice * item.qty, 0);
    const shipping = subtotal > 0 && subtotal < 50000 ? 3000 : 0;
    const total = subtotal + shipping;

    return (
        <div style={{ paddingTop: '80px' }}>
            <div className="cart-page">
                <div className="section-header" style={{ marginBottom: 40 }}>
                    <div>
                        <div className="section-label">My Cart</div>
                        <h1 className="section-title">장바구니</h1>
                    </div>
                    <Link to="/" className="view-all">쇼핑 계속하기</Link>
                </div>

                {cartItems.length === 0 ? (
                    <div className="cart-empty">
                        <div className="cart-empty-icon">🛒</div>
                        <p className="cart-empty-text">장바구니가 비어있습니다.</p>
                        <Link
                            to="/category/ALL"
                            style={{
                                display: 'inline-block',
                                textDecoration: 'none',
                                padding: '14px 36px',
                                background: 'var(--dark)',
                                color: 'var(--cream)',
                                fontSize: 12,
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                borderRadius: 2,
                            }}
                        >
                            쇼핑하러 가기
                        </Link>
                    </div>
                ) : (
                    <div className="cart-layout">
                        {/* 장바구니 아이템 목록 */}
                        <div className="cart-items">
                            <div className="cart-items-header">
                                <span>상품 정보</span>
                                <span>수량</span>
                                <span>금액</span>
                            </div>

                            {cartItems.map(item => (
                                <div key={item.pdId} className="cart-item">
                                    <div className="cart-item-thumb" style={{ cursor: 'pointer' }}
                                        onClick={() => navigate(`/product/view/${item.pdId}`)}>
                                        <img
                                            src={item.imgUrl || '/images/product_placeholder.svg'}
                                            alt={item.pdName}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={e => { e.target.onerror = null; e.target.src = '/images/product_placeholder.svg'; }}
                                        />
                                    </div>
                                    <div className="cart-item-info">
                                        <div className="product-maker">{item.userName}</div>
                                        <div className="product-name" style={{ fontSize: 16 }}>{item.pdName}</div>
                                        <div className="product-sub">{item.categoryName}</div>
                                    </div>
                                    <div className="cart-item-qty">
                                        <button className="qty-btn" onClick={() => updateQty(item.pdId, -1)}>−</button>
                                        <span className="qty-num">{item.qty}</span>
                                        <button className="qty-btn" onClick={() => updateQty(item.pdId, 1)}>+</button>
                                    </div>
                                    <div className="cart-item-price">
                                        {(item.pdPrice * item.qty).toLocaleString()}<span>원</span>
                                    </div>
                                    <button className="cart-remove-btn" onClick={() => removeItem(item.pdId)}>✕</button>
                                </div>
                            ))}
                        </div>

                        {/* 주문 요약 */}
                        <div className="cart-summary">
                            <h3 className="cart-summary-title">주문 요약</h3>
                            <div className="cart-summary-row">
                                <span>상품 금액</span>
                                <span>{subtotal.toLocaleString()}원</span>
                            </div>
                            <div className="cart-summary-row">
                                <span>배송비</span>
                                <span>{shipping === 0 ? '무료' : `${shipping.toLocaleString()}원`}</span>
                            </div>
                            {shipping === 0 && (
                                <div className="cart-free-shipping">✓ 5만원 이상 구매로 무료배송 적용</div>
                            )}
                            {shipping > 0 && (
                                <div className="cart-free-shipping" style={{ color: 'var(--mid)', opacity: 0.7 }}>
                                    {(50000 - subtotal).toLocaleString()}원 더 담으면 무료배송
                                </div>
                            )}
                            <div className="cart-summary-divider"></div>
                            <div className="cart-summary-total">
                                <span>총 결제 금액</span>
                                <span className="cart-total-price">{total.toLocaleString()}<small>원</small></span>
                            </div>
                            <button
                                className="cart-checkout-btn"
                                onClick={() => navigate('/checkout', { state: { cartItems, subtotal, shipping, total } })}
                            >결제하기</button>
                            <div className="cart-pay-methods">
                                <span className="pay-tag">카카오페이</span>
                                <span className="pay-tag">네이버페이</span>
                                <span className="pay-tag">신용카드</span>
                                <span className="pay-tag">무통장</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
