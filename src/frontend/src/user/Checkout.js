import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import api from '../api';

const CLIENT_KEY = process.env.REACT_APP_TOSS_CLIENT_KEY;

const Checkout = ({ user }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartItems = [], subtotal = 0, shipping = 0, total = 0 } = location.state || {};

    const [form, setForm] = useState({
        receiverName: user?.userName || '',
        receiverTel: '',
        zipCode: '',
        address: '',
        addressDetail: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (!cartItems || cartItems.length === 0) {
            navigate('/cart');
        }
    }, [user, cartItems, navigate]);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCheckout = async () => {
        const { receiverName, receiverTel, zipCode, address } = form;
        if (!receiverName || !receiverTel || !zipCode || !address) {
            alert('배송지 정보를 모두 입력해주세요.');
            return;
        }

        setLoading(true);
        try {
            // 1. 주문 임시 생성
            const orderRes = await api.post('/api/order', {
                receiverName: form.receiverName,
                receiverTel: form.receiverTel,
                address: form.address,
                addressDetail: form.addressDetail,
                zipCode: form.zipCode,
                items: cartItems.map(item => ({ pdId: item.pdId, qty: item.qty })),
            });
            const { tossOrderId, totalAmount } = orderRes.data;

            // 2. 토스페이먼츠 결제 요청
            const tossPayments = await loadTossPayments(CLIENT_KEY);
            console.log("/////////////")
            console.log(CLIENT_KEY)
            const payment = tossPayments.payment({ customerKey: `user-${user.userId}` });
            await payment.requestPayment({
                method: 'CARD',
                amount: { currency: 'KRW', value: totalAmount },
                orderId: tossOrderId,
                orderName: cartItems.length === 1
                    ? cartItems[0].pdName
                    : `${cartItems[0].pdName} 외 ${cartItems.length - 1}건`,
                successUrl: window.location.origin + '/order/success',
                failUrl: window.location.origin + '/order/fail',
            });
        } catch (err) {
            console.error('결제 오류:', err);
            alert(err.response?.data?.message || '결제 중 오류가 발생했습니다.');
            setLoading(false);
        }
    };

    if (!user || !cartItems || cartItems.length === 0) return null;

    return (
        <div style={{ paddingTop: '80px' }}>
            <div className="cart-page">
                <div className="section-header" style={{ marginBottom: 40 }}>
                    <div>
                        <div className="section-label">Checkout</div>
                        <h1 className="section-title">주문 / 결제</h1>
                    </div>
                </div>

                <div className="cart-layout">
                    {/* 배송지 입력 */}
                    <div className="cart-items">
                        <h3 style={{ marginBottom: 24, fontSize: 16, letterSpacing: '0.1em', fontWeight: 600 }}>배송지 정보</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>수령인 이름</label>
                                    <input
                                        name="receiverName"
                                        value={form.receiverName}
                                        onChange={handleChange}
                                        placeholder="수령인 이름"
                                        style={inputStyle}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>연락처</label>
                                    <input
                                        name="receiverTel"
                                        value={form.receiverTel}
                                        onChange={handleChange}
                                        placeholder="010-0000-0000"
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>우편번호</label>
                                    <input
                                        name="zipCode"
                                        value={form.zipCode}
                                        onChange={handleChange}
                                        placeholder="12345"
                                        style={inputStyle}
                                    />
                                </div>
                                <div style={{ flex: 2 }}>
                                    <label style={labelStyle}>주소</label>
                                    <input
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        placeholder="기본 주소"
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>상세 주소</label>
                                <input
                                    name="addressDetail"
                                    value={form.addressDetail}
                                    onChange={handleChange}
                                    placeholder="상세 주소 (선택)"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* 주문 상품 목록 */}
                        <h3 style={{ marginTop: 40, marginBottom: 24, fontSize: 16, letterSpacing: '0.1em', fontWeight: 600 }}>주문 상품</h3>
                        <div className="cart-items-header">
                            <span>상품 정보</span>
                            <span>수량</span>
                            <span>금액</span>
                        </div>
                        {cartItems.map(item => (
                            <div key={item.pdId} className="cart-item">
                                <div className="cart-item-thumb">
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
                                </div>
                                <div className="cart-item-qty">
                                    <span className="qty-num">{item.qty}</span>
                                </div>
                                <div className="cart-item-price">
                                    {(item.pdPrice * item.qty).toLocaleString()}<span>원</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 주문 요약 */}
                    <div className="cart-summary">
                        <h3 className="cart-summary-title">결제 금액</h3>
                        <div className="cart-summary-row">
                            <span>상품 금액</span>
                            <span>{subtotal.toLocaleString()}원</span>
                        </div>
                        <div className="cart-summary-row">
                            <span>배송비</span>
                            <span>{shipping === 0 ? '무료' : `${shipping.toLocaleString()}원`}</span>
                        </div>
                        <div className="cart-summary-divider"></div>
                        <div className="cart-summary-total">
                            <span>총 결제 금액</span>
                            <span className="cart-total-price">{total.toLocaleString()}<small>원</small></span>
                        </div>
                        <button
                            className="cart-checkout-btn"
                            onClick={handleCheckout}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="btn-loading">
                                    <span className="btn-spinner"></span>
                                    결제 처리 중...
                                </span>
                            ) : '결제하기'}
                        </button>
                        <p style={{ fontSize: 11, color: 'var(--mid)', textAlign: 'center', marginTop: 12, opacity: 0.7 }}>
                            토스페이먼츠 안전결제
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const labelStyle = {
    display: 'block',
    fontSize: 11,
    letterSpacing: '0.1em',
    color: 'var(--mid)',
    marginBottom: 6,
    textTransform: 'uppercase',
};

const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid #e0d9d0',
    borderRadius: 2,
    fontSize: 14,
    background: 'var(--cream, #faf8f5)',
    boxSizing: 'border-box',
    outline: 'none',
};

export default Checkout;
