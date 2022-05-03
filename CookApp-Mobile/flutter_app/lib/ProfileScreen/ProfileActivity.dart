import 'dart:async';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:snippet_coder_utils/ProgressHUD.dart';
import 'package:tastify/MessageScreen/ConversationsActivity.dart';
import 'package:tastify/MessageScreen/MessageActivity.dart';
import 'package:tastify/Model/AlbumRespondModel.dart';
import 'package:tastify/Model/CreateConversationRequestModel.dart';
import 'package:tastify/ProfileScreen/AlbumDetailsActivity.dart';
import 'package:tastify/ProfileScreen/CreateAlbumActivity.dart';
import 'package:tastify/SavedPostScreen/SavedPostActivity.dart';
import 'package:tastify/Services/Auth.dart';
import 'package:tastify/Services/SharedService.dart';
import 'package:tastify/SettingsScreen/SettingsActivity.dart';
import '../NewFeedScreen/PostDetail.dart';
import '../NewFeedScreen/Post.dart';

import 'package:tastify/Model/UserRespondModel.dart';
import 'package:tastify/Model/UserWallRespondModel.dart';
import 'package:tastify/Model/WallPostRespondModel.dart';
import 'package:tastify/Services/APIService.dart';

import '../constants.dart';
import '../main.dart';
import 'Album.dart';
import 'EditProfileActivity.dart';

class ProfileActivity extends StatefulWidget {
  final String userId;
  final AuthBase auth;

  const ProfileActivity({Key key, this.userId, this.auth}) : super(key: key);

  @override
  _ProfileActivityState createState() => _ProfileActivityState(this.userId);
}

class _ProfileActivityState extends State<ProfileActivity> {
  final String profileId;
  ScrollController _scrollController = ScrollController();
  UserWallRespondModel user;
  List<Posts> posts;
  int offsetPost = 0;
  int offsetAlbum = 0;
  int totalPagePost = 1000;
  int totalPageAlbum = 1000;
  List<Album> albums;
  bool isFollowing = false;
  String view = "grid";
  int postCount = 0;
  int followerCount = 0;
  int followingCount = 0;
  bool circular = true;
  bool isAPIcallProcess = false;
  GlobalKey<FormState> globalFormKey = GlobalKey<FormState>();
  EditProfileActivity editProfile = new EditProfileActivity();

  _ProfileActivityState(this.profileId);

  FutureOr onGoBack(dynamic value) {
    reloadUser();
  }

  void openEditProfilePage() {
    Route route =
        MaterialPageRoute(builder: (context) => EditProfileActivity());
    Navigator.push(context, route).then(onGoBack);
  }

  /*openEditProfilePage() async {
    Navigator.push(context, MaterialPageRoute(
      builder: (context) {
        return editProfile;
      },
    ));
  }*/
  @override
  void initState() {
    // TODO: implement initState
    super.initState();

    fetchData();
    _scrollController.addListener(() {
      if (_scrollController.position.pixels ==
          _scrollController.position.maxScrollExtent) {
        _getMoreData();
      }
    });
  }

