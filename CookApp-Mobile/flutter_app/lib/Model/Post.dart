import 'package:cached_network_image/cached_network_image.dart';
import 'package:flare_flutter/flare_actor.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
class Post extends StatefulWidget {
  const Post(
      {this.mediaUrl,
        this.location,
        this.description, // content
        this.likes,
        this.postId,
        this.ownerId,
        this.displayName,
        //this.timestamp
      }
        );


  factory Post.fromJSON(Map data) {
    return Post(
      location: data['location'],
      mediaUrl: data['mediaUrl'],
      likes: data['likes'],
      description: data['description'],
      ownerId: data['ownerId'],
      postId: data['postId'],
      displayName: data['displayName'],
      //timestamp: data['timestamp'],
    );
  }

  factory Post.fromMap(Map<String, dynamic> data) {
    return Post(
      location: data['location'],
      mediaUrl: data['mediaUrl'],
      likes: data['likes'],
      description: data['description'],
      ownerId: data['ownerId'],
      postId: data['postId'],
      displayName: data['displayName'],
      //timestamp: data['timestamp'],
    );
  }

  int getLikeCount(var likes) {
    if (likes == null) {
      return 0;
    }
// issue is below
    var vals = likes.values;
    int count = 0;
    for (var val in vals) {
      if (val == true) {
        count = count + 1;
      }
    }

    return count;
  }

  final String mediaUrl;
  //final Timestamp timestamp;

  //final String username;
  final String location;
  final String description;
  final likes;
  final String postId;
  final String ownerId;
  final String displayName;

  _Post createState() => _Post(
    mediaUrl: this.mediaUrl,
    location: this.location,
    description: this.description,
    likes: this.likes,
    likeCount: getLikeCount(this.likes),
    ownerId: this.ownerId,
    postId: this.postId,
    //timestamp: this.timestamp,
    displayName: this.displayName,
  );
}

class _Post extends State<Post> {
  final String mediaUrl;
  //final Timestamp timestamp;

  //final String username;
  final String location;
  final String description;
  Map likes;
  int likeCount;
  final String postId;
  bool liked;
  final String ownerId;
  final String displayName;
  bool showHeart = false;

  TextStyle boldStyle = TextStyle(
    color: Colors.black,
    fontWeight: FontWeight.bold,
  );

  _Post(
      {this.mediaUrl,
        //this.timestamp,
        this.location,
        this.description,
        this.likes,
        this.postId,
        this.likeCount,
        this.ownerId,
        this.displayName});

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
          _likePost(postId);
        });
  }

  GestureDetector buildLikeableImage() {
    return GestureDetector(
      onDoubleTap: () => _likePost(postId),
      child: Stack(
        alignment: Alignment.center,
        children: <Widget>[
          CachedNetworkImage(
            imageUrl: mediaUrl,
            fit: BoxFit.fitWidth,
            placeholder: (context, url) => loadingPlaceHolder,
            errorWidget: (context, url, error) => Icon(Icons.error),
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

  buildPostHeader({String ownerId}) {
    if (ownerId == null) {
      return Text("owner error");
    }

    return Container();
   /*   FutureBuilder(
        future:
        FirebaseFirestore.instance.collection('users').doc(ownerId).get(),
        builder: (context, snapshot) {
          if (snapshot.data != null) {
            return ListTile(
              leading: CircleAvatar(
                backgroundImage: CachedNetworkImageProvider(
                    snapshot.data.data()['photoUrl']),
                backgroundColor: Colors.grey,
              ),
              title: GestureDetector(
                child:
                Text(snapshot.data.data()['displayName'], style: boldStyle),
                onTap: () {
                  //openProfile(context, ownerId);
                },
              ),
              subtitle: Text(this.location),
              trailing: const Icon(Icons.more_vert),
            );
          }

          // snapshot data is null here
          return Container();
        });*/
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
        buildPostHeader(ownerId: ownerId),
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
                      postId: postId,
                      ownerId: ownerId,
                      mediaUrl: mediaUrl);
                }),
          ],
        ),
        Row(
          children: <Widget>[
            Container(
              margin: const EdgeInsets.only(left: 20.0),
              child: Text(
                "$likeCount likes",
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
                child: Text(
                  "$displayName ",
                  style: boldStyle,
                )),
            Expanded(child: Text(description)),
          ],
        )
      ],
    );
  }

  void _likePost(String postId2) {
    /*var userId = currentUserModel.id;
    bool _liked = likes[userId] == true;

    if (_liked) {
      print('removing like');
      reference.doc(postId).update({
        'likes.$userId': false
        //firestore plugin doesnt support deleting, so it must be nulled / falsed
      });

      setState(() {
        likeCount = likeCount - 1;
        liked = false;
        likes[userId] = false;
      });

      removeActivityFeedItem();
    }

    if (!_liked) {
      print('liking');
      reference.doc(postId).update({'likes.$userId': true});

      addActivityFeedItem();

      setState(() {
        likeCount = likeCount + 1;
        liked = true;
        likes[userId] = true;
        showHeart = true;
      });
      Timer(const Duration(milliseconds: 2000), () {
        setState(() {
          showHeart = false;
        });
      });
    }*/
  }

  void addActivityFeedItem() {
   /* FirebaseFirestore.instance
        .collection("feed")
        .doc(ownerId)
        .collection("items")
        .doc(postId)
        .set({
      "userId": currentUserModel.id,
      "type": "like",
      "userProfileImg": currentUserModel.photoUrl,
      "mediaUrl": mediaUrl,
      "username": currentUserModel.displayName,
      "timestamp": DateTime.now(),
      "postId": postId,
    });*/
  }

  void removeActivityFeedItem() {
    /*FirebaseFirestore.instance
        .collection("feed")
        .doc(ownerId)
        .collection("items")
        .doc(postId)
        .delete();*/
  }
}

class ImagePostFromId extends StatelessWidget {
  final String id;

  const ImagePostFromId({this.id});

  getImagePost() async {
    /*var document =
    await FirebaseFirestore.instance.collection('posts').doc(id).get();
    return ImagePost.fromDocument(document);*/
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
}

void goToComments(
    {BuildContext context, String postId, String ownerId, String mediaUrl}) {
 /* Navigator.of(context)
      .push(MaterialPageRoute<bool>(builder: (BuildContext context) {
    return CommentPage(
      postId: postId,
      postOwner: ownerId,
      postMediaUrl: mediaUrl,
    );
  }));*/
}

void openImagePost(BuildContext context, Post post) {
  /*Navigator.of(context)
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
  }));*/
}
