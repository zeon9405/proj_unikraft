import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import LoadingCard from '../LoadingCard';

const STATUS_LABEL = { 0: '결제 대기', 1: '결제 완료', 2: '취소됨' };
const STATUS_COLOR = { 0: '#b5a898', 1: '#4a7c59', 2: '#c0392b' };

const AdminOrderList = ({ user }) => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        if (user.role !== 2) { navigate('/'); return; }

        api.get('/api/order/admin/all')
            .then(res => { setOrders(res.data); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    }, [user, navigate]);

    if (!user || user.role !== 2) return null;
    if (loading) return <LoadingCard message="주문 목록을 불러오는 중입니다" />;

    const totalRevenue = orders
        .filter(o => o.status === 1)
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return (
        <div style={{ paddingTop: '80px' }}>
            <div className="cart-page">
                <div className="section-header" style={{ marginBottom: 40 }}>
                    <div>
                        <div className="section-label">Admin</div>
                        <h1 className="section-title">전체 주문 관리</h1>
                    </div>
                </div>

                {/* 요약 */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
                    {[
                        { label: '전체 주문', value: orders.length + '건' },
                        { label: '결제 완료', value: orders.filter(o => o.status === 1).length + '건', color: '#4a7c59' },
                        { label: '결제 대기', value: orders.filter(o => o.status === 0).length + '건', color: '#b5a898' },
                        { label: '취소', value: orders.filter(o => o.status === 2).length + '건', color: '#c0392b' },
                        { label: '총 매출', value: totalRevenue.toLocaleString() + '원', color: 'var(--dark)' },
                    ].map(stat => (
                        <div key={stat.label} style={{
                            flex: '1 1 140px',
                            padding: '16px 20px',
                            border: '1px solid #e0d9d0',
                            borderRadius: 4,
                            background: 'var(--cream, #faf8f5)',
                        }}>
                            <div style={{ fontSize: 11, color: 'var(--mid)', letterSpacing: '0.1em', marginBottom: 6 }}>
                                {stat.label.toUpperCase()}
                            </div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: stat.color || 'var(--dark)' }}>
                                {stat.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 주문 목록 테이블 */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--dark)' }}>
                                {['주문번호', '주문일시', '상품', '금액', '상태'].map(h => (
                                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, letterSpacing: '0.1em', color: 'var(--mid)' }}>
                                        {h.toUpperCase()}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr
                                    key={order.id}
                                    style={{ borderBottom: '1px solid #e0d9d0', cursor: 'pointer' }}
                                    onClick={() => navigate(`/order/view/${order.id}`)}
                                >
                                    <td style={tdStyle}>#{order.id}</td>
                                    <td style={tdStyle}>{new Date(order.createdAt).toLocaleString('ko-KR')}</td>
                                    <td style={tdStyle}>
                                        {order.firstItemName}
                                        {order.itemCount > 1 && <span style={{ color: 'var(--mid)', fontSize: 12 }}> 외 {order.itemCount - 1}건</span>}
                                    </td>
                                    <td style={tdStyle}>{order.totalAmount?.toLocaleString()}원</td>
                                    <td style={tdStyle}>
                                        <span style={{
                                            padding: '3px 10px',
                                            borderRadius: 20,
                                            fontSize: 11,
                                            fontWeight: 600,
                                            background: STATUS_COLOR[order.status] + '20',
                                            color: STATUS_COLOR[order.status],
                                        }}>
                                            {STATUS_LABEL[order.status]}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {orders.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--mid)' }}>
                        주문이 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
};

const tdStyle = {
    padding: '14px 16px',
    verticalAlign: 'middle',
};

export default AdminOrderList;