  void fetchData() async {

    var response = await APIService.getUserWall(profileId);
    var listPosts = await APIService.getUserWallPosts(profileId,offsetPost);
    var listAlbum = await APIService.getAlbum(profileId,offsetAlbum);
    List<Album> temp = [];
    if (response.data.id == currentUserId) {
      temp.add(Album(isCreateItem: true, id: "", name: "", url: ""));
    }

    for (var i in listAlbum.data.albums) {
      temp.add(Album(
          isCreateItem: false, id: i.id, name: i.name, url: i.medias[0].url));
    }
    print('ln');
    setState(() {
      if (listPosts.data.posts.length > 0) {
        totalPagePost = listPosts.data.metadata.totalPage;
      }
      if (listAlbum.data.albums.length > 0) {
        totalPageAlbum = listAlbum.data.metadata.totalPage;
      }
      isFollowing = response.data.isFollowed;
      user = response;
      posts = listPosts.data.posts;
      albums = temp;
      postCount = response.data.numberOfPost;
      followerCount = user.data.numberOfFollower;
      followingCount = user.data.numberOfFollowing;
      circular = false;
      offsetAlbum++;
      offsetPost++;
    });
  }
  FutureOr reloadAlbum (dynamic value) async{
    var listAlbum = await APIService.getAlbum(profileId,0);
    List<Album> temp = [];
    temp.add(Album(isCreateItem: true, id: "", name: "", url: ""));
    for (var i in listAlbum.data.albums) {
      temp.add(Album(
          isCreateItem: false, id: i.id, name: i.name, url: i.medias[0].url));
    }
    setState(() {
      albums = temp;
      offsetAlbum = 1;
      if (listAlbum.data.albums.length > 0) {
        totalPageAlbum = listAlbum.data.metadata.totalPage;
      }
    });
  }
  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;
    Column buildStatColumn(String label, int number) {
      return Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Text(
            number.toString(),
            style: TextStyle(
                fontSize: size.width * 0.05, fontWeight: FontWeight.bold),
          ),
          Container(
              margin: const EdgeInsets.only(top: 4.0),
              child: Text(
                label,
                style: TextStyle(
                    color: Colors.grey,
                    fontSize: size.width * 0.035,
                    fontWeight: FontWeight.w400),
              ))
        ],
      );
    }

    Container buildFollowButton(
        {String text,
        Color backgroundcolor,
        Color textColor,
        Color borderColor,
        Function function,
        bool isUser}) {
      return Container(
        padding: EdgeInsets.only(top: 2.0),
        child: FlatButton(
            onPressed: function,
            child: Container(
              decoration: BoxDecoration(
                  color: backgroundcolor,
                  border: Border.all(color: borderColor),
                  borderRadius: BorderRadius.circular(5.0)),
              alignment: Alignment.center,
              child: Text(text,
                  style:
                      TextStyle(color: textColor, fontWeight: FontWeight.bold)),
              width: isUser ? size.width * 0.6 : size.width * 0.25,
              height: 27.0,
            )),
      );
    }

    Widget buildProfileFollowButton(BuildContext _context) {
      if (currentUserId == profileId) {
        print("Build edit button");
        return buildFollowButton(
          text: "Edit Profile",
          backgroundcolor: Colors.white,
          textColor: Colors.black,
          borderColor: Colors.grey,
          function: openEditProfilePage,
          isUser: true,
        );
      }
      if (isFollowing) {
        return Row(
          children: [
            buildFollowButton(
              text: "Unfollow",
              backgroundcolor: Colors.white,
              textColor: Colors.black,
              borderColor: Colors.grey,
              function: unfollowUser,
              isUser: false,
            ),
            buildFollowButton(
              text: "Message",
              backgroundcolor: Colors.white,
              textColor: Colors.black,
              borderColor: Colors.grey,
              function: openMessage,
              isUser: false,
            )
          ],
        );
      }

      if (!isFollowing) {
        return Row(
          children: [
            buildFollowButton(
              text: "Follow",
              backgroundcolor: Colors.blue,
              textColor: Colors.white,
              borderColor: Colors.blue,
              function: followUser,
              isUser: false,
            ),
            buildFollowButton(
              text: "Message",
              backgroundcolor: Colors.white,
              textColor: Colors.black,
              borderColor: Colors.grey,
              function: openMessage,
              isUser: false,
            )
          ],
        );
      }

      return buildFollowButton(
          text: "loading...",
          backgroundcolor: Colors.white,
          textColor: Colors.black,
          borderColor: Colors.grey,
          isUser: false);
    }

    Row buildImageViewButtonBar() {
      Color isActiveButtonColor(String viewName) {
        if (view == viewName) {
          return appPrimaryColor;
        } else {
          return Colors.black26;
        }
      }

      return Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: <Widget>[
          IconButton(
            icon: Icon(Icons.grid_on, color: isActiveButtonColor("grid")),
            onPressed: () {
              changeView("grid");
            },
          ),
          IconButton(
            icon: Icon(Icons.list, color: isActiveButtonColor("feed")),
            onPressed: () {
              changeView("feed");
            },
          ),
        ],
      );
    }

    Future<void> _signOut() async {
      try {
        await widget.auth.signOut();
      } catch (e) {
        print(e.toString());
      }
      //currentUser = null;
    }

    Widget buildUserPosts() {
      return view == "grid"
          ? posts.length == 0
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.only(top: 20),
                    child: Text(
                      "Nothing to show!",
                      style: TextStyle(fontSize: 16),
                    ),
                  ),
                )
              : GridView.count(
                  crossAxisCount: 3,
                  childAspectRatio: 1.0,
                  padding: const EdgeInsets.all(0.5),
                  mainAxisSpacing: 1.5,
                  crossAxisSpacing: 1.5,
                  controller: _scrollController,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  children: List.generate(posts.length, (index) {
                    if(index == posts.length){
                      return offsetPost < totalPagePost
                          ? CupertinoActivityIndicator()
                          : SizedBox(
                        height: 8,
                      );
                    }
                    return ImageTile(posts[index]);
                  }))

          : albums.length == 0
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.only(top: 20),
                    child: Text(
                      "Nothing to show!",
                      style: TextStyle(fontSize: 16),
                    ),
                  ),
                )
              : GridView.count(
                  crossAxisCount: 2,
                  childAspectRatio: 0.9,
                  padding: const EdgeInsets.all(10),
                  mainAxisSpacing: 15,
                  crossAxisSpacing: 15,
                  controller: _scrollController,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  children: List.generate(albums.length, (index) {
                    if(index == albums.length){
                      return offsetAlbum < totalPageAlbum
                          ? CupertinoActivityIndicator()
                          : SizedBox(
                        height: 8,
                      );
                    }
                    return AlbumTile(
                      album: albums[index],
                      reloadFunction: reloadAlbum,
                      userId: user.data.id,
                    );
                  }));
    }

    Widget buildMoreVert() {
      return DraggableScrollableSheet(
        maxChildSize: 0.3,
        minChildSize: 0.2,
        initialChildSize: 0.3,
        builder: (_, controller) => Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          padding: EdgeInsets.only(top: 10, left: 5, bottom: 10, right: 5),
          child: ListView(
            controller: controller,
            children: [
              ListTile(
                leading: Icon(
                  Icons.settings_outlined,
                  color: Colors.black,
                ),
                title: Text(
                  "Settings",
                  style: TextStyle(fontSize: 16),
                ),
                onTap: () {
                  Navigator.of(context).pop();
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => SettingsActivity()),
                  );
                },
              ),
              ListTile(
                leading: Icon(
                  Icons.save_outlined,
                  color: Colors.black,
                ),
                title: Text(
                  "Saved",
                  style: TextStyle(fontSize: 16),
                ),
                onTap: () {
                  Navigator.of(context).pop();
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => SavedPostActivity()),
                  );
                },
              ),
              ListTile(
                leading: Icon(
                  Icons.logout,
                  color: Colors.black,
                ),
                title: Text(
                  "Log out",
                  style: TextStyle(fontSize: 16),
                ),
                onTap: () async {
                  Navigator.of(context).pop();
                  setState(() {
                    isAPIcallProcess = true;
                  });
                  await _signOut();
                  await SharedService.logout(context);
                  setState(() {
                    isAPIcallProcess = false;
                  });
                },
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        brightness: Brightness.dark,
        automaticallyImplyLeading: false,
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: <Color>[appPrimaryColor, appPrimaryColor],
            ),
          ),
        ),
        title: Container(
          child: Text("Profile",
              style: TextStyle(
                  fontFamily: 'Billabong',
                  fontSize: 32,
                  fontStyle: FontStyle.italic)),
        ),
        actions: [
          profileId == currentUserId
              ? IconButton(
                  onPressed: () {
                    return showModalBottomSheet(
                        context: context,
                        isScrollControlled: true,
                        backgroundColor: Colors.transparent,
                        builder: (context) => buildMoreVert());
                  },
                  icon: Icon(Icons.more_vert))
              : Container(),
        ],
      ),
      body: circular
          ? Center(child: CircularProgressIndicator())
          : ProgressHUD(
              inAsyncCall: isAPIcallProcess,
              key: UniqueKey(),
              opacity: 0.3,
              child: Form(
                key: globalFormKey,
                child: ListView(
                  children: <Widget>[
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        children: <Widget>[
                          Row(
                            children: <Widget>[
                              (user.data.avatar.url != null)
                                  ? CircleAvatar(
                                      radius: size.width * 0.11,
                                      backgroundColor: Colors.grey,
                                      backgroundImage:
                                          NetworkImage(user.data.avatar.url),
                                    )
                                  : CircleAvatar(
                                      /*child: Image.asset("assets/images/default_avatar.png",
                                        width: size.width * 0.20,
                                        height: size.width * 0.20,
                                        fit: BoxFit.fill),*/
                                      radius: size.width * 0.11,
                                      backgroundColor: Colors.grey,
                                      backgroundImage: AssetImage(
                                          'assets/images/default_avatar.png')),
                              Expanded(
                                flex: 1,
                                child: Column(
                                  children: <Widget>[
                                    Row(
                                      mainAxisSize: MainAxisSize.max,
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceEvenly,
                                      children: <Widget>[
                                        buildStatColumn("posts", postCount),
                                        buildStatColumn(
                                            "followers", followerCount),
                                        buildStatColumn(
                                            "following", followingCount),
                                      ],
                                    ),
                                    Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceEvenly,
                                        children: <Widget>[
                                          buildProfileFollowButton(context)
                                        ]),
                                  ],
                                ),
                              )
                            ],
                          ),
                          Container(
                              alignment: Alignment.centerLeft,
                              padding: const EdgeInsets.only(top: 15.0),
                              child: Text(
                                user.data.displayName,
                                style: TextStyle(fontWeight: FontWeight.bold),
                              )),
                        ],
                      ),
                    ),
                    Divider(),
                    buildImageViewButtonBar(),
                    Divider(height: 0.0),
                    buildUserPosts(),
                  ],
                ),
              ),
            ),
    );
  }

  followUser() async {
    await APIService.follow(profileId);
    setState(() {
      this.isFollowing = true;
      followerCount++;
    });
  }

  unfollowUser() async {
    await APIService.unfollow(profileId);
    setState(() {
      isFollowing = false;
      followerCount--;
    });
  }

  openMessage() async {
    if (user.data.conversation == null) {
      CreateConversationRequestModel model = CreateConversationRequestModel(
          members: [currentUserId, profileId], type: "DIRECT");
      await APIService.createConversation(model);
    }
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => ConversationsActivity()),
    );
  }

  changeView(String viewName) {
    setState(() {
      view = viewName;
    });
  }

  void reloadUser() async {
    var response = await APIService.getUserWall(profileId);
    setState(() {
      user = response;
    });
  }

  void _getMoreData() async {
    print("get more");
    var listPosts = await APIService.getUserWallPosts(profileId,offsetPost);
    setState(() {
      if (listPosts.data.posts.length > 0) {
        totalPagePost = listPosts.data.metadata.totalPage;
      }
      posts.addAll(listPosts.data.posts);
      offsetPost++;
    });
  }
}

