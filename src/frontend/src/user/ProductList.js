import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

const ITEMS_PER_PAGE = 10;

const SORT_OPTIONS = [
    { label: '등록순', value: 'reg' },
    { label: '좋아요순', value: 'like' },
    { label: '판매순', value: 'sale' },
];

const ProductList = ({ user, categories = [], categoriesLoading = false }) => {
    const { categoryId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // URL 파라미터 → 초기 sort 값 결정
    const initSort = () => {
        const s = searchParams.get('sort');
        if (s === 'like') return 'like';
        if (s === 'best' || s === 'sale') return 'sale';
        return 'reg';
    };

    // URL 쿼리 파라미터에서 초기 검색 조건 읽기 (MasterView 전체보기 등에서 활용)
    const initSearchField = searchParams.get('searchField') || 'pdName';
    const initKeyword = searchParams.get('keyword') || '';

    const [queryState, setQueryState] = useState({
        categoryId: categoryId || 'ALL',
        sort: initSort(),
        searchField: initSearchField,
        keyword: initKeyword,
    });

    // 검색 입력창 (실제 검색은 버튼/Enter 시에만 queryState 업데이트)
    const [inputKeyword, setInputKeyword] = useState(initKeyword);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // URL 파라미터 변경 → categoryId 동기화
    useEffect(() => {
        const newCatId = categoryId || 'ALL';
        setQueryState(prev => ({ ...prev, categoryId: newCatId }));
    }, [categoryId]);

    // queryState 변경 → 백엔드 호출
    useEffect(() => {
        const { categoryId: catId, sort, searchField, keyword } = queryState;

        setLoading(true);
        const params = new URLSearchParams({ categoryId: catId, sort });
        if (keyword && keyword.trim()) {
            params.set('searchField', searchField);
            params.set('keyword', keyword.trim());
        }

        fetch(`/api/product/search?${params.toString()}`)
            .then(res => {
                if (!res.ok) throw new Error('상품 조회 실패');
                return res.json();
            })
            .then(data => {
                setProducts(data);
                setCurrentPage(1);
                setLoading(false);
            })
            .catch(err => {
                console.error('상품 로드 실패:', err);
                setLoading(false);
            });
    }, [queryState]);

    // 카테고리 버튼 클릭 → navigate (URL 변경 → useEffect에서 queryState 업데이트)
    const handleCategoryClick = (catId) => {
        const path = catId === 'ALL' ? '/category/ALL' : `/category/${catId}`;
        navigate(path);
    };

    // 정렬 변경
    const handleSortChange = (e) => {
        const sortMap = { '등록순': 'reg', '좋아요순': 'like', '판매순': 'sale' };
        const val = SORT_OPTIONS.find(o => o.label === e.target.value)?.value || 'reg';
        setQueryState(prev => ({ ...prev, sort: val }));
    };

    // 검색 실행 (버튼 클릭 or Enter)
    const handleSearch = useCallback(() => {
        setQueryState(prev => ({ ...prev, keyword: inputKeyword }));
    }, [inputKeyword]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    // 페이지네이션
    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
    const paged = products.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const getPageNumbers = () => {
        const range = 2;
        const start = Math.max(1, currentPage - range);
        const end = Math.min(totalPages, currentPage + range);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    // 현재 카테고리 정보 (이미 prop으로 받은 categories 활용 → 깜빡임 없음)
    const activeCatId = queryState.categoryId;
    const activeCategoryInfo = categories.find(
        c => String(c.categoryId) === String(activeCatId)
    );

    const currentSortLabel = SORT_OPTIONS.find(o => o.value === queryState.sort)?.label || '등록순';

    return (
        <div style={{ paddingTop: '80px' }}>

            {/* 페이지 배너 */}
            <div className="page-banner">
                <div className="page-banner-inner">
                    <div className="section-label">Category</div>
                    {categoriesLoading && activeCatId !== 'ALL' ? (
                        <>
                            <div className="skeleton skeleton-title" />
                            <div className="skeleton skeleton-desc" />
                        </>
                    ) : (
                        <>
                            <h1 className="page-banner-title">
                                {activeCategoryInfo
                                    ? <em>{activeCategoryInfo.categoryName}</em>
                                    : <em>전체 카테고리</em>
                                }
                            </h1>
                            <p className="page-banner-desc">
                                {activeCategoryInfo?.categoryDesc || '모든 카테고리의 핸드메이드 작품을 확인하세요.'}
                            </p>
                        </>
                    )}
                </div>
                <div className="page-banner-badge">
                    <span className="page-banner-count">{loading ? '…' : products.length}</span>
                    <span className="page-banner-count-label">개 상품</span>
                </div>
            </div>

            {/* 검색 툴바 */}
            <div className="product-list-toolbar">
                {/* 카테고리 버튼 */}
                <div className="filter-categories">
                    <button
                        className={`filter-cat-btn${activeCatId === 'ALL' ? ' active' : ''}`}
                        onClick={() => handleCategoryClick('ALL')}
                    >전체</button>
                    {categoriesLoading ? (
                        <>
                            {[1, 2, 3, 4].map(i => (
                                <span key={i} className="skeleton skeleton-cat-btn" />
                            ))}
                        </>
                    ) : (
                        categories.map(cat => (
                            <button
                                key={cat.categoryId}
                                className={`filter-cat-btn${String(activeCatId) === String(cat.categoryId) ? ' active' : ''}`}
                                onClick={() => handleCategoryClick(cat.categoryId)}
                            >{cat.categoryName}</button>
                        ))
                    )}
                </div>

                {/* 정렬 + 검색 */}
                <div className="product-list-toolbar-row">
                    <select
                        className="filter-sort-select"
                        value={currentSortLabel}
                        onChange={handleSortChange}
                    >
                        {SORT_OPTIONS.map(o => <option key={o.value}>{o.label}</option>)}
                    </select>

                    <div className="product-list-search">
                        <select
                            className="filter-sort-select"
                            value={queryState.searchField === 'userName' ? '판매자명' : '상품명'}
                            onChange={e => setQueryState(prev => ({
                                ...prev,
                                searchField: e.target.value === '판매자명' ? 'userName' : 'pdName',
                            }))}
                            style={{ borderRadius: '2px 0 0 2px', borderRight: 'none', height: 40 }}
                        >
                            <option>상품명</option>
                            <option>판매자명</option>
                        </select>
                        <input
                            className="product-list-search-input"
                            type="text"
                            placeholder="검색어를 입력하세요"
                            value={inputKeyword}
                            onChange={e => setInputKeyword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            style={{ borderRadius: 0 }}
                        />
                        <button className="product-list-search-btn" onClick={handleSearch}>🔍 검색</button>
                    </div>
                </div>
            </div>

            {/* 상품 목록 */}
            <div className="product-list-section">
                {loading ? (
                    <div className="product-list-skeleton">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="product-list-row skeleton-row">
                                <div className="skeleton skeleton-thumb" />
                                <div className="product-list-info">
                                    <div className="skeleton skeleton-line short" />
                                    <div className="skeleton skeleton-line" />
                                    <div className="skeleton skeleton-line short" />
                                </div>
                                <div className="skeleton skeleton-line short" style={{ width: 80 }} />
                                <div className="skeleton skeleton-line short" style={{ width: 60 }} />
                                <div className="skeleton skeleton-line short" style={{ width: 70 }} />
                            </div>
                        ))}
                    </div>
                ) : paged.length === 0 ? (
                    <div className="product-list-empty">
                        <p>등록된 상품이 없습니다.</p>
                        <span>다른 카테고리나 검색어를 시도해보세요.</span>
                    </div>
                ) : (
                    paged.map(product => (
                        <div
                            key={product.pdId}
                            className="product-list-row"
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate('/product/view/' + product.pdId)}
                        >
                            <div className="product-list-thumb">
                                <img
                                    src={product.imgUrl}
                                    alt={product.pdName}
                                />
                            </div>
                            <div className="product-list-info">
                                <div className="product-list-category">{product.categoryName}</div>
                                <div className="product-list-name">{product.pdName}</div>
                                <div className="product-list-maker">{product.userName}</div>
                            </div>
                            <div className="product-list-price">
                                {product.pdPrice?.toLocaleString()}<span>원</span>
                            </div>
                            <div className="product-list-stock">재고 {product.pdCnt}개</div>
                            <div className="product-list-status">
                                <span className={`product-status-badge ${product.status === 0 && product.pdCnt > 0 ? 'on' : 'off'}`}>
                                    {product.status === 0 && product.pdCnt > 0 ? '판매중' : '품절'}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* 페이지네이션 */}
            {!loading && totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="page-btn"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(1)}
                    >«</button>
                    <button
                        className="page-btn"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                    >‹</button>
                    {getPageNumbers().map(page => (
                        <button
                            key={page}
                            className={`page-btn${currentPage === page ? ' active' : ''}`}
                            onClick={() => setCurrentPage(page)}
                        >{page}</button>
                    ))}
                    <button
                        className="page-btn"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                    >›</button>
                    <button
                        className="page-btn"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(totalPages)}
                    >»</button>
                </div>
            )}
        </div>
    );
};

export default ProductList;
