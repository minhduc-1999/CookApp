import 'package:flutter/material.dart';

import 'package:tastify/Model/PostDetailRespondModel.dart';

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
    PostDetailRespondModel res = await APIService.getPostDetail(id);

  /*  Post temp = Post(
      id: res.data.id,
      userId: res.data.author.id,
      location: res.data.location,
      content: res.data.content,
      //images: res.data.images,
      medias: res.data.medias,
      avatar: res.data.author.avatar.url,
      displayName: res.data.author.displayName,
      dateTime: DateTime.fromMillisecondsSinceEpoch(res.data.createdAt),
      numOfComment: res.data.numOfComment,
      numOfReaction: res.data.numOfReaction,
      isLike: res.data.reaction != null,
      saved: res.data.saved,
    );*/
    Post temp = Post(
      id: res.data.id,
      userId: res.data.author.id,
      location: res.data.location,
      content: res.data.content,
      kind: res.data.kind,
      medias: res.data.medias != null ? res.data.medias : [],
      avatar: res.data.author.avatar.url,
      displayName: res.data.author.displayName,
      numOfReaction: res.data.numOfReaction,
      numOfComment: res.data.numOfComment,
      dateTime: DateTime.fromMillisecondsSinceEpoch(res.data.createdAt),
      isLike: res.data.reaction != null,
      saved: res.data.saved,
      foodRefId: res.data.ref != null ? res.data.ref.id : "",
      totalTime: res.data.ref != null ? res.data.ref.totalTime : 0,
      servings: res.data.ref != null ? res.data.ref.servings : 0,
      foodName: res.data.ref != null ? res.data.ref.name : "",
      foodDescription: res.data.ref != null ? res.data.ref.description : "",
      foodImage: res.data.ref != null ? res.data.ref.photos[0].url : "",
      tags: res.data.tags,
      should: res.data.recomendation != null ? res.data.recomendation.should : null,
      shouldNot: res.data.recomendation != null ? res.data.recomendation.shouldNot : null,
    );
    setState(() {
      post = temp;
      circular = false;
    });
  }
}
