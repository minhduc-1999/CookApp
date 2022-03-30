import 'dart:async';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flare_flutter/flare_actor.dart';
import 'package:flutter/material.dart';
import 'package:tastify/CommentScreen/CommentActivity.dart';
import 'package:tastify/EditPostScreen/EditPostActivity.dart';
import 'package:tastify/Model/NewFeedRespondModel.dart';
import 'package:tastify/Model/ReactRequestModel.dart';
import 'package:tastify/Model/UserRespondModel.dart';
import 'package:tastify/NewFeedScreen/MultiImagesDetailActivity.dart';
import 'package:tastify/ProfileScreen/ProfileActivity.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:tastify/config.dart';
import 'package:tastify/constants.dart';
import 'package:tastify/main.dart';
import 'package:timeago/timeago.dart' as timeago;

class Post extends StatefulWidget {
  const Post(
      {this.id,
      this.userId,
      this.location,
      this.content,
      this.medias,
      this.avatar,
      this.displayName,
      this.numOfReaction,
      this.numOfComment,
      this.dateTime,
      this.isLike,
      this.saved,
      this.reloadFunction});

  factory Post.fromJSON(Map data) {
    return Post(
      location: data['location'],
      id: data['id'],
      content: data['content'],
      medias: data['medias'],
      avatar: data['avatar'],
      displayName: data['displayName'],
      numOfReaction: data['numOfReaction'],
      numOfComment: data['numOfComment'],
      //timestamp: data['timestamp'],
    );
  }

  int getLikeCount(var likes) {
    if (likes == null) {
      return 0;
    }
    var vals = likes.values;
    int count = 0;
    for (var val in vals) {
      if (val == true) {
        count = count + 1;
      }
    }
    return count;
  }

  final String id;
  final String userId;
  final String content;
  final String location;
  final String displayName;
  final String avatar;
  final List<Medias> medias;
  final int numOfReaction;
  final int numOfComment;
  final DateTime dateTime;
  final bool isLike;
  final bool saved;
  final Function reloadFunction;
  _Post createState() => _Post(
      id: this.id,
      userId: this.userId,
      location: this.location,
      content: this.content,
      medias: this.medias,
      displayName: this.displayName,
      avatar: this.avatar,
      numOfReaction: this.numOfReaction,
      numOfComment: this.numOfComment,
      dateTime: this.dateTime,
      liked: this.isLike,
      saved: this.saved);
}

class _Post extends State<Post> {
  final String id;
  final String userId;
  final String content;
  final String location;
  final List<Medias> medias;
  final String displayName;
  final String avatar;
  final DateTime dateTime;
  bool saved;
  int numOfReaction;
  int numOfComment;
  bool liked;
  bool showHeart = false;
  int _current = 0;
  final CarouselController _controller = CarouselController();
  TextStyle boldStyle = TextStyle(
    color: Colors.black,
    fontWeight: FontWeight.bold,
  );

  _Post(
      {this.id,
      this.userId,
      this.location,
      this.content,
      this.medias,
      this.displayName,
      this.avatar,
      this.numOfReaction,
      this.numOfComment,
      this.dateTime,
      this.liked,
      this.saved});

