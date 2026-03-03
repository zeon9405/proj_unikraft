import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const SkeletonProductCard = () => (
    <div className="skeleton-product-card">
        <div className="skeleton skeleton-product-img" />
        <div className="skeleton-product-body">
            <div className="skeleton skeleton-line short" style={{ width: '40%' }} />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line short" />
            <div className="skeleton skeleton-line short" style={{ width: '35%' }} />
        </div>
    </div>
);

const Main = ({ user }) => {
    const [saleProducts, setSaleProducts] = useState([]);
    const [newProducts, setNewProducts] = useState([]);
    const [likeProducts, setLikeProducts] = useState([]);
    const [topCategories, setTopCategories] = useState([]);
    const [likedSet, setLikedSet] = useState(new Set());
    const [productsLoading, setProductsLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const navigate = useNavigate();

    // 상품 데이터 로드
    useEffect(() => {
        fetch('/api/product/main', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(res => {
                if (!res.ok) throw new Error("네트워크 응답 에러");
                return res.json();
            })
            .then(data => {
                setSaleProducts(data.sale4 || []);
                setNewProducts(data.new4 || []);
                setLikeProducts(data.top4 || []);
                setProductsLoading(false);
            })
            .catch(err => {
                console.error("상품 호출 실패:", err);
                setProductsLoading(false);
            });
    }, []);

    // 카테고리 top5 로드
    useEffect(() => {
        fetch('/api/category/top5')
            .then(res => res.json())
            .then(data => {
                setTopCategories(data);
                setCategoriesLoading(false);
            })
            .catch(err => {
                console.error("카테고리 호출 실패:", err);
                setCategoriesLoading(false);
            });
    }, []);

    // 로그인 상태일 때 좋아요 목록 복원
    useEffect(() => {
        if (!user) return;
        fetch('/api/like/my', {
            headers: { 'X-User-Id': user.userId },
        })
            .then(res => res.json())
            .then(ids => setLikedSet(new Set(ids)))
            .catch(err => console.error("좋아요 목록 로드 실패:", err));
    }, [user]);

    const handleLikeToggle = (pdId) => {
        if (!user) {
            if (window.confirm('로그인이 필요합니다. 로그인 페이지로 이동할까요?')) {
                navigate('/login');
            }
            return;
        }

        const isLiked = likedSet.has(pdId);
        const method = isLiked ? 'DELETE' : 'POST';

        fetch(`/api/like/${pdId}`, {
            method,
            headers: { 'X-User-Id': user.userId },
        })
            .then(res => {
                if (!res.ok) throw new Error('좋아요 처리 실패');
                setLikedSet(prev => {
                    const next = new Set(prev);
                    if (isLiked) next.delete(pdId);
                    else next.add(pdId);
                    return next;
                });
            })
            .catch(err => console.error(err));
    };

    const renderProductCard = (product, badge, badgeStyle, back) => (
        <div className="product-card" key={product.pdId} onClick={() => navigate('/product/view/' + product.pdId)} style={{ cursor: 'pointer' }}>
            <div className="product-img">
                <div className={back}></div>
                <div className="product-illus">
                    <img
                        src={product.imgUrl || '/images/product_placeholder.svg'}
                        alt={product.pdName}
                        onError={e => { e.target.onerror = null; e.target.src = '/images/product_placeholder.svg'; }}
                    />
                </div>
                <span className="product-badge" style={badgeStyle}>{badge}</span>
                <div
                    className="product-wish"
                    onClick={e => { e.stopPropagation(); handleLikeToggle(product.pdId); }}
                    style={{ cursor: 'pointer', color: likedSet.has(product.pdId) ? 'red' : undefined }}
                >
                    {likedSet.has(product.pdId) ? '♥' : '♡'}
                </div>
            </div>
            <div className="product-info">
                <div className="product-maker">{product.userName}</div>
                <div className="product-name">{product.pdName}</div>
                <div className="product-sub">{product.major}</div>
                <div className="product-footer">
                    <div className="product-price">{product.pdPrice.toLocaleString()}<span>원</span></div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* 카테고리 섹션 */}
            <section className="section">
                <div className="section-header">
                    <div>
                        <div className="section-label">Shop by Category</div>
                        <h2 className="section-title">카테고리로<br /><em>둘러보기</em></h2>
                    </div>
                    <button className="view-all" style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        onClick={() => navigate('/product/list/ALL')}>
                        전체 보기
                    </button>
                </div>
                <div className="category-grid">
                    {categoriesLoading ? (
                        <>
                            <div className="skeleton skeleton-cat-card" style={{ gridRow: '1 / 3' }} />
                            <div className="skeleton skeleton-cat-card" />
                            <div className="skeleton skeleton-cat-card" />
                            <div className="skeleton skeleton-cat-card" />
                            <div className="skeleton skeleton-cat-card" />
                        </>
                    ) : topCategories.map((cat, idx) => (
                        <div
                            key={cat.categoryId}
                            className={`cat-card cat-card-${idx + 1}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate('/product/list/' + cat.categoryId)}
                        >
                            <div
                                className="cat-bg"
                                style={cat.imgUrl ? {
                                    backgroundImage: `url(/images/category/${cat.imgUrl})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                } : {}}
                            />
                            <div className="cat-overlay">
                                <div className="cat-tag">{cat.productCount} items</div>
                                <div className="cat-name">{cat.categoryName}</div>
                                {cat.categoryDesc && (
                                    <div className="cat-desc">{cat.categoryDesc}</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 판매순 Best Sellers */}
            <section className="products-section">
                <div className="section-header">
                    <div>
                        <div className="section-label">Best Sellers</div>
                        <h2 className="section-title">지금 가장<br /><em>사랑받는 작품</em></h2>
                    </div>
                    <button className="view-all" style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        onClick={() => navigate('/product/list/ALL?sort=best')}>
                        전체 보기
                    </button>
                </div>
                <div className="products-grid">
                    {productsLoading
                        ? [1, 2, 3, 4].map(i => <SkeletonProductCard key={i} />)
                        : saleProducts.map(product => renderProductCard(product, 'BEST', {},"product-img-bg p3"))
                    }
                </div>
            </section>

            {/* 최신 New Arrivals */}
            <section className="products-section">
                <div className="section-header">
                    <div>
                        <div className="section-label">New Arrivals</div>
                        <h2 className="section-title">막 도착한<br /><em>새로운 작품</em></h2>
                    </div>
                    <button className="view-all" style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        onClick={() => navigate('/product/list/ALL?sort=new')}>
                        전체 보기
                    </button>
                </div>
                <div className="products-grid">
                    {productsLoading
                        ? [1, 2, 3, 4].map(i => <SkeletonProductCard key={i} />)
                        : newProducts.map(product => renderProductCard(product, 'NEW', { background: 'var(--vanilla-dark)' },"product-img-bg p2"))
                    }
                </div>
            </section>

            {/* 좋아요순 Most Liked */}
            <section className="products-section">
                <div className="section-header">
                    <div>
                        <div className="section-label">Most Liked</div>
                        <h2 className="section-title">마음을 사로잡은<br /><em>찜 인기 작품</em></h2>
                    </div>
                    <button className="view-all" style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        onClick={() => navigate('/product/list/ALL?sort=like')}>
                        전체 보기
                    </button>
                </div>
                <div className="products-grid">
                    {productsLoading
                        ? [1, 2, 3, 4].map(i => <SkeletonProductCard key={i} />)
                        : likeProducts.map(product => renderProductCard(product, 'LIKE', { background: 'var(--vanilla-dark)' },"product-img-bg p1"))
                    }
                </div>
            </section>
        </>
    );
};

export default Main;
