import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../config.dart';
import '../constants.dart';

class NotificationSettingsActivity extends StatefulWidget {
  @override
  _NotificationSettingsActivityState createState() =>
      _NotificationSettingsActivityState();
}

class _NotificationSettingsActivityState
    extends State<NotificationSettingsActivity> {
  bool isNewPostOn = true;
  bool isLikeOn = true;
  bool isCommentOn = true;
  bool isFollowOn = true;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    fetchData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        brightness: Brightness.dark,
        title: Text(
          Config.notifications,
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
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
      ),
      body: SingleChildScrollView(
        child: Container(
          margin: EdgeInsets.fromLTRB(20, 30, 20, 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "Push notifications",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
              ),
              SizedBox(height: 15,),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "New post",
                    style: TextStyle(fontSize: 16,),
                  ),
                  Switch.adaptive(
                      value: isNewPostOn,
                      onChanged: (value) {
                        setState(() {
                          isNewPostOn = value;
                        });
                      },
                    activeColor: appPrimaryColor,
                      )
                ],
              ),
              SizedBox(height: 5,),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "Like",
                    style: TextStyle(fontSize: 16,),
                  ),
                  Switch.adaptive(
                    value: isLikeOn,
                    onChanged: (value) {
                      setState(() {
                        isLikeOn = value;
                      });
                    },
                    activeColor: appPrimaryColor,
                  )
                ],
              ),
              SizedBox(height: 5,),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "Comment",
                    style: TextStyle(fontSize: 16,),
                  ),
                  Switch.adaptive(
                    value: isCommentOn,
                    onChanged: (value) {
                      setState(() {
                        isCommentOn = value;
                      });
                    },
                    activeColor: appPrimaryColor,
                  )
                ],
              ),
              SizedBox(height: 5,),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "Follow",
                    style: TextStyle(fontSize: 16,),
                  ),
                  Switch.adaptive(
                    value: isFollowOn,
                    onChanged: (value) {
                      setState(() {
                        isFollowOn = value;
                      });
                    },
                    activeColor: appPrimaryColor,
                  )
                ],
              ),
              SizedBox(height: 5,),
            ],
          ),
        ),
      ),
    );
  }

  void fetchData() {
    //FirebaseFirestore.instance.collection("collectionPath").doc("")
  }

  Widget buildSwitch(bool value, String title) {}
}
