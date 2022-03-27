import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:tastify/Model/CommentRequestModel.dart';
import 'package:tastify/Model/CommentRespondModel.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:tastify/config.dart';
import 'package:timeago/timeago.dart' as timeago;

import '../constants.dart';

class CommentActivity extends StatefulWidget {
  final String targetKeyOrID;
  final String targetType;
  final String stepName;
  const CommentActivity({this.targetKeyOrID,this.targetType,this.stepName});

  @override
  _CommentActivityState createState() => _CommentActivityState(targetKeyOrID,targetType,stepName);
}

class _CommentActivityState extends State<CommentActivity> {
  final String targetKeyOrID;
  final String targetType;
  final String stepName;
  List<Comment> comments;
  bool didFetchComments = false;

  _CommentActivityState(this.targetKeyOrID,this.targetType,this.stepName);

  final TextEditingController _commentController = TextEditingController();

  @override
  void initState() {
    super.initState();
    fetchData();
  }

  @override
  Widget build(BuildContext context) {
    return buildPage();
  }

  Widget buildPage() {
    return DraggableScrollableSheet(
        minChildSize: 0.5,
        maxChildSize: 0.9,
        initialChildSize: 0.9,
        builder: (_, controller) => Container(
              decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.vertical(
                    top: Radius.circular(15),
                  )),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                      padding: EdgeInsets.all(8),
                      child: Center(
                          child: Text(
                            targetType == Config.postCommentsType ? "Comments" : stepName,
                        style: TextStyle(fontSize: 22),
                      ))),
                  Divider(
                    height: 10.0,
                    color: Colors.grey.withOpacity(0.5),
                  ),
                  Expanded(
                    child: buildComment(),
                  ),

                  Padding(
                    padding: MediaQuery.of(context).viewInsets,
                    child: Container(
                      child: Row(
                        children: <Widget>[
                          // Button send image
                          Material(
                            child: Container(
                              margin: EdgeInsets.symmetric(horizontal: 1.0),
                              child: IconButton(
                                icon: Icon(Icons.image),
                                onPressed: (){},
                                color: appPrimaryColor,
                              ),
                            ),
                            color: Colors.white,
                          ),

                          // Edit text
                          Flexible(
                            child: Container(
                              child: TextField(
                                onSubmitted: addComment,
                                style: TextStyle( fontSize: 15.0),
                                controller: _commentController,
                                decoration: InputDecoration.collapsed(
                                  hintText: 'Type your message...',
                      
                                ),

                              ),
                            ),
                          ),

                          // Button send message
                          Material(
                            child: Container(
                              margin: EdgeInsets.symmetric(horizontal: 8.0),
                              child: IconButton(
                                icon: Icon(Icons.send),
                                onPressed: () => addComment(_commentController.text),
                                color: appPrimaryColor,
                              ),
                            ),
                            color: Colors.white,
                          ),
                        ],
                      ),
                      width: double.infinity,
                      height: 50.0,
                      decoration: BoxDecoration(
                          border: Border(top: BorderSide(color: appPrimaryColor, width: 0.5)),
                          color: Colors.white),
                    ),
                  ),
                /*  Padding(
                    padding: MediaQuery.of(context).viewInsets,
                    child: ListTile(
                      title: TextFormField(
                        controller: _commentController,
                        decoration:
                            InputDecoration(labelText: 'Write a comment...'),
                        onFieldSubmitted: addComment,
                      ),
                      trailing: OutlineButton(
                        onPressed: () {
                          addComment(_commentController.text);
                        },
                        borderSide: BorderSide.none,
                        child: Text("Post"),
                      ),
                    ),
                  ),*/
                ],
              ),
            ));
  }

  Widget buildComment() {
    if (this.didFetchComments == false) {
      return Container(
          alignment: FractionalOffset.center,
          child: CircularProgressIndicator());
    } else {
      return ListView(children: comments);
    }
  }

  void fetchData() async {
    CommentRespondModel dataComment = await APIService.getComment(targetKeyOrID,targetType,"");
    List<Comment> temp = [];
    //print("total comment: " + dataComment.data.comments.length.toString());
    for (var i in dataComment.data.comments) {
      temp.add(Comment(
        displayName: i.user.displayName,
        userId: i.user.id,
        avatar: i.user.avatar.url != null ? i.user.avatar.url : null,
        comment: i.content,
        dateTime: DateTime.fromMillisecondsSinceEpoch(i.createdAt),
      ));
    }
    setState(() {
      didFetchComments = true;
      comments = temp;
    });
  }

  void addComment(String comment) async {
    _commentController.clear();
    await APIService.comment(
        CommentRequestModel(targetKeyOrID: targetKeyOrID, content: comment, replyFor: "", targetType: targetType));
    await fetchData();
  }
}

class Comment extends StatelessWidget {
  final String displayName;
  final String userId;
  final String avatar;
  final String comment;
  final DateTime dateTime;

  //final Timestamp timestamp;

  Comment(
      {this.displayName,
      this.userId,
      this.avatar,
      this.comment,
      this.dateTime});

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Column(
      children: <Widget>[
        /* ListTile(
          title: Text(comment),
          leading: CircleAvatar(
            backgroundImage: NetworkImage(avatarUrl),
          ),
        ),
        Divider()*/
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Container(
              margin: EdgeInsets.only(left: size.width*0.03, right: size.width*0.03),
              width: 40,
              height: 40,
              child: (avatar != null)
                  ? CircleAvatar(
                      backgroundColor: Colors.grey,
                      backgroundImage: NetworkImage(avatar),
                    )
                  : CircleAvatar(
                      backgroundColor: Colors.grey,
                      backgroundImage:
                          AssetImage('assets/images/default_avatar.png')),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(15),
                      color: backGroundFoodScreenColor),
                  child: Padding(
                    padding: const EdgeInsets.only(left: 10, top: 6, right: 8, bottom: 6),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Text(
                          displayName,
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.black,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(height: 2,),
                        SizedBox(
                          width: size.width * 0.73,
                          child: Text(comment,
                              maxLines: 100,
                              style: TextStyle(
                                fontSize: 16,
                                color: Colors.black,
                              )),
                        ),

                      ],

/*                RichText(
                            text: TextSpan(
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.black,
                                ),
                                children: <TextSpan>[
                              TextSpan(
                                  text: displayName,
                                  style: TextStyle(
                                    fontSize: 16,
                                    color: Colors.black,
                                    fontWeight: FontWeight.bold,
                                  )),
                              TextSpan(text: ' '),
                              TextSpan(
                                  text: comment,
                                  style: TextStyle(fontSize: 16, color: Colors.black))
                            ])),*/
                    ),
                  ),
                ),
                Container(
                  margin: EdgeInsets.only(left: 10, right: 10, top: 4),
                  child: Text(
                    timeago.format(dateTime),
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(fontSize: 14, color: Colors.grey),
                  ),
                ),
                SizedBox(height: 10,)
              ],
            ),
          ],
        ),
      ],
    );
  }
}
