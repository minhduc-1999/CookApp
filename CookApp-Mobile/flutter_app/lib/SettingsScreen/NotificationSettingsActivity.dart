import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:tastify/main.dart';

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
  bool circular = true;
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
      body: circular ? Center(child: CircularProgressIndicator())
      : SingleChildScrollView(
        child: Container(
          margin: EdgeInsets.fromLTRB(20, 30, 20, 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "Push notifications",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
              ),
              SizedBox(
                height: 15,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "New post",
                    style: TextStyle(
                      fontSize: 16,
                    ),
                  ),
                  Switch.adaptive(
                    value: isNewPostOn,
                    onChanged: (value) {
                      FirebaseFirestore.instance
                          .collection('modules')
                          .doc('configurations')
                          .collection('notifications')
                          .doc(currentUserId)
                          .update({
                        "new_post": value,
                      });
                      setState(() {
                        isNewPostOn = value;
                      });
                    },
                    activeColor: appPrimaryColor,
                  )
                ],
              ),
              SizedBox(
                height: 5,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "Like",
                    style: TextStyle(
                      fontSize: 16,
                    ),
                  ),
                  Switch.adaptive(
                    value: isLikeOn,
                    onChanged: (value) {
                      FirebaseFirestore.instance
                          .collection('modules')
                          .doc('configurations')
                          .collection('notifications')
                          .doc(currentUserId)
                          .update({
                        "post_reaction": value,
                      });
                      setState(() {
                        isLikeOn = value;
                      });
                    },
                    activeColor: appPrimaryColor,
                  )
                ],
              ),
              SizedBox(
                height: 5,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "Comment",
                    style: TextStyle(
                      fontSize: 16,
                    ),
                  ),
                  Switch.adaptive(
                    value: isCommentOn,
                    onChanged: (value) {
                      FirebaseFirestore.instance
                          .collection('modules')
                          .doc('configurations')
                          .collection('notifications')
                          .doc(currentUserId)
                          .update({
                        "post_comment": value,
                      });
                      setState(() {
                        isCommentOn = value;
                      });
                    },
                    activeColor: appPrimaryColor,
                  )
                ],
              ),
              SizedBox(
                height: 5,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "Follow",
                    style: TextStyle(
                      fontSize: 16,
                    ),
                  ),
                  Switch.adaptive(
                    value: isFollowOn,
                    onChanged: (value) {
                      FirebaseFirestore.instance
                          .collection('modules')
                          .doc('configurations')
                          .collection('notifications')
                          .doc(currentUserId)
                          .update({
                        "new_follower": value,
                      });
                      setState(() {
                        isFollowOn = value;
                      });
                    },
                    activeColor: appPrimaryColor,
                  )
                ],
              ),
              SizedBox(
                height: 5,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> fetchData() async {
    //FirebaseFirestore.instance.collection("collectionPath").doc("")
    var _documentRef = await FirebaseFirestore.instance
        .collection('modules')
        .doc('configurations')
        .collection('notifications')
        .doc(currentUserId);
    var result = await _documentRef.get();
    setState(() {
      isNewPostOn = result["new_post"];
      isLikeOn = result["post_reaction"];
      isCommentOn = result["post_comment"];
      isFollowOn = result["new_follower"];
      circular = false;
    });
  }
}
