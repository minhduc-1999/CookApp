import 'package:flutter/material.dart';
import 'package:flutter_app/Model/NewFeedRespondModel.dart';
import 'package:flutter_app/Model/Post.dart';
import 'package:flutter_app/Services/APIService.dart';
import 'package:flutter_app/Services/SharedService.dart';
import 'package:flutter_app/UploadScreen/UploadActivity.dart';
import 'package:flutter_app/constants.dart';

import '../config.dart';

class NewFeedActivity extends StatefulWidget {
  @override
  _NewFeedActivityState createState() => _NewFeedActivityState();
}

class _NewFeedActivityState extends State<NewFeedActivity> {
  List<Post> feedData = [];

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
        automaticallyImplyLeading: false,
        brightness: Brightness.dark,
        title: Text(
          Config.appName,
          style: TextStyle(
              fontFamily: 'Billabong',
              fontSize: 32,
              fontStyle: FontStyle.italic),
        ),
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: <Color>[appPrimaryColor, appPrimaryColor],
            ),
          ),
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.add_circle_rounded),
            onPressed: () {
              Navigator.push(context,
                  MaterialPageRoute(builder: (context) => UploadActivity()));
            },
          ),
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: () {
              SharedService.logout(context);
            },
          )
        ],

      ),
      body: RefreshIndicator(
        child: ListView(children: feedData,),
        onRefresh: _refresh,
      ),
    );
  }
  Future<void> _refresh() async {
    fetchData();
    return;
  }
  Future<void> fetchData() async {
    var listPosts = await APIService.getNewFeed();
    List<Post> tempData = [];
    for (var i in listPosts.data.posts) {
      tempData.add(Post(
        id: i.id,
        location: "Quang Binh",
        content: i.content,
        images: i.images,
        avatar: i.author.avatar,
        displayName: i.author.displayName,
        numOfReaction: i.numOfReaction,
        numOfComment: i.numOfComment,
      ));
    }
    setState(() {
      feedData = tempData;
    });
  }
}
