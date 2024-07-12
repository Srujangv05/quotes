import SplashScreen from "./SplashScreen";
import HomeScreen from "./index";
import { scheduleNotifications } from "./NotificationService";
import { useEffect, useState } from "react";

const RootLayout = () => {
  const [isSplash, setIsSplash] = useState(true);

  useEffect(() => {
    scheduleNotifications();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsSplash(false);
    }, 3000);
  });
  return <>{isSplash ? <SplashScreen /> : <HomeScreen />}</>;
};

export default RootLayout;
