import React from 'react';

/**
 * fullPage={true}  → 뷰포트 전체 영역을 채우는 로딩 카드 (페이지 전환 시)
 * fullPage={false} → 컨텐츠 영역 안에 인라인으로 들어가는 로딩 카드
 */
const LoadingCard = ({ message = '불러오는 중입니다', fullPage = true }) => (
    <div className={fullPage ? 'loading-page' : 'loading-inline'}>
        <div className="loading-card">
            <div className="loading-spinner-wrap">
                <div className="loading-spinner" />
                <div className="loading-spinner-inner" />
            </div>
            <p className="loading-message">{message}</p>
            <p className="loading-sub-message">잠시만 기다려주세요</p>
        </div>
    </div>
);

export default LoadingCard;
