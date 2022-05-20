import 'dart:async';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
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
import 'package:tastify/config.dart';
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

class _ProfileActivityState extends State<ProfileActivity>
    with TickerProviderStateMixin {
  final String profileId;
  ScrollController _scrollController = ScrollController();
  UserWallRespondModel user;
  List<Posts> postsMoment;
  List<Posts> postsFoodShare;
  List<Posts> postsRecommendation;
  int offsetPostsMoment = 0;
  int offsetPostsFoodShare = 0;
  int offserPostsRecommendation = 0;
  int offsetAlbums = 0;
  int totalPagePostsMoment = 1000;
  int totalPagePostsFoodShare = 1000;
  int totalPagePostsRecommendation = 1000;
  int totalPageAlbums = 1000;
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
  TabController _tabController;
  int indexTab = 0;

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
    _tabController = TabController(initialIndex: 0, length: 4, vsync: this);
    _scrollController.addListener(() {
      if (_scrollController.position.pixels ==
          _scrollController.position.maxScrollExtent) {
        _getMoreData();
      }
    });
  }

  @override
  void dispose() {
    // TODO: implement dispose
    _tabController.dispose();
    super.dispose();
  }

  void fetchData() async {
    var response = await APIService.getUserWall(profileId);
    var listPostsMoment = await APIService.getUserWallPosts(profileId, offsetPostsMoment,Config.postMomentType);
    var listPostsFoodShare = await APIService.getUserWallPosts(profileId, offsetPostsFoodShare, Config.postFoodShareType);
    var listPostsRecommendation = await APIService.getUserWallPosts(profileId, offserPostsRecommendation, Config.postRecommendType);
    var listAlbum = await APIService.getAlbum(profileId, offsetAlbums);
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
      if (listPostsMoment.data.posts.length > 0) {
        totalPagePostsMoment = listPostsMoment.data.metadata.totalPage;
      }
      if (listPostsFoodShare.data.posts.length > 0) {
        totalPagePostsFoodShare = listPostsFoodShare.data.metadata.totalPage;
      }
      if (listPostsRecommendation.data.posts.length > 0) {
        totalPagePostsRecommendation = listPostsRecommendation.data.metadata.totalPage;
      }
      if (listAlbum.data.albums.length > 0) {
        totalPageAlbums = listAlbum.data.metadata.totalPage;
      }
      isFollowing = response.data.isFollowed;
      user = response;
      postsMoment = listPostsMoment.data.posts;
      postsFoodShare = listPostsFoodShare.data.posts;
      postsRecommendation = listPostsRecommendation.data.posts;
      albums = temp;
      postCount = response.data.numberOfPost;
      followerCount = user.data.numberOfFollower;
      followingCount = user.data.numberOfFollowing;
      circular = false;
      offsetPostsMoment++;
      offsetAlbums++;
      offsetPostsFoodShare++;
      offserPostsRecommendation++;
    });
  }

  FutureOr reloadAlbum(dynamic value) async {
    var listAlbum = await APIService.getAlbum(profileId, 0);
    List<Album> temp = [];
    temp.add(Album(isCreateItem: true, id: "", name: "", url: ""));
    for (var i in listAlbum.data.albums) {
      temp.add(Album(
          isCreateItem: false, id: i.id, name: i.name, url: i.medias[0].url));
    }
    setState(() {
      albums = temp;
      offsetAlbums = 1;
      if (listAlbum.data.albums.length > 0) {
        totalPageAlbums = listAlbum.data.metadata.totalPage;
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
                fontSize: size.width * 0.055, fontWeight: FontWeight.bold),
          ),
          Container(
              margin: const EdgeInsets.only(top: 4.0),
              child: Text(
                label,
                style: TextStyle(
                    color: Colors.black,
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

        child: TextButton(
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
              width: isUser ? size.width * 0.8 : size.width / 3,
              height: size.height*0.05,
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

    Widget buildTabBar() {
      return Container(
          child: TabBar(
              onTap: (index) {
                setState(() {
                  indexTab = index;
                });
              },
              controller: _tabController,
              indicatorColor: Colors.grey,
              indicatorWeight: 1,
              labelColor: Colors.black,
              unselectedLabelColor: Colors.black26,
              tabs: [
            Tab(
              icon: Icon(
                Icons.grid_on,
                color: indexTab == 0 ? appPrimaryColor : Colors.black26,
              ),
            ),
                Tab(
                  icon: Icon(
                    Icons.share_outlined,
                    color: indexTab == 1 ? appPrimaryColor : Colors.black26,
                  ),
                ),
            Tab(
              icon: Icon(
                Icons.photo_album,
                color: indexTab == 2 ? appPrimaryColor : Colors.black26,
              ),
            ),
                Tab(
                  icon: Icon(
                    Icons.recommend,
                    color: indexTab == 3 ? appPrimaryColor : Colors.black26,
                  ),
                )
          ]));
    }



    Widget buildUserPosts() {
      return indexTab == 0
          ? postsMoment.length == 0
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.only(top: 20),
                    child: Text(
                      "Nothing to show!",
                      style: TextStyle(fontSize: 16),
                    ),
                  ),
                )
              : GridView.builder(
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 3, childAspectRatio: 1),
                  physics: NeverScrollableScrollPhysics(),
                  shrinkWrap: true,
                  itemCount: offsetPostsMoment < totalPagePostsMoment ? postsMoment.length + 2 : postsMoment.length,
                  itemBuilder: (BuildContext context, int index) {
                    if (index == postsMoment.length){
                      return Container();
                    }
                    if (index == postsMoment.length + 1) {
                      return  CupertinoActivityIndicator();
                    }

                    return ImageTile(postsMoment[index]);
                  })
          : indexTab == 1 ? postsFoodShare.length == 0
          ? Center(
        child: Padding(
          padding: const EdgeInsets.only(top: 20),
          child: Text(
            "Nothing to show!",
            style: TextStyle(fontSize: 16),
          ),
        ),
      )
          : GridView.builder(
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3, childAspectRatio: 1),
          physics: NeverScrollableScrollPhysics(),
          shrinkWrap: true,
          itemCount: offsetPostsFoodShare < totalPagePostsFoodShare ? postsFoodShare.length + 2 : postsFoodShare.length,
          itemBuilder: (BuildContext context, int index) {
            if (index == postsFoodShare.length){
              return Container();
            }
            if (index == postsFoodShare.length + 1) {
              return  CupertinoActivityIndicator();
            }

            return ImageTile(postsFoodShare[index]);
          }): albums.length == 0
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
                    if (index == albums.length) {
                      return offsetAlbums < totalPageAlbums
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
                  controller: _scrollController,
                  children: <Widget>[
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
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
                                        buildStatColumn(postCount > 1 ? "Posts" : "Post", postCount),
                                        buildStatColumn(
                                            followerCount > 1 ? "Followers" : "Follower", followerCount),
                                        buildStatColumn(
                                            followingCount > 1 ? "Followings" : "Following", followingCount),
                                      ],
                                    ),

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
                          buildProfileFollowButton(context),
                          /*Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceEvenly,
                                        children: <Widget>[
                                          buildProfileFollowButton(context)
                                        ]),*/
                        ],
                      ),
                    ),
                    Divider(),
                    buildTabBar(),
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
    var listPosts = await APIService.getUserWallPosts(profileId, offsetPostsMoment,Config.postMomentType);
    setState(() {
      if (listPosts.data.posts.length > 0) {
        totalPagePostsMoment = listPosts.data.metadata.totalPage;
      }
      postsMoment.addAll(listPosts.data.posts);
      offsetPostsMoment++;
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
        placeholder: (context, url) => Center(
            child: CircularProgressIndicator(
          color: Colors.white30,
        )),
        errorWidget: (context, url, error) => Icon(Icons.error),
      ),
    );
  }
}

class AlbumTile extends StatefulWidget {
  final Album album;
  final Function reloadFunction;
  final String userId;

  const AlbumTile({Key key, this.album, this.reloadFunction, this.userId})
      : super(key: key);

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
                MaterialPageRoute(
                    builder: (context) => AlbumDetailsActivity(
                          userId: widget.userId,
                          albumId: widget.album.id,
                          name: widget.album.name,
                        )),
              );
            },
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                    child: Container(
                        width: 1000,
                        height: 1000,
                        child: Image.network(url, fit: BoxFit.cover))),
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
