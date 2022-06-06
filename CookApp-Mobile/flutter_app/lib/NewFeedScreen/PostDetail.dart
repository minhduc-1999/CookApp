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
    var i = res.data;
    Post temp = Post(
      id: i.id,
      userId: i.author.id,
      location: i.location,
      content: i.content,
      kind: i.kind,
      medias: i.medias != null ? i.medias : [],
      avatar: i.author.avatar.url,
      displayName: i.author.displayName,
      numOfReaction: i.numOfReaction,
      numOfComment: i.numOfComment,
      dateTime: DateTime.fromMillisecondsSinceEpoch(i.createdAt),
      isLike: i.reaction != null,
      saved: i.saved,
      foodRefId: i.ref != null ? i.ref.id : "",
      totalTime: i.ref != null ? i.ref.totalTime : 0,
      servings: i.ref != null ? i.ref.servings : 0,
      foodName: i.ref != null ? i.ref.name : "",
      foodDescription: i.ref != null ? i.ref.description : "",
      foodImage: i.ref != null ? i.ref.photos[0].url : "",
      tags: i.tags,
      should: i.recomendation != null ? i.recomendation.should : null,
      shouldNot: i.recomendation != null ? i.recomendation.shouldNot : null,
      isNutritionist: i.author.isNutritionist,
    );
    setState(() {
      post = temp;
      circular = false;
    });
  }
}
