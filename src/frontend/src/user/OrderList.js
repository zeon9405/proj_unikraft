import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import LoadingCard from '../LoadingCard';

const STATUS_LABEL = { 0: '결제 대기', 1: '결제 완료', 2: '취소됨' };
const STATUS_COLOR = { 0: '#b5a898', 1: '#4a7c59', 2: '#c0392b' };

const OrderList = ({ user }) => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        api.get('/api/order/my')
            .then(res => { setOrders(res.data); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    }, [user, navigate]);

    if (!user) return null;
    if (loading) return <LoadingCard message="주문 내역을 불러오는 중입니다" />;

    return (
        <div style={{ paddingTop: '80px' }}>
            <div className="cart-page">
                <div className="section-header" style={{ marginBottom: 40 }}>
                    <div>
                        <div className="section-label">My Orders</div>
                        <h1 className="section-title">내 주문 내역</h1>
                    </div>
                    <Link to="/mypage" className="view-all">마이페이지로</Link>
                </div>

                {orders.length === 0 ? (
                    <div className="cart-empty">
                        <div className="cart-empty-icon">📦</div>
                        <p className="cart-empty-text">주문 내역이 없습니다.</p>
                        <Link to="/category/ALL" style={shopBtnStyle}>쇼핑하러 가기</Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {orders.map(order => (
                            <div
                                key={order.id}
                                onClick={() => navigate(`/order/view/${order.id}`)}
                                style={orderCardStyle}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                                    <div>
                                        <div style={{ fontSize: 13, color: 'var(--mid)', marginBottom: 4 }}>
                                            주문번호 #{order.id} · {new Date(order.createdAt).toLocaleDateString('ko-KR')}
                                        </div>
                                        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                                            {order.firstItemName}
                                            {order.itemCount > 1 && ` 외 ${order.itemCount - 1}건`}
                                        </div>
                                        <div style={{ fontSize: 15, color: 'var(--dark)' }}>
                                            {order.totalAmount?.toLocaleString()}원
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: '4px 12px',
                                        borderRadius: 20,
                                        fontSize: 12,
                                        fontWeight: 600,
                                        background: STATUS_COLOR[order.status] + '20',
                                        color: STATUS_COLOR[order.status],
                                        letterSpacing: '0.05em',
                                    }}>
                                        {STATUS_LABEL[order.status]}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const orderCardStyle = {
    padding: '24px 28px',
    border: '1px solid #e0d9d0',
    borderRadius: 4,
    cursor: 'pointer',
    background: 'var(--cream, #faf8f5)',
    transition: 'border-color 0.2s',
};

const shopBtnStyle = {
    display: 'inline-block',
    textDecoration: 'none',
    padding: '14px 36px',
    background: 'var(--dark)',
    color: 'var(--cream)',
    fontSize: 12,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    borderRadius: 2,
};

export default OrderList;
