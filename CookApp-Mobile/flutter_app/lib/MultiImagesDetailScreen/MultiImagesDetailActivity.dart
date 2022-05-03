import 'dart:async';

import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:tastify/CommentScreen/CommentActivity.dart';
import 'package:tastify/Model/PostDetailRespondModel.dart';
import 'package:tastify/Model/ReactRequestModel.dart';

import 'package:tastify/Services/APIService.dart';
import 'package:tastify/config.dart';

import '../constants.dart';

class MultiImagesDetailActivity extends StatefulWidget {
  const MultiImagesDetailActivity(
      {Key key,
      this.postId,
      this.isLiked,
      this.content,
      this.location,
      this.displayName,
      this.avatar,
      this.dateTime,
      this.numOfComment,
      this.numOfReaction})
      : super(key: key);

  @override
  _MultiImagesDetailActivityState createState() =>
      _MultiImagesDetailActivityState(
          postId: this.postId,
          isLiked: this.isLiked,
          content: this.content,
          location: this.location,
          displayName: this.displayName,
          avatar: this.avatar,
          dateTime: this.dateTime,
          numOfReaction: this.numOfReaction,
          numOfComment: this.numOfComment);

  final String postId;
  final bool isLiked;
  final String content;
  final String location;
  final String displayName;
  final String avatar;
  final DateTime dateTime;
  final int numOfReaction;
  final int numOfComment;
}

class _MultiImagesDetailActivityState extends State<MultiImagesDetailActivity> {
  _MultiImagesDetailActivityState(
      {this.postId,
      this.isLiked,
      this.content,
      this.location,
      this.displayName,
      this.avatar,
      this.dateTime,
      this.numOfComment,
      this.numOfReaction});

  List<LikeableImage> images = [];
  final String postId;
  bool isLiked;
  final String content;
  final String location;
  final String displayName;
  final String avatar;
  final DateTime dateTime;
  bool circular = true;
  int numOfReaction;
  int numOfComment;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    fetchData();
  }

  Widget buildPostHeader() {
    final double width = MediaQuery.of(context).size.width;
    return Padding(
      padding: const EdgeInsets.only(left: 15, right: 0, top: 3, bottom: 3),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          (avatar != null)
              ? CircleAvatar(
                  radius: 17,
                  backgroundColor: Colors.grey,
                  backgroundImage: NetworkImage(avatar),
                )
              : CircleAvatar(
                  /*child: Image.asset("assets/images/default_avatar.png",
                                      width: size.width * 0.20,
                                      height: size.width * 0.20,
                                      fit: BoxFit.fill),*/
                  radius: 17,
                  backgroundColor: Colors.grey,
                  backgroundImage:
                      AssetImage('assets/images/default_avatar.png')),
          SizedBox(
            width: width * 0.04,
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              GestureDetector(
                child: displayName != null
                    ? Text(displayName,
                        style: TextStyle(
                          color: Colors.black,
                          fontWeight: FontWeight.bold,
                        ))
                    : Text("user",
                        style: TextStyle(
                          color: Colors.black,
                          fontWeight: FontWeight.bold,
                        )),
                onTap: () {},
              ),
              SizedBox(
                height: 2,
              ),
              location != null
                  ? Text(
                      location,
                      style: TextStyle(fontSize: 12),
                    )
                  : Container()
            ],
          ),
        ],
      ),
    );
  }

  Widget buildLikeIcon() {
    Color color;
    IconData icon;

    if (isLiked) {
      color = Colors.pink;
      icon = FontAwesomeIcons.solidHeart;
    } else {
      icon = FontAwesomeIcons.heart;
    }

    return GestureDetector(
        child: Icon(
          icon,
          size: 25.0,
          color: color,
        ),
        onTap: () => _likePost(postId));
  }
  FutureOr _updateTotalComment(dynamic value) async {
    var data = await APIService.getPostDetail(postId);
    if(data.data.numOfComment != numOfComment){
      setState(() {
        numOfComment = data.data.numOfComment;
      });
    }

  }
  void _likePost(String postId) async {
    await APIService.react(ReactRequestModel(
        react: 'LOVE', targetId: postId, targetType: Config.postReactType));
    if (isLiked) {
      setState(() {
        isLiked = false;
        numOfReaction--;
      });
    } else {
      setState(() {
        isLiked = true;
        numOfReaction++;
      });
    }

  }

  TextStyle boldStyle = TextStyle(
    color: Colors.black,
    fontWeight: FontWeight.bold,
  );

  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;
    return Scaffold(
        body: circular
            ? Center(
                child: CircularProgressIndicator(),
              )
            : SingleChildScrollView(
                child: Container(
                margin: EdgeInsets.only(top: size.height * 0.06),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    buildPostHeader(),
                    Padding(
                        padding: const EdgeInsets.only(
                            left: 15, right: 15, bottom: 15, top: 15),
                        child: Text(
                          content,
                          maxLines: null,
                        )),

                        Container(
                            margin: EdgeInsets.only(left: 15, right: 15),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: <Widget>[
                                numOfReaction > 1
                                    ? Text(
                                        "${numOfReaction} likes",
                                      )
                                    : numOfReaction == 1 || numOfReaction == 0
                                        ? Text(
                                            "${numOfReaction} like",
                                          )
                                        : Container(),
                                numOfComment > 1
                                    ? Text(
                                        "${numOfComment} comments",
                                      )
                                    : numOfComment == 1 || numOfComment == 0
                                        ? Text(
                                            "${numOfComment} comment",
                                          )
                                        : Container()
                              ],
                            ),
                          ),

                    Padding(
                      padding: const EdgeInsets.only(
                          left: 15.0, right: 15.0, bottom: 3, top: 3),
                      child: Divider(
                        height: 2,
                        thickness: 0.4,
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(left: 15),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.start,
                        children: <Widget>[
                          buildLikeIcon(),
                          Padding(padding: const EdgeInsets.only(right: 20.0)),
                          GestureDetector(
                              child: const Icon(
                                FontAwesomeIcons.comment,
                                size: 25.0,
                              ),
                              onTap: () {
                                return showModalBottomSheet(
                                  context: context,
                                  builder: (BuildContext context) {
                                    return CommentActivity(
                                      targetId: postId,
                                      targetType: Config.postCommentsType,
                                      stepName: " ",
                                    );
                                  },
                                  isScrollControlled: true,
                                  backgroundColor: Colors.transparent,
                                ).then(_updateTotalComment);
                              }),
                        ],
                      ),
                    ),
                    ListView(
                      padding: EdgeInsets.only(top:15),
                      children: images,
                      shrinkWrap: true,
                      physics: NeverScrollableScrollPhysics(),
                    ),
                  ],
                ),
              )));
  }

  void fetchData() async {
    var data = await APIService.getPostDetail(postId);
    List<LikeableImage> temp = [];
    for (var i in data.data.medias) {
      temp.add(LikeableImage(
        media: i,
        postId: this.postId,
      ));
    }
    setState(() {
      images = temp;
      circular = false;
    });
  }
}

