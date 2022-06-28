import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:tastify/FoodScreen/FoodInstructionWidget.dart';

import 'package:tastify/NewFeedScreen/PostDetail.dart';
import 'package:tastify/ProfileScreen/ProfileActivity.dart';
import 'package:tastify/Services/APIService.dart';
import '../NewFeedScreen/Post.dart';
import 'package:timeago/timeago.dart' as timeago;

import '../constants.dart';
import '../main.dart';

class NotificationWidget extends StatefulWidget {
  const NotificationWidget(
      {Key key, this.body, this.createdAt, this.data, this.isRead, this.templateID, this.image, this.id})
      : super(key: key);

  @override
  _NotificationWidgetState createState() =>
      _NotificationWidgetState(
          id: this.id,
          body: this.body,
          createdAt: this.createdAt,
          data: this.data,
          isRead: this.isRead,
          templateID: this.templateID,
          image: this.image);
  final String id;
  final String body;
  final int createdAt;
  final Map data;
  final bool isRead;
  final String templateID;
  final String image;

  factory NotificationWidget.fromDocument(DocumentSnapshot doc) {
    return NotificationWidget(
      id: doc.id,
      body: doc['body'],
      createdAt: doc['createdAt'],
      data: doc['data'],
      isRead: doc['isRead'],
      templateID: doc['templateId'],
      image: doc['image'],
    );
  }
  factory NotificationWidget.fromMap(Map<String, dynamic> data){
    return NotificationWidget(
      id: data['id'],
      body: data['body'],
      createdAt: data['createdAt'],
      data: data['data'],
      isRead: data['isRead'],
      templateID: data['templateId'],
      image: data['image'],
    );
  }
}

class _NotificationWidgetState extends State<NotificationWidget> {
  final String id;
  final String body;
  final int createdAt;
  final Map data;
  bool isRead;
  final String templateID;
  final String image;

  _NotificationWidgetState(
      {this.id, this.image, this.body, this.createdAt, this.isRead, this.data, this.templateID,});

  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;
    return GestureDetector(
      onTap: (){
        clickedNoti(context);
      },
      child: Container(

            color: !isRead ? backGroundUnreadNotiColor : Theme.of(context).scaffoldBackgroundColor,
            child: Padding(
              padding: EdgeInsets.only(left: 8,right: 8,top: 15,bottom: 5),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Container(
                    margin: EdgeInsets.only(left: size.width*0.03, right: size.width*0.03),
                    width: 38,
                    height: 38,
                    child: (image != null)
                        ? CircleAvatar(
                      backgroundColor: Colors.grey,
                      backgroundImage: NetworkImage(image),
                    )
                        : CircleAvatar(
                        backgroundColor: Colors.grey,
                        backgroundImage:
                        AssetImage('assets/images/default_avatar.png')),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                        Padding(
                          padding: const EdgeInsets.only(left: 10, right: 8),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: <Widget>[

                              SizedBox(
                                width: size.width * 0.73,
                                child: Text(body,
                                    maxLines: 100,
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: Colors.black,
                                    )),
                              ),

                            ],


                          ),
                        ),

                      Container(
                        margin: EdgeInsets.only(left: 10, right: 10, top: 4),
                        child: Text(
                          timeago.format(DateTime.fromMillisecondsSinceEpoch(createdAt)),
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(fontSize: 13, color: Colors.grey),
                        ),
                      ),
                      SizedBox(height: 10,)
                    ],
                  ),
                ],
              ),
            ),
          ),
    );
  }

  clickedNoti(BuildContext context) async {
    if (!isRead) {
      FirebaseFirestore.instance
          .collection('modules')
          .doc('notification')
          .collection('users')
          .doc(currentUserId)
          .collection('badge')
          .doc(id).update({
            "isRead" : true,

      });
      setState(() {
        isRead = true;
      });
    }
    if (templateID == "new_post" || templateID == "react" || templateID == "comment") {

      openImagePost(context, data['postID']);
    } else if (templateID == "new_follower"){
      Navigator.push(
          context,
          MaterialPageRoute(
              builder: (context) => ProfileActivity(
                userId: data['followerID'],
              )));

    } else if (templateID == "new_food" || templateID == "food_confirmation") {
      Navigator.push(
          context,
          MaterialPageRoute(
              builder: (context) => FoodInstructionWidget(
                id: data['foodID'],
                name: data['foodName']
              )));
    }
  }

  void openImagePost(BuildContext context, String id) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => PostDetail(id: id)),
    );
  }
}
