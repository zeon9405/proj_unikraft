import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

/**
 * 소셜 로그인 완료 후 백엔드에서 리다이렉트되는 콜백 페이지
 * URL 파라미터: code (임시 코드, 5분 유효 1회용)
 *
 * 보안: URL에 JWT가 직접 노출되지 않도록 임시 코드 방식 사용.
 * 코드로 /api/auth/token을 호출하여 실제 토큰을 교환한다.
 */
const OAuth2Callback = ({ setUser }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const called = useRef(false);

    useEffect(() => {
        if (called.current) return;
        called.current = true;
        const code  = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            alert('소셜 로그인 실패: ' + decodeURIComponent(error));
            navigate('/login');
            return;
        }

        if (!code) {
            navigate('/login');
            return;
        }

        axios.get(`/api/auth/token?code=${code}`)
            .then(res => {
                const { token, userId, name, role } = res.data;

                localStorage.setItem('token', token);

                const userData = { userId, userName: name, role };
                localStorage.setItem('user', JSON.stringify(userData));
                if (setUser) setUser(userData);

                navigate('/');
            })
            .catch(() => {
                alert('소셜 로그인 처리 중 오류가 발생했습니다.');
                navigate('/login');
            });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <p>소셜 로그인 처리 중입니다...</p>
        </div>
    );
};

export default OAuth2Callback;
