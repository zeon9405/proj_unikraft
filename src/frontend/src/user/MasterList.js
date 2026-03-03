import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 8;

const MasterList = () => {
    const navigate = useNavigate();

    const [masters, setMasters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState('sale');          // 'sale' | 'reg'
    const [inputKeyword, setInputKeyword] = useState('');
    const [keyword, setKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // sort 변경 → API 재호출
    useEffect(() => {
        setLoading(true);
        fetch(`/api/user/masters?sort=${sort}`)
            .then(res => {
                if (!res.ok) throw new Error('장인 목록 로드 실패');
                return res.json();
            })
            .then(data => {
                setMasters(data);
                setCurrentPage(1);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [sort]);

    const handleSearch = useCallback(() => {
        setKeyword(inputKeyword);
        setCurrentPage(1);
    }, [inputKeyword]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    // 이름 검색 (프론트 필터)
    const filtered = keyword.trim()
        ? masters.filter(m => m.name?.toLowerCase().includes(keyword.trim().toLowerCase()))
        : masters;

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paged = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const getPageNumbers = () => {
        const range = 2;
        const start = Math.max(1, currentPage - range);
        const end = Math.min(totalPages, currentPage + range);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    return (
        <div style={{ paddingTop: '80px' }}>

            {/* 히어로 배너 */}
            <div className="page-banner master-list-banner">
                <div className="page-banner-inner">
                    <div className="section-label">Our Artisans</div>
                    <h1 className="page-banner-title">손끝에서 피어나는 <em>장인의 이야기</em></h1>
                    <p className="page-banner-desc">
                        메종 아르티잔은 전국 각지에서 묵묵히 자신의 기술을 갈고 닦아온<br />
                        장인들과 함께합니다. 그들의 손길이 담긴 작품을 통해 진정한 공예의 가치를 경험하세요.
                    </p>
                </div>
                <div className="page-banner-badge">
                    <span className="page-banner-count">{loading ? '…' : filtered.length}</span>
                    <span className="page-banner-count-label">명의 장인</span>
                </div>
            </div>

            {/* 툴바 */}
            <div className="master-list-toolbar">
                {/* 정렬 */}
                <select
                    className="filter-sort-select"
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                >
                    <option value="sale">판매상품 많은순</option>
                    <option value="reg">장인 등록순</option>
                </select>

                {/* 검색 */}
                <div className="product-list-search">
                    <input
                        className="product-list-search-input"
                        type="text"
                        placeholder="장인 이름으로 검색"
                        value={inputKeyword}
                        onChange={e => setInputKeyword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{ borderRadius: '2px 0 0 2px' }}
                    />
                    <button className="product-list-search-btn" onClick={handleSearch}>🔍 검색</button>
                </div>
            </div>

            {/* 장인 카드 그리드 */}
            <div className="master-list-section">
                {loading ? (
                    <div className="master-list-grid">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="master-list-card">
                                <div className="master-list-card-top">
                                    <div className="skeleton master-avatar-skeleton" />
                                    <div style={{ flex: 1 }}>
                                        <div className="skeleton skeleton-line" style={{ width: '60%', marginBottom: 8 }} />
                                        <div className="skeleton skeleton-line short" style={{ width: '40%' }} />
                                    </div>
                                </div>
                                <div className="skeleton skeleton-line" style={{ marginTop: 14, marginBottom: 6 }} />
                                <div className="skeleton skeleton-line short" style={{ width: '80%' }} />
                            </div>
                        ))}
                    </div>
                ) : paged.length === 0 ? (
                    <div className="product-list-empty">
                        <p>등록된 장인이 없습니다.</p>
                        <span>다른 이름으로 검색해보세요.</span>
                    </div>
                ) : (
                    <div className="master-list-grid">
                        {paged.map(master => (
                            <div key={master.userId} className="master-list-card">
                                {/* 상단: 아바타 + 기본 정보 */}
                                <div className="master-list-card-top">
                                    <img
                                        src={master.imgUrl || '/uploads/user/default_user.png'}
                                        alt={master.name}
                                        className="master-list-avatar"
                                        onError={e => { e.target.onerror = null; e.target.src = '/uploads/user/default_user.png'; }}
                                    />
                                    <div className="master-list-card-info">
                                        <div className="master-list-name">{master.name}</div>
                                        <div className="master-list-major">{master.major}</div>
                                        {master.brand && (
                                            <div className="master-list-brand">{master.brand}</div>
                                        )}
                                    </div>
                                </div>

                                {/* 소개글 */}
                                {master.contents && (
                                    <p className="master-list-contents">{master.contents}</p>
                                )}

                                {/* 통계 + 버튼 */}
                                <div className="master-list-card-footer">
                                    <div className="master-list-stats">
                                        <div className="master-list-stat">
                                            <span className="master-stat-num">{master.productCount}</span>
                                            <span className="master-stat-label">등록 상품</span>
                                        </div>
                                        <div className="master-list-stat">
                                            <span className="master-stat-num">{master.totalSaleCnt?.toLocaleString()}</span>
                                            <span className="master-stat-label">총 판매</span>
                                        </div>
                                    </div>
                                    <button
                                        className="master-view-btn"
                                        onClick={() => navigate(`/master/view/${master.userId}`)}
                                    >
                                        작품 보기 →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 페이지네이션 */}
            {!loading && totalPages > 1 && (
                <div className="pagination">
                    <button className="page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>«</button>
                    <button className="page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>‹</button>
                    {getPageNumbers().map(page => (
                        <button
                            key={page}
                            className={`page-btn${currentPage === page ? ' active' : ''}`}
                            onClick={() => setCurrentPage(page)}
                        >{page}</button>
                    ))}
                    <button className="page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>›</button>
                    <button className="page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>»</button>
                </div>
            )}
        </div>
    );
};

export default MasterList;
