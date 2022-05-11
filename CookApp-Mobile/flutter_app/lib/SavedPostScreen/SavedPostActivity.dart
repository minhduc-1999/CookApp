import 'dart:async';

import 'package:flutter/material.dart';
import 'package:tastify/Model/SavedPostRespondModel.dart';
import 'package:tastify/NewFeedScreen/PostDetail.dart';
import 'package:tastify/ProfileScreen/ProfileActivity.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:tastify/constants.dart';

class SavedPostActivity extends StatefulWidget {
  @override
  _SavedPostActivityState createState() => _SavedPostActivityState();
}

class _SavedPostActivityState extends State<SavedPostActivity> {
  SavedPostRespondModel savedPosts;
  bool circular = true;

  Widget buildSavedPosts() {
    return savedPosts.data.posts.length == 0
        ? Center(
            child: Padding(
              padding: const EdgeInsets.only(top: 20),
              child: Text(
                "Nothing to show!",
                style: TextStyle(fontSize: 16),
              ),
            ),
          )
        : Container(
            margin: EdgeInsets.only(top: 1),
            child: GridView.count(
                crossAxisCount: 3,
                childAspectRatio: 1.0,
                padding: const EdgeInsets.all(0.5),
                mainAxisSpacing: 1.5,
                crossAxisSpacing: 1.5,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                children: List.generate(savedPosts.data.posts.length, (index) {
                  return ImageTile(savedPosts.data.posts[index].post,reloadSavedPost);
                })),
          );
  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    fetchData();
  }
  FutureOr reloadSavedPost(dynamic value){
    fetchData();
  }
  @override
  Widget build(BuildContext context) {
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
          child: Text(
            "Saved",
          ),
        ),
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        actions: [],
      ),
      body: circular
          ? Center(
              child: CircularProgressIndicator(),
            )
          : buildSavedPosts(),
    );
  }

  void fetchData() async {
    var data = await APIService.getSavedPosts();
    setState(() {
      savedPosts = data;
      circular = false;
    });
  }
}

class ImageTile extends StatelessWidget {
  final Post post;
  final Function function;
  ImageTile(this.post,this.function);

  clickedImage(BuildContext context) async {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => PostDetail(id: post.id)),
    ).then(function);
  }

  Widget build(BuildContext context) {
    return GestureDetector(
        onTap: () => clickedImage(context),
        child: Image.network(post.medias[0].url, fit: BoxFit.cover));
  }
}
