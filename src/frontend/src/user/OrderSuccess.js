import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api';

const OrderSuccess = ({ user }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
    const [errorMsg, setErrorMsg] = useState('');
    const called = useRef(false);

    useEffect(() => {
        if (called.current) return;
        called.current = true;

        if (!user) {
            navigate('/login');
            return;
        }

        const paymentKey = searchParams.get('paymentKey');
        const orderId = searchParams.get('orderId');
        const amount = Number(searchParams.get('amount'));

        if (!paymentKey || !orderId || !amount) {
            setStatus('error');
            setErrorMsg('결제 정보가 올바르지 않습니다.');
            return;
        }

        api.post('/api/payment/confirm', { paymentKey, orderId, amount })
            .then(() => {
                setStatus('success');
                window.dispatchEvent(new Event('cart-updated'));
            })
            .catch(err => {
                setStatus('error');
                setErrorMsg(err.response?.data?.message || '결제 승인 중 오류가 발생했습니다.');
            });
    }, [user, searchParams, navigate]);

    if (status === 'loading') {
        return (
            <div style={{ paddingTop: '80px', textAlign: 'center', padding: '120px 20px' }}>
                <p style={{ fontSize: 16, color: 'var(--mid)' }}>결제를 처리하는 중입니다...</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div style={{ paddingTop: '80px', textAlign: 'center', padding: '120px 20px' }}>
                <div style={{ fontSize: 48, marginBottom: 24 }}>✕</div>
                <h2 style={{ fontSize: 24, marginBottom: 12 }}>결제 실패</h2>
                <p style={{ color: 'var(--mid)', marginBottom: 32 }}>{errorMsg}</p>
                <Link to="/cart" style={btnStyle}>장바구니로 돌아가기</Link>
            </div>
        );
    }

    return (
        <div style={{ paddingTop: '80px', textAlign: 'center', padding: '120px 20px' }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>✓</div>
            <div className="section-label" style={{ marginBottom: 12 }}>Order Complete</div>
            <h1 style={{ fontSize: 32, marginBottom: 16 }}>주문이 완료되었습니다</h1>
            <p style={{ color: 'var(--mid)', marginBottom: 40, fontSize: 15 }}>
                주문 내역은 마이페이지에서 확인하실 수 있습니다.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/mypage/orders" style={btnStyle}>내 주문 내역</Link>
                <Link to="/category/ALL" style={{ ...btnStyle, background: 'transparent', color: 'var(--dark)', border: '1px solid var(--dark)' }}>
                    쇼핑 계속하기
                </Link>
            </div>
        </div>
    );
};

const btnStyle = {
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

export default OrderSuccess;
