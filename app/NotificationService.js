import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as Device from 'expo-device';

// Sample quotes
const quotes = [
  {
    "quote": "The best way to find yourself is to lose yourself in the service of others.",
    "author": "Mahatma Gandhi"
  },
  {
    "quote": "Happiness is not something ready made. It comes from your own actions.",
    "author": "Dalai Lama"
  },
  {
    "quote": "In three words I can sum up everything I've learned about life: it goes on.",
    "author": "Robert Frost"
  },
  {
    "quote": "Life is what happens when you're busy making other plans.",
    "author": "John Lennon"
  },
  {
    "quote": "Get busy living or get busy dying.",
    "author": "Stephen King"
  }
];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function handleRegistrationError(errorMessage) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

// Request permissions
export const registerForPushNotificationsAsync = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }

  return true;
};

// Schedule notifications
export const scheduleNotifications = async () => {
  await registerForPushNotificationsAsync();

  // Cancel any previously scheduled notifications
  await Notifications.cancelAllScheduledNotificationsAsync();

  const times = ['08:00', '19:55', "15:00"];
  
  times.forEach(async (time) => {
    const [hour, minute] = time.split(':').map(Number);

    // Create a date object for the next notification
    const now = new Date();
    const nextNotificationDate = new Date();
    nextNotificationDate.setHours(hour);
    nextNotificationDate.setMinutes(minute);
    nextNotificationDate.setSeconds(0);

    if (nextNotificationDate <= now) {
      nextNotificationDate.setDate(nextNotificationDate.getDate() + 1);
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Daily Quote",
        body: getRandomQuote(),
      },
      trigger: {
        hour: hour,
        minute: minute,
        repeats: true,
      },
    });
  });
};

const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return `${quotes[randomIndex].quote} - ${quotes[randomIndex].author}`;
};
