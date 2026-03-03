import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingCard from '../LoadingCard';

const InquiryList = ({ user }) => {
    const navigate = useNavigate();
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/inquiry/list')
            .then(res => res.json())
            .then(data => { setInquiries(data); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    }, []);

    const handleRowClick = (item) => {
        if (item.isSecret && (!user || user.userId !== item.userId)) {
            alert('비밀글은 작성자 본인만 열람할 수 있습니다.');
            return;
        }
        navigate(`/inquiry/view/${item.inquiryId}`);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
    };

    return (
        <div style={{ paddingTop: '80px' }}>
            <div className="page-banner">
                <div className="page-banner-inner">
                    <div className="section-label">Customer Service</div>
                    <h1 className="page-banner-title"><em>문의게시판</em></h1>
                    <p className="page-banner-desc">궁금한 점을 남겨주세요. 신속하게 답변 드리겠습니다.</p>
                </div>
                <div className="page-banner-badge">
                    <span className="page-banner-count">{loading ? '…' : inquiries.length}</span>
                    <span className="page-banner-count-label">개 문의</span>
                </div>
            </div>

            <div className="inquiry-wrap">
                <div className="inquiry-toolbar">
                    {user ? (
                        <Link to="/inquiry/write" className="inquiry-write-btn">+ 문의 작성</Link>
                    ) : (
                        <Link to="/login" className="inquiry-write-btn">로그인 후 작성</Link>
                    )}
                </div>

                <div className="inquiry-list">
                    <div className="inquiry-list-header">
                        <span className="inquiry-col-num">번호</span>
                        <span className="inquiry-col-title">제목</span>
                        <span className="inquiry-col-author">작성자</span>
                        <span className="inquiry-col-date">날짜</span>
                        <span className="inquiry-col-status">답변</span>
                    </div>

                    {loading ? (
                        <LoadingCard message="문의 목록을 불러오는 중입니다" fullPage={false} />
                    ) : inquiries.length === 0 ? (
                        <div className="inquiry-empty">
                            <p>등록된 문의가 없습니다.</p>
                        </div>
                    ) : (
                        inquiries.map((item, idx) => {
                            const isMine = user && user.userId === item.userId;
                            const canView = !item.isSecret || isMine;
                            return (
                                <div
                                    key={item.inquiryId}
                                    className={`inquiry-row${!canView ? ' secret' : ''}`}
                                    onClick={() => handleRowClick(item)}
                                >
                                    <span className="inquiry-col-num">{inquiries.length - idx}</span>
                                    <span className="inquiry-col-title">
                                        {item.isSecret && <span className="inquiry-lock">🔒</span>}
                                        {canView ? item.title : '비밀글입니다.'}
                                        {isMine && <span className="inquiry-mine-badge">내 글</span>}
                                    </span>
                                    <span className="inquiry-col-author">{item.userName}</span>
                                    <span className="inquiry-col-date">{formatDate(item.createdAt)}</span>
                                    <span className="inquiry-col-status">
                                        <span className={`inquiry-answer-badge ${item.answered ? 'done' : 'waiting'}`}>
                                            {item.answered ? '답변완료' : '대기중'}
                                        </span>
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default InquiryList;
