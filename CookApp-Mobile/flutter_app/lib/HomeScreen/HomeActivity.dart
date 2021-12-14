import 'package:flutter/material.dart';
import 'package:flutter_app/FoodScreen/FoodActivity.dart';
import 'package:flutter_app/MessageScreen/MessageActivity.dart';
import 'package:flutter_app/NewFeedScreen/NewFeedActivity.dart';
import 'package:flutter_app/NotificationScreen/NotificationActivity.dart';
import 'package:flutter_app/ProfileScreen/ProfileActivity.dart';
import 'package:flutter_app/Services/SharedService.dart';

import 'package:flutter_app/main.dart';

import '../constants.dart';

class NavigationItem {
  const NavigationItem(this.title, this.icon);
  final String title;
  final IconData icon;
}

const List<NavigationItem> allNavigationItems = <NavigationItem>[
  NavigationItem('Home', Icons.home),
  NavigationItem('Food', Icons.lunch_dining),
  NavigationItem('Message', Icons.chat_bubble),
  NavigationItem('Notification', Icons.notifications),
  NavigationItem('Profile', Icons.person)
];

class HomeActivity extends StatefulWidget {
  @override
  HomeActivityState createState() => HomeActivityState();
}

class HomeActivityState extends State<HomeActivity> {
  int _currentIndex = 0;

  DateTime currentBackPressTime;

  PageController _pageController = PageController(initialPage: 0);

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
              ProfileActivity(userId: currentUserId,)
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