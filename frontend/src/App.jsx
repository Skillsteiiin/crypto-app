import { CryptoContextProvider } from "./Context/Crypto-context";
import Applayout from "./Components/Layout/AppLayout";

const App = () => {
  return (
    <CryptoContextProvider>
      <Applayout />
    </CryptoContextProvider>
  );
};

export default App;
