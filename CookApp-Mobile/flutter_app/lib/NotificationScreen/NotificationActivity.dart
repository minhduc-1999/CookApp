import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
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


    /*FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      print('A new onMessageOpenedApp event was published!');
      RemoteNotification notification = message.notification;
      AndroidNotification android = message.notification?.android;
      if (notification != null && android != null) {
        showDialog(
            context: context,
            builder: (_) {
              return AlertDialog(
                title: Text(notification.title),
                content: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [Text(notification.body)],
                  ),
                ),
              );
            });
      }
    });*/
    setupInteractedMessage();
  }
  Future<void> setupInteractedMessage() async {
    // Get any messages which caused the application to open from
    // a terminated state.
    RemoteMessage initialMessage =
    await FirebaseMessaging.instance.getInitialMessage();

    // If the message also contains a data property with a "type" of "chat",
    // navigate to a chat screen
    if (initialMessage != null) {
      _handleMessage(initialMessage);
    }

    // Also handle any interaction when the app is in the background via a
    // Stream listener
    FirebaseMessaging.onMessageOpenedApp.listen(_handleMessage);
  }

  void _handleMessage(RemoteMessage message) {
   print("there is a message");
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
  Stream<List<NotificationWidget>> _getNoti() {
    var snapshots = FirebaseFirestore.instance
        .collection('modules')
        .doc('notification')
        .collection('users')
        .doc(currentUserId)
        .collection('badge')
        .orderBy('createdAt', descending: true)
        .snapshots();
    return snapshots.map((snapshot) => snapshot.docs
        .map(
          (snapshot) => NotificationWidget.fromDocument(snapshot),
    ).toList());
  }

}