  GestureDetector buildLikeIcon() {
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
        onTap: () {
          _likePost(id);
        });
  }

  GestureDetector buildLikeableImage() {
    final double height = MediaQuery.of(context).size.height;
    return GestureDetector(
      onDoubleTap: () => _likePost(id),
      child: Stack(
        alignment: Alignment.center,
        children: [
          medias.length == 1
              ? Container(
                  margin: EdgeInsets.only(bottom: 10),
                  child: ClipRRect(
                    child: Image.network(medias[0].url,
                        fit: BoxFit.cover,
                        width: 1000.0,
                        height: height * 0.55),
                  ))
              : Column(
                  children: [
                    CarouselSlider(
                        items: medias
                            .map((item) => GestureDetector(
                                  onTap: () {
                                    Navigator.push(
                                        context,
                                        PageRouteBuilder(
                                            pageBuilder: (context, animation,
                                                    secondaryAnimation) =>
                                                MultiImagesDetailActivity(
                                                  medias: medias,
                                                ),
                                            transitionsBuilder: (context,
                                                animation,
                                                secondaryAnimation,
                                                child) {
                                              const begin = Offset(0.0, 1.0);
                                              const end = Offset.zero;
                                              const curve = Curves.ease;

                                              var tween = Tween(
                                                      begin: begin, end: end)
                                                  .chain(
                                                      CurveTween(curve: curve));

                                              return SlideTransition(
                                                position:
                                                    animation.drive(tween),
                                                child: child,
                                              );
                                            }));
                                  },
                                  child: Container(
                                    margin: EdgeInsets.only(bottom: 10),
                                    child: ClipRRect(
                                        child: Stack(
                                      children: <Widget>[
                                        Image.network(item.url,
                                            fit: BoxFit.cover, width: 1000.0),
                                      ],
                                    )),
                                  ),
                                ))
                            .toList(),
                        carouselController: _controller,
                        options: CarouselOptions(
                            autoPlay: false,
                            onPageChanged: (index, reason) {
                              setState(() {
                                _current = index;
                              });
                            },
                            height: height * 0.55,
                            viewportFraction: 1.0,
                            enlargeCenterPage: false)),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: medias.asMap().entries.map((entry) {
                        return GestureDetector(
                          onTap: () => _controller.animateToPage(entry.key),
                          child: Container(
                            width: 9.0,
                            height: 9.0,
                            margin: EdgeInsets.symmetric(
                                vertical: 8.0, horizontal: 4.0),
                            decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: (Theme.of(context).brightness ==
                                            Brightness.dark
                                        ? Colors.white
                                        : Colors.black)
                                    .withOpacity(
                                        _current == entry.key ? 0.9 : 0.4)),
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ),
          showHeart
              ? Positioned(
                  child: Container(
                    width: 100,
                    height: 100,
                    child: Opacity(
                        opacity: 0.85,
                        child: FlareActor(
                          "assets/flare/Like.flr",
                          animation: "Like",
                        )),
                  ),
                )
              : Container()
        ],
      ),
    );
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
                    ? Text(displayName, style: boldStyle)
                    : Text("user", style: boldStyle),
                onTap: () {
                  openProfile(context, userId);
                },
              ),
              location != null ? Text(location, style: TextStyle(fontSize: 12),) : Container()
            ],
          ),
          userId == currentUserId
              ? Expanded(
                  child: Container(
                    alignment: Alignment.centerRight,
                    child: IconButton(
                      onPressed: () {
                        /*return showModalBottomSheet(
                      context: context,
                      isScrollControlled: true,
                      backgroundColor: Colors.transparent,
                      builder: (context) => buildMoreVert());*/
                        /*Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => EditPostActivity(
                                    id: this.id,
                                    medias: this.medias,
                                    content: this.content,
                                    avatar: this.avatar,
                                    displayName: this.displayName,
                                  )),
                        );*/
                        Navigator.push(
                            context,
                            PageRouteBuilder(
                                pageBuilder: (context, animation,
                                    secondaryAnimation) =>
                                    EditPostActivity(
                                      id: this.id,
                                      medias: this.medias,
                                      content: this.content,
                                      avatar: this.avatar,
                                      displayName: this.displayName,
                                      location: this.location,
                                    ),
                                transitionsBuilder: (context,
                                    animation,
                                    secondaryAnimation,
                                    child) {
                                  const begin = Offset(0.0, 1.0);
                                  const end = Offset.zero;
                                  const curve = Curves.ease;

                                  var tween = Tween(
                                      begin: begin, end: end)
                                      .chain(
                                      CurveTween(curve: curve));

                                  return FadeTransition(opacity: animation,child: child,);
                                })).then(widget.reloadFunction);
                      },
                      icon: Icon(Icons.edit_outlined),
                      color: Colors.black.withOpacity(0.7),
                    ),
                  ),
                )
              : Container()
        ],
      ),
    );
  }

  /*Widget buildMoreVert() {
    return DraggableScrollableSheet(
      maxChildSize: 0.5,
      minChildSize: 0.3,
      initialChildSize: 0.5,
      builder: (_, controller) => Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        padding: EdgeInsets.only(top: 10, left: 5,bottom: 10,right: 5),
        child: ListView(
          controller: controller,
          children: [
            ListTile(
              leading: Icon(
                Icons.edit_outlined,
                color: Colors.black,
              ),
              title: Text(
                "Edit post",
                style: TextStyle(fontSize: 16),
              ),
              onTap: (){
                Navigator.of(context).pop();
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => EditPostActivity(id: this.id,images: this.images,content: this.content,avatar: this.avatar,displayName: this.displayName,)),
                );
              },
            ),
            ListTile(
              leading: Icon(
                Icons.save_outlined,
                color: Colors.black,
              ),
              title: Text(
                "Save post",
                style: TextStyle(fontSize: 16),
              ),
            ),

          ],
        ),
      ),
    );
  }*/
  Container loadingPlaceHolder = Container(
    height: 400.0,
    child: Center(child: CircularProgressIndicator()),
  );

  @override
  Widget build(BuildContext context) {
    //liked = (likes[currentUserModel.id.toString()] == true);

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        buildPostHeader(),
        buildLikeableImage(),
        Row(
          mainAxisAlignment: MainAxisAlignment.start,
          children: <Widget>[
            Padding(padding: const EdgeInsets.only(left: 15.0, top: 40.0)),
            buildLikeIcon(),
            Padding(padding: const EdgeInsets.only(right: 20.0)),
            GestureDetector(
                child: const Icon(
                  FontAwesomeIcons.comment,
                  size: 25.0,
                ),
                onTap: () {
                  /*goToComments(
                    context: context,
                    postId: id,
                  );*/
                  return showModalBottomSheet(
                    context: context,
                    builder: (BuildContext context) {
                      return CommentActivity(
                        targetId: id,
                        targetType: Config.postCommentsType,
                        stepName: " ",
                      );
                    },
                    isScrollControlled: true,
                    backgroundColor: Colors.transparent,
                  );
                }),
            Expanded(
                child: Container(
              margin: EdgeInsets.only(right: 15),
              alignment: Alignment.centerRight,
              child: Icon(
                FontAwesomeIcons.solidSave,
                color: Colors.black,
              ),
            ))
          ],
        ),
        Row(
          children: <Widget>[
            Container(
              margin: const EdgeInsets.only(left: 15.0),
              child: numOfReaction != 0
                  ? Text(
                      "${numOfReaction} likes",
                      style: boldStyle,
                    )
                  : Text(
                      "0 like",
                      style: boldStyle,
                    ),
            )
          ],
        ),
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Container(
                margin: const EdgeInsets.only(left: 15.0),
                child: displayName != null
                    ? Text(
                        displayName,
                        style: boldStyle,
                      )
                    : Text(
                        "user",
                        style: boldStyle,
                      )),
            SizedBox(
              width: 5,
            ),
            Expanded(child: Text(content)),
          ],
        ),
        SizedBox(
          height: 5,
        ),
        Row(children: <Widget>[
          Container(
            margin: const EdgeInsets.only(left: 15.0),
            child: Text(
              timeago.format(dateTime),
              overflow: TextOverflow.ellipsis,
              style: TextStyle(fontSize: 13, color: Colors.grey),
            ),
          )
        ])
      ],
    );
  }

  void _likePost(String postId2) async {
    await APIService.react(ReactRequestModel(
        react: 'LOVE', targetKeyOrID: id, targetType: Config.postReactType));
    if (liked) {
      setState(() {
        liked = false;
        numOfReaction--;
      });
    } else {
      setState(() {
        liked = true;
        showHeart = true;
        numOfReaction++;
      });
      Timer(const Duration(milliseconds: 2000), () {
        setState(() {
          showHeart = false;
        });
      });
    }

    print("l");
  }

  void openProfile(BuildContext context, String userId) {
    Navigator.push(
        context,
        MaterialPageRoute(
            builder: (context) => ProfileActivity(
                  userId: userId,
                )));
  }
}

/*class ImagePostFromId extends StatelessWidget {
  final String id;

  const ImagePostFromId({this.id});

  getImagePost() async {
    var document =
        await FirebaseFirestore.instance.collection('posts').doc(id).get();
    return ImagePost.fromDocument(document);
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
        future: getImagePost(),
        builder: (context, snapshot) {
          if (!snapshot.hasData)
            return Container(
                alignment: FractionalOffset.center,
                padding: const EdgeInsets.only(top: 10.0),
                child: CircularProgressIndicator());
          return snapshot.data;
        });
  }
}*/

/*void goToComments(
    {BuildContext context, String postId, String ownerId, String mediaUrl}) {
  Navigator.of(context)
      .push(MaterialPageRoute<bool>(builder: (BuildContext context) {
    return CommentPage(
      postId: postId,
      postOwner: ownerId,
      postMediaUrl: mediaUrl,
    );
  }));
}*/

/*void openImagePost(BuildContext context, Post post) {
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
                  colors: <Color>[appPrimaryColor, appPrimaryColor2],
                ),
              ),
            ),
            title: Text('${post.displayName}' + '\'s Post'),
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
}*/
