import { createContext, useState, useEffect, useContext } from "react";
import { fakeFetchAssets, fakeFetchCrypto } from "../api";
import { percentDifference } from "../utils";
import { useNavigate } from "react-router-dom";

export const CryptoContext = createContext({
  assets: [],
  crypto: [],
  loading: false,
  user: null,
  logout: () => {},
});

export const CryptoContextProvider = ({ children }) => {
  const navigate = useNavigate();

  // Индикатор загрузки
  const [loading, setLoading] = useState(false);
  const [crypto, setCrypto] = useState([]);
  const [assets, setAssets] = useState([]);

  // Состояние пользователя
  const [user, setUser] = useState(null);

  // Функция для обработки одного актива
  const mapAsset = (asset, result) => {
    const coin = result.find((c) => c.id === asset.id);
    return {
      grow: asset.price < coin.price, // boolean
      growPercent: percentDifference(asset.price, coin.price),
      totalAmount: asset.amount * coin.price,
      totalProfit: asset.amount * coin.price - asset.amount * asset.price,
      name: coin.name,
      ...asset,
    };
  };

  // Загрузка данных пользователя при инициализации (например, с эндпоинта /me)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    fetch("http://localhost:3001/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => {
          console.log(res)
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        })
        .then((data) => {
          setUser(data);
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem("token");
          navigate("/login");
        })
        .finally(() => setLoading(false));
  }, [navigate]);

  useEffect(() => {
    async function preload() {
      setLoading(true);
      const { result } = await fakeFetchCrypto();
      const assets = await fakeFetchAssets();

      // Обрабатываем каждый актив и обновляем состояние
      const mappedAssets = assets.map((asset) => mapAsset(asset, result));
      setAssets(mappedAssets);

      setCrypto(result);
      setLoading(false);
    }
    preload();
  }, []);

  const addAsset = (newAsset) => {
    // Обрабатываем новый актив и добавляем его в список
    const mappedAsset = mapAsset(newAsset, crypto);
    setAssets((prev) => [...prev, mappedAsset]);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
      <CryptoContext.Provider
          value={{ loading, crypto, assets, addAsset, user, logout }}
      >
        {children}
      </CryptoContext.Provider>
  );
};

// Упрощение для CryptoContext
export const useCrypto = () => {
  return useContext(CryptoContext);
};
