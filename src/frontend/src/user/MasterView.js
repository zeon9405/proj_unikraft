import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingCard from '../LoadingCard';

const MasterView = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [master, setMaster] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/user/master/${userId}`)
            .then(res => {
                if (!res.ok) throw new Error('장인 정보 로드 실패');
                return res.json();
            })
            .then(data => {
                setMaster(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [userId]);

    if (loading) return <LoadingCard message="장인 정보를 불러오는 중입니다" />;

    if (!master) {
        return (
            <div className="loading-page">
                <div className="loading-card">
                    <p className="loading-message">장인 정보를 찾을 수 없습니다.</p>
                </div>
            </div>
        );
    }

    const isSoldOut = (p) => p.status === 1 || p.pdCnt === 0;

    // 전체보기 → 판매자명으로 검색된 product/list
    const handleViewAll = () => {
        navigate(`/product/list/ALL?searchField=userName&keyword=${encodeURIComponent(master.name)}`);
    };

    return (
        <div style={{ paddingTop: '80px' }}>

            {/* 장인 프로필 헤더 */}
            <div className="master-view-hero">
                <div className="master-view-hero-inner">
                    <img
                        src={master.imgUrl || '/uploads/user/default_user.png'}
                        alt={master.name}
                        className="master-view-avatar"
                        onError={e => { e.target.onerror = null; e.target.src = '/uploads/user/default_user.png'; }}
                    />
                    <div className="master-view-info">
                        <div className="section-label" style={{ marginBottom: 8 }}>Artisan Profile</div>
                        <h1 className="master-view-name">{master.name}</h1>
                        <div className="master-view-sub">
                            {master.major && <span>{master.major}</span>}
                            {master.brand && <><span className="master-view-sep">·</span><span>{master.brand}</span></>}
                        </div>
                        {master.contents && (
                            <p className="master-view-contents">{master.contents}</p>
                        )}
                        <div className="master-view-stats">
                            <div className="master-view-stat">
                                <span className="master-stat-num">{master.productCount}</span>
                                <span className="master-stat-label">등록 상품</span>
                            </div>
                            <div className="master-view-stat-divider" />
                            <div className="master-view-stat">
                                <span className="master-stat-num">{master.totalSaleCnt?.toLocaleString()}</span>
                                <span className="master-stat-label">총 판매 수</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 대표 상품 섹션 */}
            <div className="master-view-products-wrap">
                <div className="section-header" style={{ marginBottom: 40 }}>
                    <div>
                        <div className="section-label">Best Products</div>
                        <h2 className="section-title">{master.name}의<br /><em>대표 작품</em></h2>
                    </div>
                    {master.productCount > 0 && (
                        <button className="view-all" onClick={handleViewAll} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            전체 보기
                        </button>
                    )}
                </div>

                {master.top4Products && master.top4Products.length > 0 ? (
                    <div className="products-grid master-view-products-grid">
                        {master.top4Products.map(product => (
                            <div
                                key={product.pdId}
                                className="product-card"
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate('/product/view/' + product.pdId)}
                            >
                                <div className="product-img">
                                    <div className="product-img-bg p3"></div>
                                    <div className="product-illus">
                                        <img
                                            src={product.imgUrl || '/images/product_placeholder.svg'}
                                            alt={product.pdName}
                                            onError={e => { e.target.onerror = null; e.target.src = '/images/product_placeholder.svg'; }}
                                        />
                                    </div>
                                    <span className="product-badge">{isSoldOut(product) ? 'SOLD OUT' : 'HANDMADE'}</span>
                                    <div
                                        className="product-wish"
                                        style={{ color: isSoldOut(product) ? '#ccc' : undefined }}
                                    >
                                        {isSoldOut(product) ? '품절' : `♡`}
                                    </div>
                                </div>
                                <div className="product-info">
                                    <div className="product-maker">{product.userName}</div>
                                    <div className="product-name">{product.pdName}</div>
                                    <div className="product-sub">{product.major}</div>
                                    <div className="product-footer">
                                        <div className="product-price">
                                            {product.pdPrice?.toLocaleString()}<span>원</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="product-list-empty">
                        <p>등록된 상품이 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MasterView;
