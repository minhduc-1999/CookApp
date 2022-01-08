import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:onesignal_flutter/onesignal_flutter.dart';
import 'package:tastify/FoodScreen/FoodActivity.dart';
import 'package:tastify/MessageScreen/MessageActivity.dart';
import 'package:tastify/Model/PostDetailsRespondModel.dart';
import 'package:tastify/NewFeedScreen/NewFeedActivity.dart';
import 'package:tastify/NotificationScreen/NotificationActivity.dart';
import 'package:tastify/ProfileScreen/ProfileActivity.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:tastify/Services/Auth.dart';
import 'package:tastify/Services/SharedService.dart';
import 'package:tastify/StaticComponent/Post.dart';
import 'package:tastify/StaticComponent/PostDetail.dart';
import 'package:tastify/keyOneSignal.dart';

import 'package:tastify/main.dart';

import '../constants.dart';

class NavigationItem {
  const NavigationItem(this.title, this.icon);
  final String title;
  final IconData icon;
}

const List<NavigationItem> allNavigationItems = <NavigationItem>[
  NavigationItem('Home', Icons.home),
  NavigationItem('Food', Icons.lunch_dining),
  NavigationItem('Chatbot', Icons.chat_bubble),
  NavigationItem('Notifications', Icons.notifications),
  NavigationItem('Profile', Icons.person)
];

class HomeActivity extends StatefulWidget {
  final AuthBase auth;

  const HomeActivity({Key key, this.auth}) : super(key: key);
  @override
  HomeActivityState createState() => HomeActivityState(this.auth);
}

class HomeActivityState extends State<HomeActivity> {
  int _currentIndex = 0;
  final AuthBase auth;
  DateTime currentBackPressTime;

  PageController _pageController = PageController(initialPage: 0);

  HomeActivityState(this.auth);

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    //Remove this method to stop OneSignal Debugging
    OneSignal.shared.setLogLevel(OSLogLevel.verbose, OSLogLevel.none);
    OneSignal.shared.setAppId(oneSignalAppID);
// The promptForPushNotificationsWithUserResponse function will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission
    OneSignal.shared.promptUserForPushNotificationPermission().then((accepted) {
      print("Accepted permission: $accepted");
    });
    OneSignal.shared.setNotificationWillShowInForegroundHandler((OSNotificationReceivedEvent event) {
      // Will be called whenever a notification is received in foreground
      // Display Notification, pass null param for not displaying the notification
      event.complete(event.notification);
    });
    OneSignal.shared.setNotificationOpenedHandler((OSNotificationOpenedResult result) async{
      // Will be called whenever a notification is opened/button pressed.
      String templateId = result.notification.additionalData['template_id'];
      if ( templateId == "new_post" || templateId == "comment" || templateId == "react") {
        openImagePost(context, result.notification.additionalData['postID']);
      } else if (templateId == "new_follower"){
        openProfile(context, result.notification.additionalData['followerID']);
      }
    });
    OneSignal.shared.setExternalUserId(currentUserId);
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
        child: Scaffold(
          body: PageView(
            controller: _pageController,
            onPageChanged: (int index) {
              setState(() {
                _currentIndex = index;
              });
            },
            children: <Widget>[
              NewFeedActivity(),
              FoodActivity(),
              MessageActivity(),
              NotificationActivity(),
              ProfileActivity(userId: currentUserId,auth: auth,)
            ],
          ),
          bottomNavigationBar: BottomNavigationBar(
            currentIndex: _currentIndex,
            onTap: (int index) {
              setState(() {
                _pageController.jumpToPage(index);
              });
            },
            items: allNavigationItems.map((NavigationItem navigationItem) {
              return BottomNavigationBarItem(
                  icon: Icon(
                    navigationItem.icon,
                    color: appPrimaryColor,
                  ),
                  backgroundColor: appBackgroundLightColor,
                  title: Text(
                    navigationItem.title,
                    style: TextStyle(color: appPrimaryColor),
                  ));
            }).toList(),
          ),
        ),
        onWillPop: onBackPress);
  }
  void openProfile(BuildContext context, String userId) {
    Navigator.push(
        context,
        MaterialPageRoute(
            builder: (context) => ProfileActivity(
              userId: userId,
            )));
  }
  void openImagePost(BuildContext context, String id) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => PostDetail(id: id)),
    );
  }
  Future<bool> onBackPress() {
    DateTime now = DateTime.now();
    if (currentBackPressTime == null ||
        now.difference(currentBackPressTime) > Duration(seconds: 2)) {
      currentBackPressTime = now;
      return Future.value(false);
    } else {
      return Future.value(true);
    }
  }
}