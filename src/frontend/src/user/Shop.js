import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Shop = () => {
    const [qty1, setQty1] = useState(1);
    const [qty2, setQty2] = useState(1);
    const [qty3, setQty3] = useState(2);
    const [show1, setShow1] = useState(true);
    const [show2, setShow2] = useState(true);
    const [show3, setShow3] = useState(true);

    const price1 = 68000;
    const price2 = 124000;
    const price3 = 89000;

    const subtotal =
        (show1 ? price1 * qty1 : 0) +
        (show2 ? price2 * qty2 : 0) +
        (show3 ? price3 * qty3 : 0);
    const shipping = subtotal > 0 && subtotal < 50000 ? 3000 : 0;
    const total = subtotal + shipping;
    const hasItems = show1 || show2 || show3;

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

                {!hasItems ? (
                    <div className="cart-empty">
                        <div className="cart-empty-icon">🛒</div>
                        <p className="cart-empty-text">장바구니가 비어있습니다.</p>
                        <Link
                            to="/"
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

                            {/* 아이템 1 - 모란 문양 찻잔 세트 */}
                            {show1 && (
                                <div className="cart-item">
                                    <div className="cart-item-thumb product-img-bg p1"></div>
                                    <div className="cart-item-info">
                                        <div className="product-maker">이수현 도예가</div>
                                        <div className="product-name" style={{ fontSize: 16 }}>모란 문양 찻잔 세트</div>
                                        <div className="product-sub">손물레 도자기 · 2인 세트</div>
                                    </div>
                                    <div className="cart-item-qty">
                                        <button className="qty-btn" onClick={() => setQty1(Math.max(1, qty1 - 1))}>−</button>
                                        <span className="qty-num">{qty1}</span>
                                        <button className="qty-btn" onClick={() => setQty1(qty1 + 1)}>+</button>
                                    </div>
                                    <div className="cart-item-price">
                                        {(price1 * qty1).toLocaleString()}<span>원</span>
                                    </div>
                                    <button className="cart-remove-btn" onClick={() => setShow1(false)}>✕</button>
                                </div>
                            )}

                            {/* 아이템 2 - 메리노울 손뜨개 숄 */}
                            {show2 && (
                                <div className="cart-item">
                                    <div className="cart-item-thumb product-img-bg p2"></div>
                                    <div className="cart-item-info">
                                        <div className="product-maker">박지은 직조공</div>
                                        <div className="product-name" style={{ fontSize: 16 }}>메리노울 손뜨개 숄</div>
                                        <div className="product-sub">100% 천연 메리노울 · 오트밀</div>
                                    </div>
                                    <div className="cart-item-qty">
                                        <button className="qty-btn" onClick={() => setQty2(Math.max(1, qty2 - 1))}>−</button>
                                        <span className="qty-num">{qty2}</span>
                                        <button className="qty-btn" onClick={() => setQty2(qty2 + 1)}>+</button>
                                    </div>
                                    <div className="cart-item-price">
                                        {(price2 * qty2).toLocaleString()}<span>원</span>
                                    </div>
                                    <button className="cart-remove-btn" onClick={() => setShow2(false)}>✕</button>
                                </div>
                            )}

                            {/* 아이템 3 - 자연석 링 실버 반지 */}
                            {show3 && (
                                <div className="cart-item">
                                    <div className="cart-item-thumb product-img-bg p4"></div>
                                    <div className="cart-item-info">
                                        <div className="product-maker">김예린 금속공예가</div>
                                        <div className="product-name" style={{ fontSize: 16 }}>자연석 링 실버 반지</div>
                                        <div className="product-sub">925 스털링 실버 · 천연 문스톤</div>
                                    </div>
                                    <div className="cart-item-qty">
                                        <button className="qty-btn" onClick={() => setQty3(Math.max(1, qty3 - 1))}>−</button>
                                        <span className="qty-num">{qty3}</span>
                                        <button className="qty-btn" onClick={() => setQty3(qty3 + 1)}>+</button>
                                    </div>
                                    <div className="cart-item-price">
                                        {(price3 * qty3).toLocaleString()}<span>원</span>
                                    </div>
                                    <button className="cart-remove-btn" onClick={() => setShow3(false)}>✕</button>
                                </div>
                            )}
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
                            {shipping === 0 && subtotal > 0 && (
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
                            <button className="cart-checkout-btn">결제하기</button>
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

export default Shop;
