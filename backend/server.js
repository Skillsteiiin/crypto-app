const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const app = express();
const PORT = 3001;

const SECRET_KEY = 'your_secret_key'; // Замени на переменную окружения в проде

app.use(cors({
    origin: 'http://localhost:5174', // Адрес твоего фронтенда
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Регистрация пользователя
app.post('/register', (req, res) => {
    console.log('POST /register called');
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        function (err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(409).json({ error: 'Email already in use.' });
                }
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID, name, email });
        }
    );
});

// Авторизация пользователя
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) return res.status(401).json({ error: 'Invalid email or password.' });

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    });
});

// Middleware для проверки и декодирования JWT из заголовка Authorization
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // Заголовок обычно вида: "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access token missing' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token' });
        req.user = user; // { id, email }
        next();
    });
}

// Метод GET /me
app.get('/me', authenticateToken, (req, res) => {
    const userId = req.user.id;

    db.get('SELECT id, name, email FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    });
});


app.listen(PORT, (err) => {
    if (err) {
        console.error('Ошибка при запуске сервера:', err);
        process.exit(1);
    }
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
