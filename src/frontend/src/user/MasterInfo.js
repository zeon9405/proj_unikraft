import React from 'react';

const MasterInfo = () => {
    return (
        <div style={{ paddingTop: '80px' }}>

            {/* 히어로 섹션 */}
            <div className="master-hero">
                <div className="master-hero-inner">
                    <div className="section-label" style={{ color: 'var(--vanilla)', opacity: 0.7 }}>Our Artisans</div>
                    <h1 className="master-hero-title">손끝에서 피어나는<br /><em>장인의 이야기</em></h1>
                    <p className="master-hero-desc">
                        메종 아르티잔은 전국 각지에서 묵묵히 자신의 기술을 갈고 닦아온<br />
                        장인들과 함께합니다. 그들의 손길이 담긴 작품을 통해<br />
                        진정한 공예의 가치를 경험하세요.
                    </p>
                    <div className="master-stats">
                        <div className="master-stat">
                            <span className="stat-num">128</span>
                            <span className="stat-label">등록 장인</span>
                        </div>
                        <div className="master-stat">
                            <span className="stat-num">15</span>
                            <span className="stat-label">전문 분야</span>
                        </div>
                        <div className="master-stat">
                            <span className="stat-num">4,200+</span>
                            <span className="stat-label">작품 수</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 장인 카드 그리드 */}
            <div className="masters-section">
                <div className="section-header">
                    <div>
                        <div className="section-label">Featured Artisans</div>
                        <h2 className="section-title">이 달의<br /><em>추천 장인</em></h2>
                    </div>
                    <a href="#" className="view-all">전체 장인 보기</a>
                </div>

                <div className="masters-grid">

                    {/* 장인 1 - 이수현 도예가 */}
                    <div className="master-card">
                        <div className="master-card-top">
                            <div className="artisan-avatar av1" style={{ width: 72, height: 72, fontSize: 30, flexShrink: 0 }}>🏺</div>
                            <div className="master-card-info">
                                <div className="master-card-name">이수현</div>
                                <div className="master-card-title">도예가</div>
                                <div className="master-card-meta">
                                    <span>📍 경기도 이천</span>
                                    <span> · 경력 15년</span>
                                </div>
                            </div>
                        </div>
                        <div className="master-card-specialty">손물레 성형 · 청자 · 백자</div>
                        <p className="master-card-story">
                            이천 도자기 마을에서 나고 자란 이수현 도예가는 전통 기법인 손물레 성형으로
                            현대적 감각의 도자기를 빚어냅니다. 자연에서 영감받은 형태와 유약으로
                            생활 속 아름다움을 전달합니다.
                        </p>
                        <div className="master-card-footer">
                            <div className="master-card-stat">
                                <span className="master-stat-num">24</span>
                                <span className="master-stat-label">등록 작품</span>
                            </div>
                            <div className="master-card-stat">
                                <span className="master-stat-num">342</span>
                                <span className="master-stat-label">판매 수</span>
                            </div>
                            <button className="master-view-btn">작품 보기 →</button>
                        </div>
                    </div>

                    {/* 장인 2 - 박지은 직조공 */}
                    <div className="master-card">
                        <div className="master-card-top">
                            <div className="artisan-avatar av2" style={{ width: 72, height: 72, fontSize: 30, flexShrink: 0 }}>🧶</div>
                            <div className="master-card-info">
                                <div className="master-card-name">박지은</div>
                                <div className="master-card-title">직조공</div>
                                <div className="master-card-meta">
                                    <span>📍 서울 마포구</span>
                                    <span> · 경력 10년</span>
                                </div>
                            </div>
                        </div>
                        <div className="master-card-specialty">핸드위빙 · 메리노울 직물</div>
                        <p className="master-card-story">
                            핀란드에서 섬유 예술을 공부하고 돌아온 박지은 직조공은 전통 베틀과
                            현대 직조 기법을 결합해 따뜻하고 섬세한 직물 작품을 선보입니다.
                            천연 소재만을 고집합니다.
                        </p>
                        <div className="master-card-footer">
                            <div className="master-card-stat">
                                <span className="master-stat-num">18</span>
                                <span className="master-stat-label">등록 작품</span>
                            </div>
                            <div className="master-card-stat">
                                <span className="master-stat-num">218</span>
                                <span className="master-stat-label">판매 수</span>
                            </div>
                            <button className="master-view-btn">작품 보기 →</button>
                        </div>
                    </div>

                    {/* 장인 3 - 오태양 목공예가 */}
                    <div className="master-card">
                        <div className="master-card-top">
                            <div className="artisan-avatar av3" style={{ width: 72, height: 72, fontSize: 30, flexShrink: 0 }}>🪵</div>
                            <div className="master-card-info">
                                <div className="master-card-name">오태양</div>
                                <div className="master-card-title">목공예가</div>
                                <div className="master-card-meta">
                                    <span>📍 강원도 홍천</span>
                                    <span> · 경력 20년</span>
                                </div>
                            </div>
                        </div>
                        <div className="master-card-specialty">원목 가구 · 생활 소품</div>
                        <p className="master-card-story">
                            홍천 산속 작업실에서 북미산 원목과 함께하는 오태양 목공예가.
                            나무 본연의 결과 색을 살린 미니멀한 설계로
                            오래 사용할수록 빛나는 작품을 만듭니다.
                        </p>
                        <div className="master-card-footer">
                            <div className="master-card-stat">
                                <span className="master-stat-num">31</span>
                                <span className="master-stat-label">등록 작품</span>
                            </div>
                            <div className="master-card-stat">
                                <span className="master-stat-num">485</span>
                                <span className="master-stat-label">판매 수</span>
                            </div>
                            <button className="master-view-btn">작품 보기 →</button>
                        </div>
                    </div>

                    {/* 장인 4 - 김예린 금속공예가 */}
                    <div className="master-card">
                        <div className="master-card-top">
                            <div className="artisan-avatar av1" style={{ width: 72, height: 72, fontSize: 30, flexShrink: 0 }}>💍</div>
                            <div className="master-card-info">
                                <div className="master-card-name">김예린</div>
                                <div className="master-card-title">금속공예가</div>
                                <div className="master-card-meta">
                                    <span>📍 서울 종로구</span>
                                    <span> · 경력 8년</span>
                                </div>
                            </div>
                        </div>
                        <div className="master-card-specialty">925 실버 · 14K 골드 · 천연석</div>
                        <p className="master-card-story">
                            홍익대 금속공예학과를 졸업 후 소규모 공방에서 하나하나 손으로 만드는 김예린 작가.
                            자연에서 가져온 원석과 금속의 만남으로
                            특별한 순간을 기념하는 주얼리를 제작합니다.
                        </p>
                        <div className="master-card-footer">
                            <div className="master-card-stat">
                                <span className="master-stat-num">42</span>
                                <span className="master-stat-label">등록 작품</span>
                            </div>
                            <div className="master-card-stat">
                                <span className="master-stat-num">627</span>
                                <span className="master-stat-label">판매 수</span>
                            </div>
                            <button className="master-view-btn">작품 보기 →</button>
                        </div>
                    </div>

                    {/* 장인 5 - 최민준 캔들메이커 */}
                    <div className="master-card">
                        <div className="master-card-top">
                            <div className="artisan-avatar av2" style={{ width: 72, height: 72, fontSize: 30, flexShrink: 0 }}>🕯️</div>
                            <div className="master-card-info">
                                <div className="master-card-name">최민준</div>
                                <div className="master-card-title">캔들메이커</div>
                                <div className="master-card-meta">
                                    <span>📍 부산 해운대구</span>
                                    <span> · 경력 6년</span>
                                </div>
                            </div>
                        </div>
                        <div className="master-card-specialty">소이 캔들 · 아로마 블렌딩</div>
                        <p className="master-card-story">
                            향기 조향사 자격을 보유한 최민준은 국내에서 직접 재배한 허브와
                            꽃에서 추출한 에센셜 오일만 사용합니다. 공간을 바꾸는 향기,
                            환경을 생각하는 소이 왁스로 특별한 캔들을 만듭니다.
                        </p>
                        <div className="master-card-footer">
                            <div className="master-card-stat">
                                <span className="master-stat-num">15</span>
                                <span className="master-stat-label">등록 작품</span>
                            </div>
                            <div className="master-card-stat">
                                <span className="master-stat-num">1,203</span>
                                <span className="master-stat-label">판매 수</span>
                            </div>
                            <button className="master-view-btn">작품 보기 →</button>
                        </div>
                    </div>

                    {/* 장인 6 - 정민아 가죽공예가 */}
                    <div className="master-card">
                        <div className="master-card-top">
                            <div className="artisan-avatar av3" style={{ width: 72, height: 72, fontSize: 30, flexShrink: 0 }}>👜</div>
                            <div className="master-card-info">
                                <div className="master-card-name">정민아</div>
                                <div className="master-card-title">가죽공예가</div>
                                <div className="master-card-meta">
                                    <span>📍 대구 중구</span>
                                    <span> · 경력 12년</span>
                                </div>
                            </div>
                        </div>
                        <div className="master-card-specialty">베지터블 탄닝 · 핸드 스티치</div>
                        <p className="master-card-story">
                            이탈리아 피렌체에서 가죽 가공 기술을 연마하고 귀국한 정민아 작가.
                            식물성 탄닝 방식으로 무두질된 가죽으로만 작업하며,
                            시간이 지날수록 더 아름다워지는 빈티지 감성의 가방과 소품을 제작합니다.
                        </p>
                        <div className="master-card-footer">
                            <div className="master-card-stat">
                                <span className="master-stat-num">28</span>
                                <span className="master-stat-label">등록 작품</span>
                            </div>
                            <div className="master-card-stat">
                                <span className="master-stat-num">394</span>
                                <span className="master-stat-label">판매 수</span>
                            </div>
                            <button className="master-view-btn">작품 보기 →</button>
                        </div>
                    </div>

                </div>
            </div>

            {/* 입점 신청 배너 */}
            <div className="master-cta-banner">
                <div className="section-label" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>Join Us</div>
                <h2 className="master-cta-title">당신도 장인이신가요?</h2>
                <p className="master-cta-desc">
                    메종 아르티잔과 함께 당신의 작품을 세상에 선보이세요.<br />
                    전문 팀이 입점부터 판매까지 함께합니다.
                </p>
                <button className="btn-primary" style={{ background: 'var(--cream)', color: 'var(--dark)' }}>
                    입점 신청하기
                </button>
            </div>

        </div>
    );
};

export default MasterInfo;