class ImageTile extends StatelessWidget {
  final Posts posts;

  ImageTile(this.posts);

  clickedImage(BuildContext context) async {
    openImagePost(context, posts.id);
  }

  Widget build(BuildContext context) {
    return GestureDetector(
        onTap: () => clickedImage(context),
        child: CachedNetworkImage(

          imageUrl: posts.medias[0].url,
          imageBuilder: (context, imageProvider) => Container(
            decoration: BoxDecoration(
              image: DecorationImage(
                image: imageProvider,
                fit: BoxFit.cover,
              ),
            ),
          ),
          placeholder: (context, url) => Center(child: CircularProgressIndicator(color: Colors.white30,)),
          errorWidget: (context, url, error) => Icon(Icons.error),
        ),);

  }
}

class AlbumTile extends StatefulWidget {
  final Album album;
  final Function reloadFunction;
  final String userId;
  const AlbumTile({Key key, this.album, this.reloadFunction, this.userId}) : super(key: key);

  @override
  State<AlbumTile> createState() =>
      _AlbumTileState(name: album.name, url: album.url);
}

class _AlbumTileState extends State<AlbumTile> {
  String url;
  String name;

  _AlbumTileState({this.name, this.url});

  @override
  Widget build(BuildContext context) {
    return widget.album.isCreateItem
        ? GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => CreateAlbumActivity()),
              ).then(widget.reloadFunction);
            },
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                        border: Border.all(color: appPrimaryColor)),
                    child: Center(
                      child: IconButton(
                        icon: Icon(Icons.add, color: appPrimaryColor),
                        iconSize: 30,
                      ),
                    ),
                  ),
                ),
                SizedBox(
                  height: 5,
                ),
                Text(
                  "Create album",
                  overflow: TextOverflow.ellipsis,
                  maxLines: 1,
                ),
              ],
            ))
        : GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => AlbumDetailsActivity(userId: widget.userId, albumId: widget.album.id, name: widget.album.name,)),
              );
            },
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(child: Container( width: 1000, height: 1000,child: Image.network(url, fit: BoxFit.cover))),
                SizedBox(
                  height: 5,
                ),
                Text(
                  name,
                  overflow: TextOverflow.ellipsis,
                  maxLines: 1,
                )
              ],
            ));
    ;
  }
}

void openImagePost(BuildContext context, String id) {
  Navigator.push(
    context,
    MaterialPageRoute(builder: (context) => PostDetail(id: id)),
  );
}
