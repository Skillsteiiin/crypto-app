import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Ошибка авторизации');
                return;
            }

            // Сохраняем токен в localStorage
            localStorage.setItem('token', data.token);

            // Успешный логин — редирект на защищённую страницу
            navigate('/dashboard');
        } catch (err) {
            setError('Ошибка сети');
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Вход</h2>

            {error && <p className={styles.error}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Email:</label>
                    <input
                        className={styles.input}
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Пароль:</label>
                    <input
                        className={styles.input}
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button className={styles.button} type="submit">Войти</button>
            </form>
        </div>
    );
}

export default Login;
