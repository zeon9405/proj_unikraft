import React, { useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';

const OrderFail = ({ user }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const errorCode = searchParams.get('code') || '';
    const errorMsg = searchParams.get('message') || '결제가 취소되었습니다.';

    useEffect(() => {
        if (!user) navigate('/login');
    }, [user, navigate]);

    if (!user) return null;

    return (
        <div style={{ paddingTop: '80px', textAlign: 'center', padding: '120px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 24 }}>✕</div>
            <div className="section-label" style={{ marginBottom: 12 }}>Payment Failed</div>
            <h1 style={{ fontSize: 32, marginBottom: 16 }}>결제에 실패했습니다</h1>
            {errorCode && (
                <p style={{ color: 'var(--mid)', marginBottom: 8, fontSize: 13 }}>
                    오류 코드: {errorCode}
                </p>
            )}
            <p style={{ color: 'var(--mid)', marginBottom: 40, fontSize: 15 }}>{decodeURIComponent(errorMsg)}</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/cart" style={btnStyle}>장바구니로 돌아가기</Link>
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

export default OrderFail;
