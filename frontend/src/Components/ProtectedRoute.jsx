import React from 'react';
import { Navigate } from 'react-router-dom';

// Компонент-обёртка для защищённых страниц
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        // Если токена нет — перенаправляем на /register или /login
        return <Navigate to="/register" replace />;
    }

    // Иначе рендерим дочерние компоненты (защищённые страницы)
    return children;
};

export default ProtectedRoute;
