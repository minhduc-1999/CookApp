import 'package:flutter/material.dart';
import 'package:flutter_app/Services/SharedService.dart';
import 'package:flutter_app/UploadScreen/UploadActivity.dart';
import 'package:flutter_app/constants.dart';

import '../config.dart';

class NewFeedActivity extends StatefulWidget {
  @override
  _NewFeedActivityState createState() => _NewFeedActivityState();
}

class _NewFeedActivityState extends State<NewFeedActivity> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        brightness: Brightness.dark,
        title: Text(
          Config.appName,
          style: TextStyle(
              fontFamily: 'Billabong',
              fontSize: 32,
              fontStyle: FontStyle.italic),
        ),
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: <Color>[appPrimaryColor, appPrimaryColor],
            ),
          ),
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.add_circle_rounded),
            onPressed: () {
              Navigator.push(context,
                  MaterialPageRoute(builder: (context) => UploadActivity()));
            },
          ),
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: () {
              SharedService.logout(context);
            },
          )
        ],
      ),
    );
  }
}
