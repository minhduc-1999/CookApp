import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:tastify/Model/InterestTopicRequestModel.dart';
import 'package:tastify/NewFeedScreen/Post.dart';
import 'package:tastify/ProfileScreen/EditProfileActivity.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:tastify/main.dart';

import '../constants.dart';
class FeedTopicActivity extends StatefulWidget {

  final String topicName;
  const FeedTopicActivity({Key key, this.topicName}) : super(key: key);

  @override
  _FeedTopicActivityState createState() => _FeedTopicActivityState();

}

class _FeedTopicActivityState extends State<FeedTopicActivity> {
  bool isFollow;
  bool circular = true;
  int offset = 0;
  int totalPage = 1000;
  List<Post> feedData = [];
  List<Topic> userTopic;
  ScrollController _scrollController = ScrollController();
  _FeedTopicActivityState();
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    fetchData();
    _scrollController.addListener(() {
      if (_scrollController.position.pixels ==
          _scrollController.position.maxScrollExtent) {
        getMoreData();
      }
    });
  }
  void fetchData() async {
    setState(() {
      circular = true;
      offset = 0;
    });
    var listPosts = await APIService.getNewFeed(offset: offset,tag: widget.topicName);
    var dataUserTopic = await APIService.getUsersTopics();
    List<Topic> tempUserTopic = [];
    bool tempIsFollow = false;
    for(var i in dataUserTopic.data.topics){
      tempUserTopic.add(Topic(id: i.id,title: i.title));
    }
    for(var i in tempUserTopic){
      if (widget.topicName == i.title){
        tempIsFollow = true;
      }
    }

    List<Post> tempData = [];
    for (var i in listPosts.data.posts) {
      tempData.add(
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
          saved: i.saved,
          foodRefId: i.ref != null ? i.ref.id : "",
          totalTime: i.ref != null ? i.ref.totalTime : 0,
          servings: i.ref != null ? i.ref.servings : 0,
          foodName: i.ref != null ? i.ref.name : "",
          foodDescription: i.ref != null ? i.ref.description : "",
          foodImage: i.ref != null ? i.ref.photos[0].url : "",
          tags: i.tags,
          should: i.recomendation != null ? i.recomendation.should : null,
          shouldNot: i.recomendation != null ? i.recomendation.shouldNot : null,
          isNutritionist: i.author.isNutritionist,
        ),
      );
    }
    setState(() {
      if (listPosts.data.posts.length > 0) {
        totalPage = listPosts.data.metadata.totalPage;
      }

      feedData = tempData;
      userTopic = tempUserTopic;
      isFollow = tempIsFollow;
      circular = false;
      offset++;
    });
  }
  void getMoreData() async {
    var listPosts = await APIService.getNewFeed(offset: offset,tag: widget.topicName);
    List<Post> tempData = [];
    for (var i in listPosts.data.posts) {
      tempData.add(
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
          saved: i.saved,
          foodRefId: i.ref != null ? i.ref.id : "",
          totalTime: i.ref != null ? i.ref.totalTime : 0,
          servings: i.ref != null ? i.ref.servings : 0,
          foodName: i.ref != null ? i.ref.name : "",
          foodDescription: i.ref != null ? i.ref.description : "",
          foodImage: i.ref != null ? i.ref.photos[0].url : "",
          tags: i.tags,
          should: i.recomendation != null ? i.recomendation.should : null,
          shouldNot: i.recomendation != null ? i.recomendation.shouldNot : null,
          isNutritionist: i.author.isNutritionist,
        ),
      );
    }
    setState(() {
      feedData.addAll(tempData);
      offset++;
    });
  }
  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: appPrimaryColor),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        title: Text(
          "Topic",
          style: TextStyle(color: Colors.black),
        ),

      ),
      body: SingleChildScrollView(
        controller: _scrollController,
        child: Column(

          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.only(left: 15.0, right: 15.0,top: 10),
              child: Text(widget.topicName, style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.black),),
            ),
            isFollow != null ? GestureDetector(
              onTap: () async{
                //List<String> selectedTopic = [];

                if (isFollow){
                  unfollowTopic(widget.topicName);
                } else {
                  followTopic(widget.topicName);
                }

              },
              child: Container(
                margin: EdgeInsets.all(15.0),
                decoration: BoxDecoration(
                    color: isFollow ? Colors.white : Colors.blue,
                    border: Border.all(color: isFollow ? Colors.grey : Colors.blue),
                    borderRadius: BorderRadius.circular(20.0)),
                alignment: Alignment.center,
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Text( isFollow ? "Unfollow Topic" : "Follow Topic", style: TextStyle(color: isFollow ? Colors.black : Colors.white, fontWeight: FontWeight.bold),),
                ),
              ),
            ) : Container(),
            circular ? Padding(
                padding: EdgeInsets.only(top: size.height*0.3),
                child: Center(child: CircularProgressIndicator())) :
            feedData.length == 0
                ? Center(
              child: Text(
                "Nothing to show!",
                style: TextStyle(fontSize: 16),
              ),
            )
                : ListView.builder(
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
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

          ],
        ),
      ),
    );
  }

  void unfollowTopic(String topicName) async{
    List<Topic> selectedTopic = userTopic;
    selectedTopic.removeWhere((element) => element.title == topicName);
    List<String> selectedTopicId = [];
    for (var i in selectedTopic){
      selectedTopicId.add(i.id);
    };
    await APIService.chooseTopic(InterestTopicRequestModel(topicIds: selectedTopicId));
    setState(() {
      isFollow = false;
    });
  }

  void followTopic(String topicName) async{
    List<Topic> selectedTopic = userTopic;
    List<String> selectedTopicId = [];
    for (var i in selectedTopic){
      selectedTopicId.add(i.id);
    };
    for (var i in tagsInit){
      if (i.title == topicName){
        selectedTopicId.add(i.id);
      }
    }
    await APIService.chooseTopic(InterestTopicRequestModel(topicIds: selectedTopicId));
    setState(() {
      isFollow = true;
    });
  }
}
