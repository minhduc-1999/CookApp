import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:tastify/Model/PostDetailsRespondModel.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:tastify/StaticComponent/Post.dart';
import 'package:timeago/timeago.dart' as timeago;

import '../constants.dart';
class NotificationWidget extends StatefulWidget {
  const NotificationWidget({Key key, this.body, this.createdAt, this.data, this.isRead, this.templateID, this.image}) : super(key: key);

  @override
  _NotificationWidgetState createState()
  => _NotificationWidgetState(body: this.body, createdAt: this.createdAt,data: this.data, isRead: this.isRead, templateID: this.templateID);
  final String body;
  final String createdAt;
  final Map data;
  final bool isRead;
  final String templateID;
  final String image;
  factory NotificationWidget.fromDocument(DocumentSnapshot doc) {
    return NotificationWidget(
      body: doc['body'],
      createdAt: doc['createAt'],
      data: doc['data'],
      isRead: doc['isRead'],
      templateID: doc['templateId'],
      image: doc['image'],
    );
  }
}

class _NotificationWidgetState extends State<NotificationWidget> {
  final String body;
  final String createdAt;
  final Map data;
  bool isRead;
  final String templateID;
  final String image;
  _NotificationWidgetState({this.image,this.body, this.createdAt, this.isRead, this.data, this.templateID,});
  @override
  Widget build(BuildContext context) {
    return Padding(
        padding: EdgeInsets.only(bottom: 2.0),
        child: Container(
          color: Colors.white60,
          child: ListTile(
            title: GestureDetector(
              onTap: () => clickedImage(context),
              child: RichText(
                overflow: TextOverflow.ellipsis,
                text: TextSpan(
                    style: TextStyle(
                      fontSize: 14.0,
                      color: Colors.black,
                    ),
                    children: [
                      TextSpan(
                        text: body,
                      )
                    ]),
              ),
            ),
            leading: CircleAvatar(
              backgroundColor: Colors.grey,
              backgroundImage: AssetImage('assets/images/default_avatar.png'),
            ),
            subtitle: Text(
              timeago.format(DateTime.fromMillisecondsSinceEpoch(int.parse(createdAt))),
              overflow: TextOverflow.ellipsis,
            ),

          ),
        ));
  }
  clickedImage(BuildContext context) async {
    if (templateID == "new_post") {
      PostDetailsRespondModel res = await APIService.getDetailsPost(data['postId']);
      Post post = Post(
        id: res.data.id,
        userId: res.data.author.id,
        location: "Quang Binh",
        content: res.data.content,
        images: res.data.images,
        avatar: res.data.author.avatar,
        displayName: res.data.author.displayName,
        dateTime: DateTime.fromMillisecondsSinceEpoch(res.data.createdAt),
        numOfComment: res.data.numOfComment,
        numOfReaction: res.data.numOfReaction,
        isLike: res.data.reaction != null,
      );
      openImagePost(context, post);
    }
  }
  void openImagePost(BuildContext context, Post post) {
    Navigator.of(context)
        .push(MaterialPageRoute<bool>(builder: (BuildContext context) {
      return Center(
        child: Scaffold(
            appBar: AppBar(
              automaticallyImplyLeading: true,
              brightness: Brightness.dark,
              flexibleSpace: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.centerLeft,
                    end: Alignment.centerRight,
                    colors: <Color>[appPrimaryColor, appPrimaryColor],
                  ),
                ),
              ),
              title: Text('Post'),
            ),
            body: ListView(
              children: <Widget>[
                Container(
                  child: post,
                ),
              ],
            )),
      );
    }));
  }
}
