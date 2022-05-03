import 'dart:async';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_client_sse/flutter_client_sse.dart';
import 'package:tastify/EditPostScreen/EditPostActivity.dart';
import 'package:tastify/Model/NewFeedRespondModel.dart';
import 'package:tastify/NewFeedScreen/SearchUserDelegate.dart';
import '../main.dart';
import 'Post.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:tastify/Services/SharedService.dart';
import 'package:tastify/UploadScreen/UploadActivity.dart';
import 'package:tastify/constants.dart';

import '../config.dart';

class NewFeedActivity extends StatefulWidget {
  @override
  _NewFeedActivityState createState() => _NewFeedActivityState();
}

class _NewFeedActivityState extends State<NewFeedActivity> {
  List<Post> feedData = [];
  ScrollController _scrollController = ScrollController();
  int totalPage = 1000;
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
          IconButton(
              onPressed: () {
                showSearch(context: context, delegate: SearchUserDelegate());
              },
              icon: Icon(Icons.search)),
          IconButton(
            icon: Icon(Icons.add_circle_rounded),
            onPressed: () {
              openUploadActivity();
            },
          ),
        ],
      ),
      body: circular
          ? Center(
              child: CircularProgressIndicator(),
            )
          : feedData.length == 0
              ? Center(
                  child: Text("Nothing to show!",
                    style: TextStyle(fontSize: 16),
                  ),
                )
              : RefreshIndicator(
                  child: ListView.builder(
                    controller: _scrollController,
                    itemBuilder: (context, i) {
                      if (i == feedData.length) {
                        return offset < totalPage
                            ? CupertinoActivityIndicator()
                            : SizedBox(
                                height: 8,
                              );
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
  reloadFunction(){
    fetchData();
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
          location: i.location,
          content: i.content,
          medias: i.medias,
          avatar: i.author.avatar.url,
          displayName: i.author.displayName,
          numOfReaction: i.numOfReaction,
          numOfComment: i.numOfComment,
          dateTime: DateTime.fromMillisecondsSinceEpoch(i.createdAt),
          isLike: i.reaction != null,
      saved: i.saved,
        foodRefId: i.ref != null ? i.ref.id : "",
        totalTime: i.ref != null ? i.ref.totalTime : 0,
        servings: i.ref != null ? i.ref.servings : 0,
        foodName: i.ref != null ? i.ref.name : "",
        foodDescription: i.ref != null ? i.ref.description : "",
        foodImage: i.ref != null ? i.ref.photos[0].url : "",
     ),
          );
    }
    setState(() {
      if (listPosts.data.posts.length > 0) {
        totalPage = listPosts.data.metadata.totalPage;
      }

      feedData = tempData;
      circular = false;
      offset++;
    });
  }

  void _getMoreData() async {
    var listPosts = await APIService.getNewFeed(offset);
    List<Post> tempData = [];
    for (var i in listPosts.data.posts) {
      tempData.add(Post(
          id: i.id,
          userId: i.author.id,
          location: i.location,
          content: i.content,
          medias: i.medias,
          avatar: i.author.avatar.url,
          displayName: i.author.displayName,
          numOfReaction: i.numOfReaction,
          numOfComment: i.numOfComment,
          dateTime: DateTime.fromMillisecondsSinceEpoch(i.createdAt),
          isLike: i.reaction != null,
      saved: i.saved,
        foodRefId: i.ref != null ? i.ref.id : "",
        totalTime: i.ref != null ? i.ref.totalTime : 0,
        servings: i.ref != null ? i.ref.servings : 0,
        foodName: i.ref != null ? i.ref.name : "",
        foodDescription: i.ref != null ? i.ref.description : "",
        foodImage: i.ref != null ? i.ref.photos[0].url : "",
      ));
    }
    setState(() {
      feedData.addAll(tempData);
      offset++;
    });
  }

}
