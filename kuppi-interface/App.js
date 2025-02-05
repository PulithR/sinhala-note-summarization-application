import { useEffect, useState } from "react";
import SplashScreen from "./screens/SplashScreen";
import GetStarted from "./screens/GetStarted";
import LoginScreen from "./screens/LoginScreen";


const App = () => {

  const [showSplashScreen, setShowSplashScreen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplashScreen(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return <>{showSplashScreen ? <SplashScreen /> : <GetStarted/>}</>;
};

export default App;
