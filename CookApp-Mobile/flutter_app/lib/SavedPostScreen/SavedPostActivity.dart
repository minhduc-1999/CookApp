import 'dart:async';

import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:tastify/FoodScreen/FoodWidget.dart';
import 'package:tastify/Model/NewFeedRespondModel.dart';
import 'package:tastify/NewFeedScreen/Post.dart';

import 'package:tastify/NewFeedScreen/PostDetail.dart';
import 'package:tastify/ProfileScreen/ProfileActivity.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:tastify/config.dart';
import 'package:tastify/constants.dart';

class SavedPostActivity extends StatefulWidget {
  @override
  _SavedPostActivityState createState() => _SavedPostActivityState();
}

class _SavedPostActivityState extends State<SavedPostActivity>
    with TickerProviderStateMixin {
  NewFeedRespondModel savedPosts;
  bool circular = true;
  TabController _tabController;
  int indexTab = 0;
  List<FoodWidget> shouldFoodData = [];
  List<FoodWidget> shouldNotFoodData = [];
  List<Post> postData = [];
  Widget buildTabbar(Size size) {
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
            height: size.height * 0.08,
            icon: Icon(
              Icons.grid_on,
              color: indexTab == 0 ? appPrimaryColor : Colors.black26,
            ),
            text: "Posts",
            iconMargin: EdgeInsets.only(bottom: 3),
          ),
          Tab(
            height: size.height * 0.08,
            icon: Icon(
              FontAwesomeIcons.circleCheck,
              color: indexTab == 1 ? Colors.green : Colors.black26,
            ),
            text: "Foods",
            iconMargin: EdgeInsets.only(bottom: 3),
          ),
          Tab(
            height: size.height * 0.08,
            icon: Icon(
              FontAwesomeIcons.circleXmark,
              color: indexTab == 2 ? appPrimaryColor : Colors.black26,
            ),
            text: "Foods",
            iconMargin: EdgeInsets.only(bottom: 3),
          ),
        ]));
  }

  Widget buildSaved() {
    return indexTab == 0
        ? postData.length == 0
            ? Center(
                child: Padding(
                  padding: const EdgeInsets.only(top: 20),
                  child: Text(
                    "Nothing to show!",
                    style: TextStyle(fontSize: 16),
                  ),
                ),
              )
            : /*Container(
                margin: EdgeInsets.only(top: 1),
                child: GridView.count(
                    crossAxisCount: 3,
                    childAspectRatio: 1.0,
                    padding: const EdgeInsets.all(0.5),
                    mainAxisSpacing: 1.5,
                    crossAxisSpacing: 1.5,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    children:
                        List.generate(savedPosts.data.posts.length, (index) {
                      return ImageTile(
                          savedPosts.data.posts[index]., reloadSavedPost);
                    })),
              )*/
            ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemBuilder: (context, i) {
                  return postData[i];
                },
                itemCount: postData.length,
              )
        : indexTab == 1
            ? shouldFoodData.length == 0
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
                    child: ListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemBuilder: (context, i) {
                        return shouldFoodData[i];
                      },
                      itemCount: shouldFoodData.length,
                    ),
                  )
            : indexTab == 2
                ? shouldNotFoodData.length == 0
                    ? Center(
                        child: Padding(
                          padding: const EdgeInsets.only(top: 20),
                          child: Text(
                            "Nothing to show!",
                            style: TextStyle(fontSize: 16),
                          ),
                        ),
                      )
                    : ListView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemBuilder: (context, i) {
                          return shouldNotFoodData[i];
                        },
                        itemCount: shouldNotFoodData.length,
                      )
                : Container();
  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    _tabController = TabController(initialIndex: 0, length: 3, vsync: this);
    fetchData();
  }

  @override
  void dispose() {
    // TODO: implement dispose
    _tabController.dispose();
    super.dispose();
  }

  FutureOr reloadSavedPost(dynamic value) {
    fetchData();
  }

  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;
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
          : SingleChildScrollView(
              child: Column(
                children: [
                  buildTabbar(size),
                  buildSaved(),
                ],
              ),
            ),
    );
  }

  void fetchData() async {
    var dataPosts = await APIService.getSavedPosts();
    var dataShouldFood = await APIService.getSaveFood(0, Config.shouldFoodType);
    var dataShouldNotFood =
        await APIService.getSaveFood(0, Config.shouldnotFoodType);

    List<Post> tempPostData = [];
    for (var data in dataPosts.data.posts) {
      var i = data.post;
      tempPostData.add(
        Post(
          id: i.id,
          userId: i.author.id,
          location: i.location,
          content: i.content,
          kind: i.kind,
          medias: i.medias != null ? i.medias : [],
          avatar: i.author.avatar.url,
          displayName: i.author.displayName,
          numOfReaction: i.numOfReaction,
          numOfComment: i.numOfComment,
          dateTime: DateTime.fromMillisecondsSinceEpoch(i.createdAt),
          isLike: i.reaction != null,
          saved: true,
          foodRefId: i.ref != null ? i.ref.id : "",
          totalTime: i.ref != null ? i.ref.totalTime : 0,
          servings: i.ref != null ? i.ref.servings : 0,
          foodName: i.ref != null ? i.ref.name : "",
          foodDescription: i.ref != null ? i.ref.description : "",
          foodImage: i.ref != null ? i.ref.photos[0].url : "",
          tags: i.tags,
          should: i.recomendation != null ? i.recomendation.should : null,
          shouldNot: i.recomendation != null ? i.recomendation.shouldNot : null,
          isNutritionist: true //i.author.isNutritionist,
        ),
      );
    }

    List<FoodWidget> tempShouldFoodData = [];
    for (var i in dataShouldFood.data.foods) {
      tempShouldFoodData.add(FoodWidget(
        food: i,
      ));
    }


    List<FoodWidget> tempShouldNotFoodData = [];
    for (var i in dataShouldNotFood.data.foods) {
      tempShouldNotFoodData.add(FoodWidget(
        food: i,
      ));
    }
    setState(() {
      postData = tempPostData;
      shouldFoodData = tempShouldFoodData;
      shouldNotFoodData = tempShouldNotFoodData;
      circular = false;
    });
    print(shouldFoodData.length);
    print(shouldNotFoodData.length);
  }
}

class ImageTile extends StatelessWidget {
  final Post post;
  final Function function;

  ImageTile(this.post, this.function);

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
