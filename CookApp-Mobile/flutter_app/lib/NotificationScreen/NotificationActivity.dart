import 'package:cloud_firestore/cloud_firestore.dart';
//import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
//import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:tastify/NotificationScreen/NotificationWidget.dart';
import 'package:tastify/main.dart';

import '../constants.dart';

class NotificationActivity extends StatefulWidget {
  @override
  _NotificationActivityState createState() => _NotificationActivityState();
}

class _NotificationActivityState extends State<NotificationActivity> {

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
  }

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
  Widget buildNoti(){
    return Container(
      child: FutureBuilder(
          future: getNoti(),
          builder: (context, snapshot) {
            if (!snapshot.hasData)
              return Center(
                child: Text(
                  "Nothing to show!",
                  style: TextStyle(fontSize: 16),
                ),
              );
            return ListView(
              children: snapshot.data,
            );
          }
      ),

    );
  }
  Future<List<NotificationWidget>> getNoti() async{
    List<NotificationWidget> noti = [];

    QuerySnapshot data = await FirebaseFirestore.instance
        .collection('modules')
        .doc('notification')
        .collection('users')
        .doc(currentUserId)
        .collection('badge')
        .orderBy('createdAt',descending: true)
        .get();
    data.docs.forEach((DocumentSnapshot doc) {
      noti.add(NotificationWidget(
        key: ValueKey(doc.id),
        id: doc.id,
        body: doc['body'],
        createdAt: doc['createdAt'],
        data: doc['data'],
        isRead: doc['isRead'],
        templateID: doc['templateId'],
        image: doc['image'],
      ));
    });
    return noti;
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
            .orderBy('createdAt',descending: true)
            .snapshots(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(
              child: CircularProgressIndicator(),
            );
          } else if (!snapshot.hasData || snapshot.connectionState == ConnectionState.none) {
            return Center(
              child: Text(
                "Nothing to show!",
                style: TextStyle(fontSize: 16),
              ),
            );
          } else if (snapshot.hasData){
            return ListView.builder(
                itemCount: snapshot.data.docs.length,
                itemBuilder: (context, index){
                DocumentSnapshot documentSnapshot = snapshot.data.docs[index];
                  return
                  NotificationWidget(
                    key: ValueKey(documentSnapshot.id),
                    id: documentSnapshot.id,
                    body: documentSnapshot['body'],
                    createdAt: documentSnapshot['createdAt'],
                    data: documentSnapshot['data'],
                    isRead: documentSnapshot['isRead'],
                    templateID: documentSnapshot['templateId'],
                    image: documentSnapshot['image'],
                  );
                }
            );
          } else {
            return Container(
                    alignment: FractionalOffset.center,
                    child: CircularProgressIndicator());
            }
          }

      ),
    );
  }




}
