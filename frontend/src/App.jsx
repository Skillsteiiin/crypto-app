import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import { CryptoContextProvider } from "./Context/Crypto-context";
import Applayout from "./Components/Layout/AppLayout";
import PrivateRoute from "./Components/PrivateRoute.jsx";

function App() {
    return (
        <Router>
            <Routes>
                {/* Редирект с корня на логин */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* Защищённый маршрут */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <CryptoContextProvider>
                                <Applayout />
                            </CryptoContextProvider>
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
