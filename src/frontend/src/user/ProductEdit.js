import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { uploadProductImage } from '../api';

const ProductEdit = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        categoryId: '',
        pdName: '',
        pdPrice: '',
        pdCnt: '',
        status: 0,
        keyword: '',
        contents: '',
        imgUrl: '',
    });
    const [imgPreview, setImgPreview] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        if (user.role !== 1 && user.role !== 2) { navigate('/'); return; }

        api.get('/api/category/all').then(res => setCategories(res.data));

        api.get(`/api/product/view/${id}`)
            .then(res => {
                const p = res.data;
                setForm({
                    categoryId: p.categoryId || '',
                    pdName: p.pdName || '',
                    pdPrice: p.pdPrice || '',
                    pdCnt: p.pdCnt || '',
                    status: p.status ?? 0,
                    keyword: p.keyword || '',
                    contents: p.contents || '',
                    imgUrl: p.imgUrl || '',
                });
                if (p.imgUrl) setImgPreview(p.imgUrl);
            })
            .catch(() => setError('상품 정보를 불러오지 못했습니다.'));
    }, [id, user, navigate]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleImgChange = async e => {
        const file = e.target.files[0];
        if (file) {
            setImgPreview(URL.createObjectURL(file));
            const url = await uploadProductImage(file);
            setForm(prev => ({ ...prev, imgUrl: url }));
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');

        try {
            const res = await api.put(`/api/product/edit/${id}`, {
                categoryId: Number(form.categoryId),
                pdName: form.pdName,
                pdPrice: Number(form.pdPrice),
                pdCnt: Number(form.pdCnt),
                status: Number(form.status),
                keyword: form.keyword,
                contents: form.contents,
                imgUrl: form.imgUrl,
            });
            navigate(`/product/view/${res.data.pdId}`);
        } catch (err) {
            setError('상품 수정에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('정말 이 상품을 삭제하시겠습니까?')) return;
        try {
            await api.delete(`/api/product/${id}`);
            navigate('/mypage');
        } catch (err) {
            setError('상품 삭제에 실패했습니다.');
        }
    };

    if (!user || (user.role !== 1 && user.role !== 2)) return null;

    return (
        <div style={{ paddingTop: '80px' }}>

            {/* 페이지 헤더 */}
            <div className="page-banner" style={{ paddingBottom: 40 }}>
                <div className="page-banner-inner">
                    <div className="section-label">Product Edit · No.{id}</div>
                    <h1 className="page-banner-title">상품 <em>수정</em></h1>
                    <p className="page-banner-desc">상품 정보를 수정하고 저장하세요.</p>
                </div>
            </div>

            {/* 폼 영역 */}
            <div className="product-form-wrap">
                <form className="product-form" onSubmit={handleSubmit}>

                    {error && <p style={{ color: 'red', marginBottom: 16 }}>{error}</p>}

                    {/* 기본 정보 섹션 */}
                    <div className="product-form-section">
                        <h3 className="product-form-section-title">기본 정보</h3>

                        <div className="product-form-row">
                            <div className="product-form-field">
                                <label className="product-form-label">카테고리 <span className="required">*</span></label>
                                <select
                                    className="product-form-input"
                                    name="categoryId"
                                    value={form.categoryId}
                                    onChange={handleChange}
                                >
                                    <option value="">카테고리를 선택하세요</option>
                                    {categories.map(cat => (
                                        <option key={cat.categoryId} value={cat.categoryId}>
                                            {cat.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="product-form-field">
                                <label className="product-form-label">판매 상태 <span className="required">*</span></label>
                                <select
                                    className="product-form-input"
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                >
                                    <option value={0}>판매중</option>
                                    <option value={1}>판매 중지</option>
                                    <option value={2}>품절</option>
                                </select>
                            </div>
                        </div>

                        <div className="product-form-field">
                            <label className="product-form-label">상품명 <span className="required">*</span></label>
                            <input
                                className="product-form-input"
                                type="text"
                                name="pdName"
                                value={form.pdName}
                                onChange={handleChange}
                                placeholder="상품 이름을 입력하세요"
                            />
                        </div>

                        <div className="product-form-field">
                            <label className="product-form-label">키워드 · 태그</label>
                            <input
                                className="product-form-input"
                                type="text"
                                name="keyword"
                                value={form.keyword}
                                onChange={handleChange}
                                placeholder="예) 도자기,수공예,선물"
                            />
                        </div>
                    </div>

                    {/* 상세 정보 섹션 */}
                    <div className="product-form-section">
                        <h3 className="product-form-section-title">상세 정보</h3>

                        <div className="product-form-field">
                            <label className="product-form-label">상품 설명 <span className="required">*</span></label>
                            <textarea
                                className="product-form-input product-form-textarea"
                                name="contents"
                                value={form.contents}
                                onChange={handleChange}
                                placeholder="상품에 대한 상세한 설명을 입력하세요."
                                rows={6}
                            />
                        </div>
                    </div>

                    {/* 가격 · 재고 섹션 */}
                    <div className="product-form-section">
                        <h3 className="product-form-section-title">가격 · 재고</h3>

                        <div className="product-form-row">
                            <div className="product-form-field">
                                <label className="product-form-label">판매 가격 <span className="required">*</span></label>
                                <div className="product-form-input-unit">
                                    <input
                                        className="product-form-input"
                                        type="number"
                                        name="pdPrice"
                                        value={form.pdPrice}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                    />
                                    <span className="product-form-unit">원</span>
                                </div>
                            </div>
                            <div className="product-form-field">
                                <label className="product-form-label">재고 수량 <span className="required">*</span></label>
                                <div className="product-form-input-unit">
                                    <input
                                        className="product-form-input"
                                        type="number"
                                        name="pdCnt"
                                        value={form.pdCnt}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                    />
                                    <span className="product-form-unit">개</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 이미지 섹션 */}
                    <div className="product-form-section">
                        <h3 className="product-form-section-title">상품 이미지</h3>

                        <div className="product-img-upload-area">
                            <label className="product-img-upload-label" htmlFor="productImgEdit">
                                {imgPreview ? (
                                    <img src={imgPreview} alt="미리보기" className="product-img-preview" />
                                ) : (
                                    <div className="product-img-bg p1" style={{ width: '100%', height: '100%', borderRadius: 4 }}>
                                        <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, textAlign: 'center' }}>
                                            <span style={{ fontSize: 11, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>
                                                클릭하여 이미지 변경
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </label>
                            <input
                                id="productImgEdit"
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleImgChange}
                            />
                        </div>
                    </div>

                    {/* 버튼 영역 */}
                    <div className="product-form-actions">
                        <Link to="/mypage" className="product-form-cancel">취소</Link>
                        <button type="button" className="product-form-delete" onClick={handleDelete}>상품 삭제</button>
                        <button type="submit" className="product-form-submit">수정 완료</button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ProductEdit;
