import 'dart:async';

import 'package:flutter/material.dart';
import 'package:snippet_coder_utils/ProgressHUD.dart';
import 'package:tastify/Services/Auth.dart';
import 'package:tastify/Services/SharedService.dart';
import 'package:tastify/SettingsScreen/SettingsActivity.dart';
import '../NewFeedScreen/PostDetail.dart';
import '../NewFeedScreen/Post.dart';
import 'package:tastify/Model/PostDetailsRespondModel.dart';
import 'package:tastify/Model/UserRespondModel.dart';
import 'package:tastify/Model/UserWallRespondModel.dart';
import 'package:tastify/Model/WallPostRespondModel.dart';
import 'package:tastify/Services/APIService.dart';

import '../constants.dart';
import '../main.dart';
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

  UserWallRespondModel user;
  WallPostRespondModel posts;
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
  }

  void fetchData() async {
    var response = await APIService.getUserWall(profileId);
    var listPosts = await APIService.getUserWallPosts(profileId);

    setState(() {
      isFollowing = response.data.isFollowed;
      user = response;
      posts = listPosts;
      postCount = listPosts.data.posts.length;
      followerCount = user.data.numberOfFollower;
      followingCount = user.data.numberOfFollowing;
      circular = false;
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
        Function function}) {
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
              width: size.width * 0.6,
              height: 27.0,
            )),
      );
    }

    Container buildProfileFollowButton(BuildContext _context) {
      if (currentUserId == profileId) {
        print("Build edit button");
        return buildFollowButton(
          text: "Edit Profile",
          backgroundcolor: Colors.white,
          textColor: Colors.black,
          borderColor: Colors.grey,
          function: openEditProfilePage,
        );
      }
      if (isFollowing) {
        return buildFollowButton(
          text: "Unfollow",
          backgroundcolor: Colors.white,
          textColor: Colors.black,
          borderColor: Colors.grey,
          function: unfollowUser,
        );
      }

      if (!isFollowing) {
        return buildFollowButton(
          text: "Follow",
          backgroundcolor: Colors.blue,
          textColor: Colors.white,
          borderColor: Colors.blue,
          function: followUser,
        );
      }

      return buildFollowButton(
          text: "loading...",
          backgroundcolor: Colors.white,
          textColor: Colors.black,
          borderColor: Colors.grey);
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
      return posts.data.posts.length == 0
          ? Center(
              child: Padding(
                padding: const EdgeInsets.only(top: 20),
                child: Text(
                  "Nothing to show!",
                  style: TextStyle(fontSize: 16),
                ),
              ),
            )
          : view == "grid"
              ? GridView.count(
                  crossAxisCount: 3,
                  childAspectRatio: 1.0,
                  padding: const EdgeInsets.all(0.5),
                  mainAxisSpacing: 1.5,
                  crossAxisSpacing: 1.5,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  children: List.generate(posts.data.posts.length, (index) {
                    return ImageTile(posts.data.posts[index]);
                  }))
              : Column(
                  children: List.generate(posts.data.posts.length, (index) {
                    return ImageTile(posts.data.posts[index]);
                  }),
                );
    }
    Widget buildMoreVert() {
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
                  Icons.settings_outlined,
                  color: Colors.black,

                ),
                title: Text(
                  "Settings",
                  style: TextStyle(fontSize: 16),
                ),
                onTap: (){
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
                              (user.data.user.avatar != null)
                                  ? CircleAvatar(
                                      radius: size.width * 0.11,
                                      backgroundColor: Colors.grey,
                                      backgroundImage:
                                          NetworkImage(user.data.user.avatar),
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
                                user.data.user.displayName,
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
        child: Image.network(posts.images[0], fit: BoxFit.cover));
  }
}

void openImagePost(BuildContext context, String id) {
  Navigator.push(
    context,
    MaterialPageRoute(builder: (context) => PostDetail(id: id)),
  );
}
