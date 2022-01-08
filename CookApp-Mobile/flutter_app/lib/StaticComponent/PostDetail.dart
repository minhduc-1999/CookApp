import 'package:flutter/material.dart';
import 'package:tastify/Model/PostDetailsRespondModel.dart';
import 'package:tastify/Services/APIService.dart';
import '../constants.dart';
import 'Post.dart';
class PostDetail extends StatefulWidget {
  final String id;

  const PostDetail({Key key, this.id}) : super(key: key);
  @override
  _PostDetailState createState() => _PostDetailState(this.id);
}

class _PostDetailState extends State<PostDetail> {
  final String id;
  Post post;
  bool circular = true;
  _PostDetailState(this.id);

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
        body: circular ? Center(child: CircularProgressIndicator(),)
        : ListView(
          children: <Widget>[
            Container(
              child: post,
            ),
          ],
        ));
  }

  void fetchData() async {
    PostDetailsRespondModel res = await APIService.getDetailsPost(id);
    Post temp = Post(
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
    setState(() {
      post = temp;
      circular = false;
    });
  }
}