class LikeableImage extends StatefulWidget {
  const LikeableImage({Key key, this.media, this.postId}) : super(key: key);
  final Medias media;
  final String postId;

  @override
  _LikeableImageState createState() => _LikeableImageState(
      liked: media.reaction != null,
      url: media.url,
      id: media.id,
      type: media.type,
      numOfComment: media.numberOfComment,
      numOfReaction: media.numberOfReaction,
  postId: postId);
}

class _LikeableImageState extends State<LikeableImage> {
  _LikeableImageState(
      {this.liked,
      this.url,
      this.id,
      this.type,
      this.numOfReaction,
      this.numOfComment,
      this.postId});

  bool liked;
  final String url;
  final String id;
  final String type;
  final String postId;
  int numOfReaction;
  int numOfComment;
  FutureOr _updateTotalComment(dynamic value) async {
    var data = await APIService.getPostDetail(postId);
    for (var i in data.data.medias){
      if(i.id == this.id){
        if (i.numberOfComment != this.numOfComment){
          setState(() {
            numOfComment = i.numberOfComment;
          });
        }
      }
    }
  }
  Widget buildLikeIcon() {
    Color color;
    IconData icon;

    if (liked) {
      color = Colors.pink;
      icon = FontAwesomeIcons.solidHeart;
    } else {
      icon = FontAwesomeIcons.heart;
    }

    return GestureDetector(
        child: Icon(
          icon,
          size: 25.0,
          color: color,
        ),
        onTap: () => _likeMedia(id));
  }

  @override
  Widget build(BuildContext context) {
    final double height = MediaQuery.of(context).size.height;
    return Column(
      children: [
        Container(
            margin: EdgeInsets.only(bottom: 10),
            child: ClipRRect(
              child: Image.network(url,
                  fit: BoxFit.cover, width: 1000.0, height: height * 0.55),
            )),
        Container(
          margin: EdgeInsets.only(left: 15, right: 15),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              numOfReaction > 1
                  ? Text(
                      "${numOfReaction} likes",
                    )
                  : numOfReaction == 1 || numOfReaction == 0
                      ? Text(
                          "${numOfReaction} like",
                        )
                      : Container(),
              numOfComment > 1
                  ? Text(
                      "${numOfComment} comments",
                    )
                  : numOfComment == 1 || numOfComment == 0
                      ? Text(
                          "${numOfComment} comment",
                        )
                      : Container()
            ],
          ),
        ),
        Padding(
          padding:
              const EdgeInsets.only(left: 15.0, right: 15.0, bottom: 3, top: 3),
          child: Divider(
            height: 2,
            thickness: 0.4,
          ),
        ),
        Padding(
          padding: const EdgeInsets.only(left: 15, bottom: 15),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: <Widget>[
              buildLikeIcon(),
              Padding(padding: const EdgeInsets.only(right: 20.0)),
              GestureDetector(
                  child: const Icon(
                    FontAwesomeIcons.comment,
                    size: 25.0,
                  ),
                  onTap: () {
                    return showModalBottomSheet(
                      context: context,
                      builder: (BuildContext context) {
                        return CommentActivity(
                          targetId: id,
                          targetType: Config.imageReactType,
                          stepName: " ",
                        );
                      },
                      isScrollControlled: true,
                      backgroundColor: Colors.transparent,
                    ).then(_updateTotalComment);
                  }),
            ],
          ),
        ),
      ],
    );
  }

  void _likeMedia(String mediaId) async {
    await APIService.react(ReactRequestModel(
        react: 'LOVE', targetId: id, targetType: Config.imageReactType));
    if (liked) {
      setState(() {
        liked = false;
        numOfReaction--;
      });
    } else {
      setState(() {
        liked = true;
        numOfReaction++;
      });
    }

  }
}
