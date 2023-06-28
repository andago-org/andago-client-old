import OneSignalClient, { OneSignalPlugin } from 'onesignal-cordova-plugin';

class OneSignal
{
  public client = OneSignalClient as OneSignalPlugin;

  public init(): void {
    // Uncomment to set OneSignal device logging to VERBOSE  
    // OneSignal.setLogLevel(6, 0);
  
    // NOTE: Update the setAppId value below with your OneSignal AppId.
    this.client.setAppId("62355bcd-0500-4361-890b-4aafe57b7b42");
    this.client.setNotificationOpenedHandler((jsonData) => {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    });
  
    // Prompts the user for notification permissions.
    //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 7) to better communicate to your users what notifications they will get.
    this.client.promptForPushNotificationsWithUserResponse((accepted) => {
        console.log("User accepted notifications: " + accepted);
    });
  }
}

const oneSignal = new OneSignal();

export default oneSignal;