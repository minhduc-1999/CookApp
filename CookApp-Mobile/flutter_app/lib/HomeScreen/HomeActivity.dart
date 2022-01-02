import 'package:flutter/material.dart';
import 'package:tastify/FoodScreen/FoodActivity.dart';
import 'package:tastify/MessageScreen/MessageActivity.dart';
import 'package:tastify/NewFeedScreen/NewFeedActivity.dart';
import 'package:tastify/NotificationScreen/NotificationActivity.dart';
import 'package:tastify/ProfileScreen/ProfileActivity.dart';
import 'package:tastify/Services/Auth.dart';
import 'package:tastify/Services/SharedService.dart';

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