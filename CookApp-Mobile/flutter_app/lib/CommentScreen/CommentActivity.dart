import 'package:flutter/material.dart';
class CommentActivity extends StatefulWidget {
  final String postId;
  const CommentActivity({this.postId});
  @override
  _CommentActivityState createState() => _CommentActivityState();
}

class _CommentActivityState extends State<CommentActivity> {
  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
class Comment extends StatelessWidget {
  final String displayName;
  final String userId;
  final String avatar;
  final String comment;
  //final Timestamp timestamp;

  Comment(
      {this.displayName,
        this.userId,
        this.avatar,
        this.comment,
        });


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
                backgroundImage:
                NetworkImage(avatar),
              )
                  : CircleAvatar(
                /*child: Image.asset("assets/images/default_avatar.png",
                                    width: size.width * 0.20,
                                    height: size.width * 0.20,
                                    fit: BoxFit.fill),*/
                  backgroundColor: Colors.grey,
                  backgroundImage: AssetImage(
                      'assets/images/default_avatar.png')),
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
                    "1 minute ago",
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