import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { uploadProductImage } from '../api';

const ProductWrite = ({ user }) => {
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
    }, [user, navigate]);

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

        if (!form.categoryId || !form.pdName || !form.pdPrice || !form.pdCnt || !form.contents) {
            setError('필수 항목을 모두 입력해주세요.');
            return;
        }

        try {
            const res = await api.post('/api/product/write', {
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
            setError('상품 등록에 실패했습니다. 다시 시도해주세요.');
        }
    };

    if (!user || (user.role !== 1 && user.role !== 2)) return null;

    return (
        <div style={{ paddingTop: '80px' }}>

            {/* 페이지 헤더 */}
            <div className="page-banner" style={{ paddingBottom: 40 }}>
                <div className="page-banner-inner">
                    <div className="section-label">Product Registration</div>
                    <h1 className="page-banner-title">상품 <em>등록</em></h1>
                    <p className="page-banner-desc">새로운 작품을 등록하고 고객에게 선보이세요.</p>
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
                                placeholder="상품 이름을 입력하세요 (최대 50자)"
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
                            <label className="product-img-upload-label" htmlFor="productImg">
                                {imgPreview ? (
                                    <img src={imgPreview} alt="미리보기" className="product-img-preview" />
                                ) : (
                                    <>
                                        <span className="product-img-upload-icon">📷</span>
                                        <span className="product-img-upload-text">이미지를 업로드하세요</span>
                                        <span className="product-img-upload-desc">JPG, PNG, WEBP · 최대 10MB · 권장 800×800px</span>
                                    </>
                                )}
                            </label>
                            <input
                                id="productImg"
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleImgChange}
                            />
                        </div>
                    </div>

                    {/* 버튼 영역 */}
                    <div className="product-form-actions">
                        <Link to="/category/all" className="product-form-cancel">취소</Link>
                        <button type="submit" className="product-form-submit">상품 등록</button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ProductWrite;
