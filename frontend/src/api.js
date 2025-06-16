import { cryptoData, cryptoAssets } from './data';

export function fakeFetchCrypto() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!cryptoData || cryptoData.length === 0) {
                const error = new Error('Crypto data is not available. Please, try later');
                reject(error);
            } else {
                resolve(cryptoData);
            }
        }, 1);
    });
}

export function fakeFetchAssets() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!cryptoAssets || cryptoAssets.length === 0) {
                const error = new Error('Assets data is not available. Please, try later');
                reject(error);
            } else {
                resolve(cryptoAssets);
            }
        }, 1);
    });
}