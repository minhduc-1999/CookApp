//import 'package:firebase_messaging/firebase_messaging.dart';
import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_client_sse/flutter_client_sse.dart';
import 'package:flutter_observer/Observable.dart';
import 'package:flutter_observer/Observer.dart';

//import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:onesignal_flutter/onesignal_flutter.dart';
import 'package:tastify/FoodScreen/FoodActivity.dart';
import 'package:tastify/MessageScreen/ConversationsActivity.dart';
import 'package:tastify/MessageScreen/MessageActivity.dart';
import 'package:flutter_client_sse/flutter_client_sse.dart';
import 'package:tastify/NewFeedScreen/NewFeedActivity.dart';
import 'package:tastify/NotificationScreen/NotificationActivity.dart';
import 'package:tastify/ProfileScreen/ProfileActivity.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:tastify/Services/Auth.dart';
import 'package:tastify/Services/SharedService.dart';
import 'package:tastify/config.dart';
import '../NewFeedScreen/Post.dart';
import '../NewFeedScreen/PostDetail.dart';
import 'package:tastify/keyOneSignal.dart';

import 'package:tastify/main.dart';

import '../constants.dart';

class NavigationItem {
  NavigationItem(this.title, this.icon, this.selectedIcon, this.totalNew);

  final String title;
  final IconData icon;
  final IconData selectedIcon;
  int totalNew;
}

class HomeActivity extends StatefulWidget {
  final AuthBase auth;

  const HomeActivity({Key key, this.auth}) : super(key: key);

  @override
  HomeActivityState createState() => HomeActivityState(this.auth);
}

class HomeActivityState extends State<HomeActivity> with Observer{
  int _currentIndex = 0;

  final AuthBase auth;
  DateTime currentBackPressTime;
  StreamSubscription<SSEModel> sseModelSubscription;
  PageController _pageController = PageController(initialPage: 0);

  List<NavigationItem> allNavigationItems = <NavigationItem>[
    NavigationItem('Home', Icons.home_outlined, Icons.home, -1),
    NavigationItem('Food', Icons.lunch_dining_outlined, Icons.lunch_dining, -1),
    NavigationItem(
        'Messenger', Icons.chat_bubble_outline, Icons.chat_bubble, 0),
    NavigationItem(
        'Notifications', Icons.notifications_none, Icons.notifications, 0),
    NavigationItem('Profile', Icons.person_outline, Icons.person, -1)
  ];

  HomeActivityState(this.auth);

  @override
  void initState() {
    // TODO: implement initState
    Observable.instance.addObserver(this);
    super.initState();

    //Remove this method to stop OneSignal Debugging
    OneSignal.shared.setLogLevel(OSLogLevel.verbose, OSLogLevel.none);
    OneSignal.shared.setAppId(oneSignalAppID);
// The promptForPushNotificationsWithUserResponse function will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission
    OneSignal.shared.promptUserForPushNotificationPermission().then((accepted) {
      print("Accepted permission: $accepted");
    });
    OneSignal.shared.setNotificationWillShowInForegroundHandler(
        (OSNotificationReceivedEvent event) {
      // Will be called whenever a notification is received in foreground
      // Display Notification, pass null param for not displaying the notification
      event.complete(event.notification);
    });
    OneSignal.shared.setNotificationOpenedHandler(
        (OSNotificationOpenedResult result) async {
      // Will be called whenever a notification is opened/button pressed.
      String templateId = result.notification.additionalData['template_id'];
      if (templateId == "new_post" ||
          templateId == "comment" ||
          templateId == "react") {
        openImagePost(context, result.notification.additionalData['postID']);
      } else if (templateId == "new_follower") {
        openProfile(context, result.notification.additionalData['followerID']);
      }
    });
    OneSignal.shared.setExternalUserId(currentUserId);
    /*sseModel.listen((event) async {
      print("home event messages: " + event.data);
      var temp = await APIService.getTotalNewMessage();
      setState(() {
        allNavigationItems[2].totalNew = temp.data.newMessage;
      });
    });*/
  }
  @override
  void dispose() {
    // TODO: implement dispose
    Observable.instance.removeObserver(this);
    super.dispose();
  }

  @override
  update(Observable observable, String notifyName, Map map) async{
    // TODO: implement update
    if (notifyName == "new_message"){
      if (_currentIndex != 2) {
        print("home noti");
        var temp = await APIService.getTotalNewMessage();
        setState(() {
          allNavigationItems[2].totalNew = temp.data.newMessage;
        });
      }
    }

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
              ConversationsActivity(),
              NotificationActivity(),
              ProfileActivity(
                userId: currentUserId,
                auth: auth,
              )
            ],
          ),
          bottomNavigationBar: BottomNavigationBar(
            currentIndex: _currentIndex,
            onTap: (int index) {
              setState(() {
                _pageController.jumpToPage(index);
                allNavigationItems[index].totalNew = 0;
              });
            },
            items: allNavigationItems.map((NavigationItem navigationItem) {
              return BottomNavigationBarItem(
                  icon: navigationItem.totalNew <= 0
                      ? Icon(
                          navigationItem.icon,
                          color: appPrimaryColor,
                        )
                      : Stack(
                          children: [
                            Icon(
                              navigationItem.icon,
                              color: appPrimaryColor,
                            ),
                            Positioned(
                              bottom: 13,
                              right: 0,
                              child: Container(
                                  height: 11,
                                  width: 11,
                                  decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: totalNewBackgroundColor),
                                  child: Center(
                                    child: Text(
                                      navigationItem.totalNew.toString(),
                                      style: TextStyle(
                                          fontSize: 10, color: Colors.white),
                                    ),
                                  )),
                            ),
                          ],
                        ),
                  activeIcon: navigationItem.totalNew <= 0
                      ? Icon(
                          navigationItem.selectedIcon,
                          color: appPrimaryColor,
                        )
                      : Stack(
                          children: [
                            Icon(
                              navigationItem.selectedIcon,
                              color: appPrimaryColor,
                            ),
                            Positioned(
                              bottom: 13,
                              right: 0,
                              child: Container(
                                  height: 11,
                                  width: 11,
                                  decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: totalNewBackgroundColor),
                                  child: Center(
                                    child: Text(
                                      navigationItem.totalNew.toString(),
                                      style: TextStyle(
                                          fontSize: 10, color: Colors.white),
                                    ),
                                  )),
                            ),
                          ],
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
