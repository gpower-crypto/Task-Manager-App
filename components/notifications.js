import { Notifications } from "react-native-notifications";

export const configureNotifications = () => {
  Notifications.registerRemoteNotifications();

  Notifications.events().registerNotificationReceivedForeground(
    (notification, completion) => {
      console.log("Notification Received - Foreground", notification);
      completion({ alert: false, sound: false, badge: false });
    }
  );

  Notifications.events().registerNotificationOpened(
    (notification, completion) => {
      console.log("Notification opened by device user", notification);
      completion();
    }
  );
};
