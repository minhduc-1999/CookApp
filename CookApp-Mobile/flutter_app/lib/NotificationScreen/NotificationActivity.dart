import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:tastify/NotificationScreen/NotificationWidget.dart';
import 'package:tastify/main.dart';

import '../constants.dart';

class NotificationActivity extends StatefulWidget {
  @override
  _NotificationActivityState createState() => _NotificationActivityState();
}

class _NotificationActivityState extends State<NotificationActivity> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          brightness: Brightness.dark,
          automaticallyImplyLeading: false,
          flexibleSpace: Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
                colors: <Color>[appPrimaryColor, appPrimaryColor],
              ),
            ),
          ),
          title: Container(
            child: Text("Notifications",
                style: TextStyle(
                    fontFamily: 'Billabong',
                    fontSize: 32,
                    fontStyle: FontStyle.italic)),
          ),
        ),
        body: buildNotifications()
    );
  }

  Widget buildNotifications() {
    return Container(
      child: StreamBuilder(
        stream: FirebaseFirestore.instance
            .collection('modules')
            .doc('notification')
            .collection('users')
            .doc(currentUserId)
            .collection('badge')
            .snapshots(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(
              child: CircularProgressIndicator(),
            );
          } else if (!snapshot.hasData) {
            return Center(
              child: Text(
                "Nothing to show!",
                style: TextStyle(fontSize: 16),
              ),
            );
          } else {
            return ListView.builder(
                itemCount: snapshot.data.docs.length,
                itemBuilder: (context, index){
                  return NotificationWidget.fromDocument(snapshot.data.docs[index]);
                }
                );
          }
        },
      ),
    );
  }
}
