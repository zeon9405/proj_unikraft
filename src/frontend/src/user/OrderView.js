import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api';
import LoadingCard from '../LoadingCard';

const STATUS_LABEL = { 0: '결제 대기', 1: '결제 완료', 2: '취소됨' };
const STATUS_COLOR = { 0: '#b5a898', 1: '#4a7c59', 2: '#c0392b' };

const OrderView = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        api.get(`/api/order/${id}`)
            .then(res => { setOrder(res.data); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    }, [id, user, navigate]);

    const handleCancel = async () => {
        if (!window.confirm('주문을 취소하시겠습니까? 재고가 복원됩니다.')) return;
        setCancelling(true);
        try {
            await api.patch(`/api/order/${id}/cancel`);
            setOrder(prev => ({ ...prev, status: 2 }));
            alert('주문이 취소되었습니다.');
        } catch (err) {
            alert(err.response?.data?.message || '취소 중 오류가 발생했습니다.');
        } finally {
            setCancelling(false);
        }
    };

    if (!user) return null;
    if (loading) return <LoadingCard message="주문 상세를 불러오는 중입니다" />;
    if (!order) return <div style={{ paddingTop: 80, textAlign: 'center' }}>주문을 찾을 수 없습니다.</div>;

    return (
        <div style={{ paddingTop: '80px' }}>
            <div className="cart-page">
                <div className="section-header" style={{ marginBottom: 40 }}>
                    <div>
                        <div className="section-label">Order Detail</div>
                        <h1 className="section-title">주문 상세</h1>
                    </div>
                    <Link to="/mypage/orders" className="view-all">주문 목록으로</Link>
                </div>

                <div className="cart-layout">
                    <div className="cart-items">
                        {/* 주문 상태 */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <div>
                                <div style={{ fontSize: 13, color: 'var(--mid)', marginBottom: 4 }}>
                                    주문번호 #{order.id}
                                </div>
                                <div style={{ fontSize: 13, color: 'var(--mid)' }}>
                                    {new Date(order.createdAt).toLocaleString('ko-KR')}
                                </div>
                            </div>
                            <div style={{
                                padding: '6px 16px',
                                borderRadius: 20,
                                fontSize: 13,
                                fontWeight: 600,
                                background: STATUS_COLOR[order.status] + '20',
                                color: STATUS_COLOR[order.status],
                            }}>
                                {STATUS_LABEL[order.status]}
                            </div>
                        </div>

                        {/* 주문 상품 */}
                        <h3 style={sectionTitleStyle}>주문 상품</h3>
                        <div className="cart-items-header">
                            <span>상품 정보</span>
                            <span>수량</span>
                            <span>금액</span>
                        </div>
                        {order.items?.map((item, i) => (
                            <div key={i} className="cart-item">
                                <div
                                    className="cart-item-thumb"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/product/view/${item.pdId}`)}
                                >
                                    <img
                                        src={item.imgUrl || '/images/product_placeholder.svg'}
                                        alt={item.pdName}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={e => { e.target.onerror = null; e.target.src = '/images/product_placeholder.svg'; }}
                                    />
                                </div>
                                <div className="cart-item-info">
                                    <div className="product-name" style={{ fontSize: 15 }}>{item.pdName}</div>
                                    <div className="product-sub">{item.price?.toLocaleString()}원 (단가)</div>
                                </div>
                                <div className="cart-item-qty">
                                    <span className="qty-num">{item.qty}</span>
                                </div>
                                <div className="cart-item-price">
                                    {(item.price * item.qty).toLocaleString()}<span>원</span>
                                </div>
                            </div>
                        ))}

                        {/* 배송지 */}
                        <h3 style={{ ...sectionTitleStyle, marginTop: 40 }}>배송지 정보</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', fontSize: 14 }}>
                            <div><span style={infoLabelStyle}>수령인</span> {order.receiverName}</div>
                            <div><span style={infoLabelStyle}>연락처</span> {order.receiverTel}</div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <span style={infoLabelStyle}>주소</span>
                                [{order.zipCode}] {order.address} {order.addressDetail}
                            </div>
                        </div>
                    </div>

                    {/* 결제 요약 */}
                    <div className="cart-summary">
                        <h3 className="cart-summary-title">결제 금액</h3>
                        <div className="cart-summary-divider"></div>
                        <div className="cart-summary-total">
                            <span>총 결제 금액</span>
                            <span className="cart-total-price">
                                {order.totalAmount?.toLocaleString()}<small>원</small>
                            </span>
                        </div>

                        {order.status === 1 && (
                            <button
                                onClick={handleCancel}
                                disabled={cancelling}
                                style={{
                                    width: '100%',
                                    marginTop: 16,
                                    padding: '14px',
                                    background: 'transparent',
                                    border: '1px solid #c0392b',
                                    color: '#c0392b',
                                    fontSize: 12,
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    cursor: cancelling ? 'not-allowed' : 'pointer',
                                    borderRadius: 2,
                                    opacity: cancelling ? 0.6 : 1,
                                }}
                            >
                                {cancelling ? '취소 처리 중...' : '주문 취소'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const sectionTitleStyle = {
    fontSize: 15,
    fontWeight: 600,
    letterSpacing: '0.08em',
    marginBottom: 16,
};

const infoLabelStyle = {
    color: 'var(--mid)',
    marginRight: 8,
    fontSize: 12,
    letterSpacing: '0.05em',
};

export default OrderView;
