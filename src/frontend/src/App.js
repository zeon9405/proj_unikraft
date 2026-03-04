// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Main from './Main';
import NewProductList from './user/NewProductList';
import MasterInfo from './user/MasterInfo';
import MasterList from './user/MasterList';
import MasterView from './user/MasterView';
import Login from './user/Login';
import Join from './user/Join';
import Cart from './user/Cart';
import api from './api';
import ProductList from './user/ProductList';
import ProductWrite from './user/ProductWrite';
import ProductEdit from './user/ProductEdit';
import ProductView from './user/ProductView';
import Mypage from './user/Mypage';
import EditProfile from './user/EditProfile';
import FindAccount from './user/FindAccount';
import OAuth2Callback from './user/OAuth2Callback';
import InquiryList from './user/InquiryList';
import InquiryWrite from './user/InquiryWrite';
import InquiryView from './user/InquiryView';
import Checkout from './user/Checkout';
import OrderSuccess from './user/OrderSuccess';
import OrderFail from './user/OrderFail';
import OrderList from './user/OrderList';
import OrderView from './user/OrderView';
import AdminOrderList from './user/AdminOrderList';
import './main.css';

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [pathname]);
    return null;
}

function NavBar({ user, setUser, categories, categoriesLoading, cartCount }) {
    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <nav>
            <Link to="/" style={{ textDecoration: 'none' }}>
                <img src="/logo.svg" alt="MAISON ARTISAN" style={{ height: '60px' }} />
            </Link>
            <ul className="nav-links">
                <li className="nav-item"><Link to="/newProduct">신규입고</Link></li>
                <li className="nav-item">
                    <a href="#">카테고리</a>
                    <ul className="nav-dropdown">
                        <li><Link to="/category/ALL">All</Link></li>
                        {categoriesLoading ? (
                            <li><span style={{ padding: '6px 16px', display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>불러오는 중...</span></li>
                        ) : (
                            categories.map((cat) => (
                                <li key={cat.categoryId}><Link to={`/category/${cat.categoryId}`}>{cat.categoryName}</Link></li>
                            ))
                        )}
                    </ul>
                </li>
                <li className="nav-item"><Link to="/master/list">장인소개</Link></li>
            </ul>
            <div className="nav-actions">
                {user ? (
                    <>
                        <Link to="/mypage" className="nav-action-link">{user.userName}님</Link>
                        <button className="nav-action-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={handleLogout}>로그아웃</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-action-link">로그인</Link>
                        <Link to="/join" className="nav-action-link">회원가입</Link>
                    </>
                )}
                <Link
                    to={user ? '/cart' : '/login'}
                    className="nav-action-link cart-btn"
                >장바구니 ({cartCount})</Link>
            </div>
        </nav>
    );
}

function App() {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user') || 'null');
        } catch {
            return null;
        }
    });

    const [cartCount, setCartCount] = useState(0);
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    useEffect(() => {
        if (!user) { setCartCount(0); return; }
        const fetchCount = () => {
            api.get('/api/cart/count')
                .then(res => setCartCount(res.data.count))
                .catch(() => setCartCount(0));
        };
        fetchCount();
        window.addEventListener('cart-updated', fetchCount);
        return () => window.removeEventListener('cart-updated', fetchCount);
    }, [user]);

    useEffect(() => {
        fetch('/api/category/all')
            .then(res => {
                if (!res.ok) throw new Error('카테고리 로드 실패');
                return res.json();
            })
            .then(data => {
                setCategories(data);
                setCategoriesLoading(false);
            })
            .catch(err => {
                console.error('카테고리 호출 실패:', err);
                setCategoriesLoading(false);
            });
    }, []);

    const handleSetUser = (userData) => {
        setUser(userData);
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            localStorage.removeItem('user');
        }
    };

    return (
        <BrowserRouter>
            <ScrollToTop />
            <NavBar
                user={user}
                setUser={handleSetUser}
                categories={categories}
                categoriesLoading={categoriesLoading}
                cartCount={cartCount}
            />

            <div>
                <Routes>
                    <Route path="/" element={<Main user={user} />} />
                    <Route path="/newProduct" element={<NewProductList />} />
                    <Route path="/masters" element={<MasterInfo />} />
                    <Route path="/master/list" element={<MasterList />} />
                    <Route path="/master/view/:userId" element={<MasterView />} />
                    <Route path="/login" element={<Login setUser={handleSetUser} />} />
                    <Route path="/oauth2/callback" element={<OAuth2Callback setUser={handleSetUser} />} />
                    <Route path="/join" element={<Join />} />
                    <Route path="/find-account" element={<FindAccount />} />
                    <Route path="/cart" element={<Cart user={user} />} />
                    <Route path="/mypage" element={<Mypage user={user} />} />
                    <Route path="/mypage/edit" element={<EditProfile user={user} setUser={handleSetUser} />} />
                    <Route path="/inquiry" element={<InquiryList user={user} />} />
                    <Route path="/inquiry/write" element={<InquiryWrite user={user} />} />
                    <Route path="/inquiry/view/:id" element={<InquiryView user={user} />} />
                    <Route path="/category/:categoryId" element={<ProductList user={user} categories={categories} categoriesLoading={categoriesLoading} />} />
                    <Route path="/product/list/:categoryId" element={<ProductList user={user} categories={categories} categoriesLoading={categoriesLoading} />} />
                    <Route path="/product/write" element={<ProductWrite user={user} />} />
                    <Route path="/product/edit/:id" element={<ProductEdit user={user} />} />
                    <Route path="/product/view/:id" element={<ProductView user={user} />} />
                    <Route path="/checkout" element={<Checkout user={user} />} />
                    <Route path="/order/success" element={<OrderSuccess user={user} />} />
                    <Route path="/order/fail" element={<OrderFail user={user} />} />
                    <Route path="/mypage/orders" element={<OrderList user={user} />} />
                    <Route path="/order/view/:id" element={<OrderView user={user} />} />
                    <Route path="/admin/orders" element={<AdminOrderList user={user} />} />
                </Routes>
            </div>

            <footer>
                <div className="footer-top">
                    <div>
                        <div className="footer-brand">MAISON <span>ARTISAN</span></div>
                        <p className="footer-tagline">손으로 만든 것들의 가치를 잇는 플랫폼. 전국 장인과 당신을 연결합니다.</p>
                        <div className="footer-social">
                            <a href="#" className="social-btn">📷</a>
                            <a href="#" className="social-btn">🐦</a>
                            <a href="#" className="social-btn">▶</a>
                            <a href="#" className="social-btn">💬</a>
                        </div>
                    </div>
                </div>
                <hr className="footer-divider" />
                <div className="footer-bottom">
                    <p className="footer-copy">© 2025 Maison Artisan. 대한민국 서울시 마포구 합정동. 사업자등록번호 123-45-67890</p>
                </div>
            </footer>
        </BrowserRouter>
    );
}

export default App;
