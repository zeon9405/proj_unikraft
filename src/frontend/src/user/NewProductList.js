import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewProductList = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/product/new12')
            .then(res => {
                if (!res.ok) throw new Error('상품 로드 실패');
                return res.json();
            })
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const isSoldOut = (p) => p.status === 1 || p.pdCnt === 0;

    return (
        <div style={{ paddingTop: '80px' }}>

            {/* 페이지 배너 */}
            <div className="page-banner">
                <div className="page-banner-inner">
                    <div className="section-label">New Arrivals</div>
                    <h1 className="page-banner-title">신규 <em>입고</em></h1>
                    <p className="page-banner-desc">
                        전국 장인들의 새로운 작품을 가장 먼저 만나보세요.<br />
                        매주 새롭게 업데이트되는 핸드메이드 작품들이 기다립니다.
                    </p>
                </div>
            </div>

            {/* 상품 카드 그리드 */}
            <div className="new-arrivals-section">
                {loading ? (
                    <div className="new-arrivals-grid">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
                            <div key={i} className="new-arrival-card skeleton-card">
                                <div className="skeleton new-arrival-img-wrap" style={{ height: 260 }} />
                                <div className="new-arrival-info">
                                    <div className="skeleton skeleton-line short" style={{ width: '40%', marginBottom: 8 }} />
                                    <div className="skeleton skeleton-line" style={{ marginBottom: 6 }} />
                                    <div className="skeleton skeleton-line short" style={{ width: '55%' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="product-list-empty">
                        <p>등록된 신규 상품이 없습니다.</p>
                        <span>곧 새로운 장인의 작품이 입고될 예정입니다.</span>
                    </div>
                ) : (
                    <div className="new-arrivals-grid">
                        {products.map((product, idx) => (
                            <div
                                key={product.pdId}
                                className="new-arrival-card"
                                onClick={() => navigate('/product/view/' + product.pdId)}
                            >
                                {/* 이미지 */}
                                <div className="new-arrival-img-wrap">
                                    <img
                                        src={product.imgUrl || '/images/product_placeholder.svg'}
                                        alt={product.pdName}
                                        onError={e => { e.target.onerror = null; e.target.src = '/images/product_placeholder.svg'; }}
                                        className="new-arrival-img"
                                    />
                                    <span className="new-arrival-badge">NEW</span>
                                    <span className="new-arrival-num">#{String(idx + 1).padStart(2, '0')}</span>
                                    {isSoldOut(product) && (
                                        <div className="new-arrival-soldout-overlay">품절</div>
                                    )}
                                </div>

                                {/* 정보 */}
                                <div className="new-arrival-info">
                                    <div className="new-arrival-meta">
                                        <span className="new-arrival-category">{product.categoryName}</span>
                                        <span className={`product-status-badge ${isSoldOut(product) ? 'off' : 'on'}`}>
                                            {isSoldOut(product) ? '품절' : '판매중'}
                                        </span>
                                    </div>
                                    <div className="new-arrival-name">{product.pdName}</div>
                                    <div className="new-arrival-seller">{product.userName}</div>
                                    <div className="new-arrival-price">
                                        {product.pdPrice?.toLocaleString()}<span>원</span>
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

export default NewProductList;
