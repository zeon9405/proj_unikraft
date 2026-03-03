import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import LoadingCard from '../LoadingCard';
import api from '../api';

const InquiryView = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [inquiry, setInquiry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [forbidden, setForbidden] = useState(false);

    useEffect(() => {
        api.get(`/api/inquiry/view/${id}`)
            .then(res => { setInquiry(res.data); setLoading(false); })
            .catch(err => {
                if (err.response?.status === 403) { setForbidden(true); }
                setLoading(false);
            });
    }, [id, user]);

    const handleDelete = () => {
        if (!window.confirm('문의를 삭제하시겠습니까?')) return;
        api.delete(`/api/inquiry/${id}`)
            .then(() => navigate('/inquiry'))
            .catch(() => alert('삭제에 실패했습니다.'));
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    };

    if (loading) return <LoadingCard message="문의 내용을 불러오는 중입니다" />;

    if (forbidden) {
        return (
            <div className="loading-page">
                <div className="loading-card" style={{ gap: 16 }}>
                    <div style={{ fontSize: 36 }}>🔒</div>
                    <p className="loading-message">비밀글입니다</p>
                    <p className="loading-sub-message" style={{ opacity: 0.7, textTransform: 'none', letterSpacing: 0, fontSize: 13 }}>
                        이 문의는 작성자 본인만 열람할 수 있습니다.
                    </p>
                    <Link to="/inquiry" className="inquiry-write-btn" style={{ marginTop: 8 }}>목록으로 돌아가기</Link>
                </div>
            </div>
        );
    }

    if (!inquiry) {
        return (
            <div className="loading-page">
                <div className="loading-card">
                    <p className="loading-message">문의를 찾을 수 없습니다.</p>
                </div>
            </div>
        );
    }

    const isMine = user && user.userId === inquiry.userId;

    return (
        <div style={{ paddingTop: '80px' }}>
            <div className="page-banner" style={{ paddingBottom: 40 }}>
                <div className="page-banner-inner">
                    <div className="section-label">
                        {inquiry.isSecret ? '🔒 비밀 문의' : '문의게시판'}
                    </div>
                    <h1 className="page-banner-title"><em>{inquiry.title}</em></h1>
                    <p className="page-banner-desc">{inquiry.userName} · {formatDate(inquiry.createdAt)}</p>
                </div>
            </div>

            <div className="inquiry-wrap">
                <div className="inquiry-view-card">
                    {/* 문의 내용 */}
                    <div className="inquiry-view-section">
                        <div className="inquiry-view-label">문의 내용</div>
                        <div className="inquiry-view-content">{inquiry.content}</div>
                    </div>

                    {/* 답변 */}
                    <div className={`inquiry-view-section answer-section${inquiry.answer ? ' has-answer' : ''}`}>
                        <div className="inquiry-view-label">
                            {inquiry.answer ? '답변' : '답변 대기중'}
                        </div>
                        {inquiry.answer ? (
                            <>
                                <div className="inquiry-view-content answer-content">{inquiry.answer}</div>
                                <div className="inquiry-answer-date">답변일: {formatDate(inquiry.answeredAt)}</div>
                            </>
                        ) : (
                            <p style={{ color: 'var(--mid)', fontSize: 14, fontStyle: 'italic' }}>
                                아직 답변이 등록되지 않았습니다. 빠른 시일 내 답변 드리겠습니다.
                            </p>
                        )}
                    </div>

                    {/* 버튼 영역 */}
                    <div className="inquiry-view-actions">
                        <Link to="/inquiry" className="mypage-view-btn">목록</Link>
                        {isMine && (
                            <button className="mypage-edit-btn" onClick={handleDelete}
                                style={{ background: 'var(--rose-taupe)', color: 'white', border: 'none' }}>
                                삭제
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InquiryView;
