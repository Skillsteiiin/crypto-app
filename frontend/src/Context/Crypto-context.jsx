import { createContext, useState, useEffect, useContext } from "react";
import { fakeFetchAssets, fakeFetchCrypto } from "../api";
import { percentDifference } from "../utils";

export const CryptoContext = createContext({
  assets: [],
  crypto: [],
  loading: false,
});

export const CryptoContextProvider = ({ children }) => {
  // Индикатор загрузки
  const [loading, setLoading] = useState(false);
  const [crypto, setCrypto] = useState([]);
  const [assets, setAssets] = useState([]);

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

  return (
    <CryptoContext.Provider value={{ loading, crypto, assets, addAsset }}>
      {children}
    </CryptoContext.Provider>
  );
};

// Упрощение для CryptoContext
export const useCrypto = () => {
  return useContext(CryptoContext);
};