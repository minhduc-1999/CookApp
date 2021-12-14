import 'dart:async';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flare_flutter/flare_actor.dart';
import 'package:flutter/material.dart';
import 'package:flutter_app/CommentScreen/CommentActivity.dart';
import 'package:flutter_app/Model/ReactRequestModel.dart';
import 'package:flutter_app/Model/UserRespondModel.dart';
import 'package:flutter_app/ProfileScreen/ProfileActivity.dart';
import 'package:flutter_app/Services/APIService.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class Post extends StatefulWidget {
  const Post(
      {this.id,
      this.userId,
      this.location,
      this.content,
      this.images,
      this.avatar,
      this.displayName,
      this.numOfReaction,
      this.numOfComment});

  factory Post.fromJSON(Map data) {
    return Post(
      location: data['location'],
      id: data['id'],
      content: data['content'],
      images: data['images'],
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
  final List<String> images;
  final int numOfReaction;
  final int numOfComment;

  _Post createState() => _Post(
      id: this.id,
      userId: this.userId,
      location: this.location,
      content: this.content,
      images: this.images,
      displayName: this.displayName,
      avatar: this.avatar,
      numOfReaction: this.numOfReaction,
      numOfComment: this.numOfComment);
}

class _Post extends State<Post> {
  final String id;
  final String userId;
  final String content;
  final String location;
  final List<String> images;
  final String displayName;
  final String avatar;
  int numOfReaction;
  int numOfComment;
  bool liked = false;
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
      this.images,
      this.displayName,
      this.avatar,
      this.numOfReaction,
      this.numOfComment});

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
          images.length == 1
              ?
              /*CachedNetworkImage(
            imageUrl: images[0],
            fit: BoxFit.fitWidth,
            placeholder: (context, url) => loadingPlaceHolder,
            errorWidget: (context, url, error) => Icon(Icons.error),
          ),*/
              Container(
                margin: EdgeInsets.all(5.0),
                  child: ClipRRect(
                    borderRadius: BorderRadius.all(Radius.circular(5.0)),
                    child: Image.network(
                      images[0],
                      fit: BoxFit.cover,
                      width: 1000.0,
                        height: height*0.6
                    ),
                  ))
              : Column(
                children: [
                  CarouselSlider(
                      items: images
                          .map((item) => Container(
                                child: Container(
                                  margin: EdgeInsets.all(5.0),
                                  child: ClipRRect(
                                      borderRadius:
                                          BorderRadius.all(Radius.circular(5.0)),
                                      child: Stack(
                                        children: <Widget>[
                                          Image.network(item,
                                              fit: BoxFit.cover, width: 1000.0),
                                          Positioned(
                                            bottom: 0.0,
                                            left: 0.0,
                                            right: 0.0,
                                            child: Container(
                                              decoration: BoxDecoration(
                                                gradient: LinearGradient(
                                                  colors: [
                                                    Color.fromARGB(200, 0, 0, 0),
                                                    Color.fromARGB(0, 0, 0, 0)
                                                  ],
                                                  begin: Alignment.bottomCenter,
                                                  end: Alignment.topCenter,
                                                ),
                                              ),
                                              padding: EdgeInsets.symmetric(
                                                  vertical: 10.0, horizontal: 20.0),

                                            ),
                                          ),
                                        ],
                                      )),
                                ),
                              ))
                          .toList(),
                      carouselController: _controller,
                      options: CarouselOptions(
                        autoPlay: false,
                          onPageChanged: (index, reason){
                            setState(() {
                              _current = index;
                            });
                          },
                          height: height*0.6,
                          viewportFraction: 1.0,
                          enlargeCenterPage: false)),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: images.asMap().entries.map((entry) {
                      return GestureDetector(
                        onTap: () => _controller.animateToPage(entry.key),
                        child: Container(
                          width: 12.0,
                          height: 12.0,
                          margin: EdgeInsets.symmetric(vertical: 8.0, horizontal: 4.0),
                          decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: (Theme.of(context).brightness == Brightness.dark
                                  ? Colors.white
                                  : Colors.black)
                                  .withOpacity(_current == entry.key ? 0.9 : 0.4)),
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

  Widget buildPostHeader({String ownerId}) {
    if (ownerId == null) {
      return Text("owner error");
    }

    return ListTile(
      leading: (avatar != null)
          ? CircleAvatar(
              backgroundColor: Colors.grey,
              backgroundImage: NetworkImage(avatar),
            )
          : CircleAvatar(
              /*child: Image.asset("assets/images/default_avatar.png",
                                    width: size.width * 0.20,
                                    height: size.width * 0.20,
                                    fit: BoxFit.fill),*/
              backgroundColor: Colors.grey,
              backgroundImage: AssetImage('assets/images/default_avatar.png')),
      title: GestureDetector(
        child: displayName != null
            ? Text(displayName, style: boldStyle)
            : Text("user", style: boldStyle),
        onTap: () {
          openProfile(context, userId);
        },
      ),
      subtitle: Text(this.location),
      trailing: const Icon(Icons.more_vert),
    );
  }

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
        buildPostHeader(ownerId: "abc"),
        buildLikeableImage(),
        Row(
          mainAxisAlignment: MainAxisAlignment.start,
          children: <Widget>[
            Padding(padding: const EdgeInsets.only(left: 20.0, top: 40.0)),
            buildLikeIcon(),
            Padding(padding: const EdgeInsets.only(right: 20.0)),
            GestureDetector(
                child: const Icon(
                  FontAwesomeIcons.comment,
                  size: 25.0,
                ),
                onTap: () {
                  goToComments(
                    context: context,
                    postId: id,
                  );
                }),
          ],
        ),
        Row(
          children: <Widget>[
            Container(
              margin: const EdgeInsets.only(left: 20.0),
              child: numOfReaction != null
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
                margin: const EdgeInsets.only(left: 20.0),
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
          height: 10,
        )
      ],
    );
  }

  void goToComments({BuildContext context, String postId}) {
    Navigator.of(context)
        .push(MaterialPageRoute<bool>(builder: (BuildContext context) {
      return CommentActivity(postId: postId);
    }));
  }

  void _likePost(String postId2) async {
    await APIService.react(id, ReactRequestModel(react: 'LOVE'));
    bool _liked = liked;
    if (_liked) {
      setState(() {
        liked = false;
        numOfReaction--;
      });
    }

    if (!_liked) {
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
