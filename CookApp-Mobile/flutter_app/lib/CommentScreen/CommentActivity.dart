import 'package:flutter/material.dart';
import 'package:tastify/Model/CommentRequestModel.dart';
import 'package:tastify/Model/CommentRespondModel.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:timeago/timeago.dart' as timeago;

import '../constants.dart';

class CommentActivity extends StatefulWidget {
  final String postId;

  const CommentActivity({this.postId});

  @override
  _CommentActivityState createState() => _CommentActivityState(postId);
}

class _CommentActivityState extends State<CommentActivity> {
  final String postId;
  List<Comment> comments;
  bool didFetchComments = false;
  _CommentActivityState(this.postId);
  final TextEditingController _commentController = TextEditingController();
  @override
  void initState() {
    super.initState();
    fetchData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
        title: Text('Comments'),
      ),
      body: buildPage(),
    );
  }
  Widget buildPage() {
    return Column(
      children: [
        Expanded(
          child: buildComment(),
        ),
        Divider(),
        ListTile(
          title: TextFormField(
            controller: _commentController,
            decoration: InputDecoration(labelText: 'Write a comment...'),
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
      ],
    );

  }

  Widget buildComment() {
      if(this.didFetchComments == false){
        return Container(
            alignment: FractionalOffset.center,
            child: CircularProgressIndicator());
      }else {
        return ListView(children: comments);
      }
  }
  void fetchData() async{
    CommentRespondModel dataComment = await APIService.getComment(postId, "");
    List<Comment> temp = [];
    print("total comment: " + dataComment.data.comments.length.toString());
    for (var i in dataComment.data.comments) {
      temp.add(Comment(
        displayName: i.user.displayName,
        userId: i.user.id,
        avatar: i.user.avatar != null ? i.user.avatar : null,
        comment: i.content,
        dateTime: DateTime.fromMillisecondsSinceEpoch(i.createdAt),
      ));
    }
    setState(() {
      didFetchComments = true;
      comments = temp;
    });
  }
  void addComment(String comment) async{
    _commentController.clear();
    await APIService.comment(postId, CommentRequestModel(content: comment, parentId: ""));
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
              margin: EdgeInsets.only(left: 20, right: 10, top: 20),
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
              children: <Widget>[
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Container(
                      margin: EdgeInsets.only(top: 20, right: 5),
                      child: Text(displayName,
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.black,
                            fontWeight: FontWeight.bold,
                          )),
                    ),
                    Container(
                      margin: EdgeInsets.only(top: 20, right: 5),
                      child: Text(comment,
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.black,
                          )),
                    )
                  ],
                ),
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
                Container(
                  margin: EdgeInsets.only(right: 10, top: 4),
                  child: Text(
                    timeago.format(dateTime),
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(fontSize: 16, color: Colors.grey),
                  ),
                ),
              ],
            ),
          ],
        ),
      ],
    );
  }
}
