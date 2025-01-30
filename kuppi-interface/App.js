import { useEffect, useState } from "react";
import SplashScreen from "./screens/SplashScreen";
import GetStarted from "./screens/GetStarted";

const App = () => {
  // Added 'const' to define the component properly

  const [showSplashScreen, setShowSplashScreen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplashScreen(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return <>{showSplashScreen ? <SplashScreen /> : <GetStarted />}</>;
};

export default App;
