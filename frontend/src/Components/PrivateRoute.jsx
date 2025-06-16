// src/components/PrivateRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
    const [isAuth, setIsAuth] = useState(null); // null — пока проверяем, true/false — результат проверки

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsAuth(false);
            return;
        }

        // Проверим токен на сервере (по API /me)
        fetch('http://localhost:3001/me', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Unauthorized');
            })
            .then(data => {
                setIsAuth(true); // Токен валиден
            })
            .catch(() => {
                setIsAuth(false); // Токен невалидный или ошибка
                localStorage.removeItem('token');
            });
    }, []);

    if (isAuth === null) {
        // Пока идёт проверка токена — можно показывать загрузку
        return <div>Загрузка...</div>;
    }

    if (!isAuth) {
        // Не авторизован — редирект на логин
        return <Navigate to="/login" replace />;
    }

    // Авторизован — рендерим дочерние компоненты
    return children;
}

export default PrivateRoute;
