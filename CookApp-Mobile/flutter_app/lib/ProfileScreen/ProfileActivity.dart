import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_app/Model/Post.dart';
import 'package:flutter_app/Model/PostDetailsRespondModel.dart';
import 'package:flutter_app/Model/UserRespondModel.dart';
import 'package:flutter_app/Model/WallPostRespondModel.dart';
import 'package:flutter_app/Services/APIService.dart';

import '../constants.dart';
import 'EditProfileActivity.dart';

class ProfileActivity extends StatefulWidget {
  @override
  _ProfileActivityState createState() => _ProfileActivityState();
}

class _ProfileActivityState extends State<ProfileActivity> {
  UserRespondModel user;
  WallPostRespondModel posts;
  bool isFollowing = false;
  String view = "grid";
  int postCount = 0;
  bool followButtonClicked = false;
  bool circular = true;
  EditProfileActivity editProfile = new EditProfileActivity();

  openEditProfilePage() async {
    Navigator.push(context, MaterialPageRoute(
      builder: (context) {
        return editProfile;
      },
    ));
  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();

    fetchData();
  }

  void fetchData() async {
    var response = await APIService.getUser();
    var listPosts = await APIService.getUserWallPosts();

    setState(() {
      user = response;
      posts = listPosts;
      postCount = listPosts.data.posts.length;
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
      return buildFollowButton(
        text: "Edit Profile",
        backgroundcolor: Colors.white,
        textColor: Colors.black,
        borderColor: Colors.grey,
        function: openEditProfilePage,
      );
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

    Widget buildUserPosts() {
      return posts.data.posts.length == 0
          ? Container(
              alignment: FractionalOffset.center,
              padding: const EdgeInsets.only(top: 10.0),
              child: CircularProgressIndicator())
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
            child: Text("Profile"),
          )),
      body: circular
          ? Center(child: CircularProgressIndicator())
          : ListView(
              children: <Widget>[
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: <Widget>[
                      Row(
                        children: <Widget>[
                          (user.data.avatar != null)
                              ? CircleAvatar(
                                  radius: size.width * 0.11,
                                  backgroundColor: Colors.grey,
                                  backgroundImage:
                                      NetworkImage(user.data.avatar),
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
                                    buildStatColumn("followers", 5),
                                    buildStatColumn("following", 5),
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
                            "bio",
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
    );
  }

  followUser() {
    print('following user');
    setState(() {
      this.isFollowing = true;
      followButtonClicked = true;
    });
  }

  unfollowUser() {
    setState(() {
      isFollowing = false;
      followButtonClicked = true;
    });
  }

  changeView(String viewName) {
    setState(() {
      view = viewName;
    });
  }
}

class ImageTile extends StatelessWidget {
  final Posts posts;

  ImageTile(this.posts);

  clickedImage(BuildContext context) async {
    PostDetailsRespondModel res = await APIService.getDetailsPost(posts.id);
    Post post = Post(
      id: res.data.id,
      location: "Quang Binh",
      content: res.data.content,
      images: res.data.images,
      avatar: res.data.author.avatar,
      displayName: res.data.author.displayName,
    );
    openImagePost(context, post);
  }

  Widget build(BuildContext context) {
    return GestureDetector(
        onTap: () => clickedImage(context),
        child: Image.network(posts.images[0], fit: BoxFit.cover));
  }
}

void openImagePost(BuildContext context, Post post) {
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
                  colors: <Color>[appPrimaryColor, appPrimaryColor],
                ),
              ),
            ),
            title: Text('Post'),
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
}
