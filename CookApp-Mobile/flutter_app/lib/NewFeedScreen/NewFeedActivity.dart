import 'dart:async';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_app/Model/NewFeedRespondModel.dart';
import 'package:flutter_app/NewFeedScreen/SearchUserDelegate.dart';
import '../StaticComponent/Post.dart';
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
  ScrollController _scrollController = ScrollController();
  int offset = 0;
  bool circular = true;
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
          IconButton(onPressed: (){
            showSearch(context: context, delegate: SearchUserDelegate());
          }, icon: Icon(Icons.search)),
          IconButton(
            icon: Icon(Icons.add_circle_rounded),
            onPressed: () {
              openUploadActivity();
            },

          ),

        ],

      ),
      body: circular ? Center(child: CircularProgressIndicator(),)
          : RefreshIndicator(
        child: ListView.builder(
          controller: _scrollController,
          itemBuilder: (context, i) {
            if (i == feedData.length) {
              return CupertinoActivityIndicator();
            }
            return feedData[i];
          },
          itemCount: feedData.length + 1,
        ),
        onRefresh: _refresh,
      ),
    );
  }
  FutureOr onGoBack(dynamic value) {
    fetchData();
  }

  void openUploadActivity() {
    Route route = MaterialPageRoute(builder: (context) => UploadActivity());
    Navigator.push(context, route).then(onGoBack);
  }
  Future<void> _refresh() async {
    fetchData();
    return;
  }
  Future<void> fetchData() async {
    setState(() {
      circular = true;
      offset = 0;
    });
    var listPosts = await APIService.getNewFeed(offset);
    List<Post> tempData = [];
    for (var i in listPosts.data.posts) {
      tempData.add(Post(
        id: i.id,
        userId: i.author.id,
        location: "Quang Binh",
        content: i.content,
        images: i.images,
        avatar: i.author.avatar,
        displayName: i.author.displayName,
        numOfReaction: i.numOfReaction,
        numOfComment: i.numOfComment,
        dateTime: DateTime.fromMillisecondsSinceEpoch(i.createdAt),
      ));
    }
    setState(() {
      feedData = tempData;
      circular = false;
      offset++;
    });
  }

  void _getMoreData() async{
    var listPosts = await APIService.getNewFeed(offset);
    List<Post> tempData = [];
    for (var i in listPosts.data.posts) {
      tempData.add(Post(
        id: i.id,
        userId: i.author.id,
        location: "Quang Binh",
        content: i.content,
        images: i.images,
        avatar: i.author.avatar,
        displayName: i.author.displayName,
        numOfReaction: i.numOfReaction,
        numOfComment: i.numOfComment,
        dateTime: DateTime.fromMillisecondsSinceEpoch(i.createdAt),
      ));
    }
    setState(() {
      feedData.addAll(tempData);
      offset++;
    });
  }
}