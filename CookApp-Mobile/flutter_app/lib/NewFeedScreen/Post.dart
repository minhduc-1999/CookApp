import 'dart:async';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flare_flutter/flare_actor.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:string_to_hex/string_to_hex.dart';
import 'package:tastify/CommentScreen/CommentActivity.dart';
import 'package:tastify/EditPostScreen/EditPostActivity.dart';
import 'package:tastify/EditPostScreen/EditRecommendedPostActivity.dart';
import 'package:tastify/FoodScreen/FoodInstructionWidget.dart';
import 'package:tastify/Model/NewFeedRespondModel.dart';
import 'package:tastify/Model/PostDetailRespondModel.dart';
import 'package:tastify/Model/ReactRequestModel.dart';
import 'package:tastify/Model/UserRespondModel.dart';
import 'package:tastify/NewFeedScreen/FeedTopicActivity.dart';
import '../MultiImagesDetailScreen/MultiImagesDetailActivity.dart';
import 'package:tastify/ProfileScreen/ProfileActivity.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:tastify/config.dart';
import 'package:tastify/constants.dart';
import 'package:tastify/main.dart';
import 'package:timeago/timeago.dart' as timeago;

class Post extends StatefulWidget {
  const Post(
      {this.id,
      this.userId,
      this.location,
      this.content,
      this.medias,
      this.avatar,
      this.displayName,
      this.numOfReaction,
      this.numOfComment,
      this.dateTime,
      this.isLike,
      this.saved,
      this.foodRefId,
      this.totalTime,
      this.foodImage,
      this.servings,
      this.foodName,
      this.foodDescription,
      this.tags,
        this.isNutritionist,
      this.kind,
      this.should,
      this.shouldNot});

  final String id;
  final String userId;
  final String content;
  final String location;
  final String displayName;
  final String avatar;
  final String kind;
  final List<Medias> medias;
  final int numOfReaction;
  final int numOfComment;
  final DateTime dateTime;
  final bool isLike;
  final bool saved;
  final String foodRefId;
  final String foodImage;
  final String foodName;
  final String foodDescription;
  final int totalTime;
  final int servings;
  final bool isNutritionist;
  final List<String> tags;
  final Should should;
  final Should shouldNot;

  _Post createState() => _Post(
      id: this.id,
      userId: this.userId,
      location: this.location,
      content: this.content,
      medias: this.medias,
      displayName: this.displayName,
      avatar: this.avatar,
      numOfReaction: this.numOfReaction,
      numOfComment: this.numOfComment,
      dateTime: this.dateTime,
      liked: this.isLike,
      saved: this.saved,
      tags: this.tags);
}

class _Post extends State<Post> with TickerProviderStateMixin {
  final String id;
  final String userId;
  String content;
  final String location;
  List<Medias> medias;
  final String displayName;
  final String avatar;
  final DateTime dateTime;
  bool saved;
  int numOfReaction;
  int numOfComment;
  bool liked;
  bool showHeart = false;
  int _current = 0;
  List<String> tags;
  FToast fToast;
  TabController _tabController;
  int indexTab = 0;
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    fToast = FToast();
    fToast.init(context);
    _tabController = TabController(initialIndex: 0, length: 2, vsync: this);
  }

  @override
  void dispose() {
    // TODO: implement dispose
    _tabController.dispose();

    super.dispose();
  }

  final CarouselController _controller = CarouselController();
  TextStyle boldStyle = TextStyle(
    color: Colors.black,
    fontWeight: FontWeight.bold,
  );

  FutureOr _updateTotalCommentLike(dynamic value) async {
    var data = await APIService.getPostDetail(id);

    setState(() {
      numOfComment = data.data.numOfComment;
      numOfReaction = data.data.numOfReaction;
      liked = data.data.reaction != null;
    });
  }

  FutureOr _updatePost(dynamic value) async {
    var data = await APIService.getPostDetail(id);
    setState(() {
      medias = data.data.medias;
      content = data.data.content;
    });
  }

  _Post(
      {this.id,
      this.userId,
      this.location,
      this.content,
      this.medias,
      this.displayName,
      this.avatar,
      this.numOfReaction,
      this.numOfComment,
      this.dateTime,
      this.liked,
      this.saved,
      this.tags});
  _showToast(String content, Size size) {
    Widget toast = Container(
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(25.0),
        color: customYellowColor,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(
            width: size.width * 0.73,
            child: Text(content,
                textAlign: TextAlign.center,
                maxLines: 100,
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.white,
                )),
          ),
        ],
      ),
    );

    fToast.showToast(
      child: toast,
      gravity: ToastGravity.BOTTOM,
      toastDuration: Duration(seconds: 3),
    );
  }
  Widget _buildFoodRef() {
    final Size size = MediaQuery.of(context).size;
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
              builder: (context) => FoodInstructionWidget(
                    id: widget.foodRefId,
                    name: widget.foodName,
                  )),
        );
      },
      child: Container(
        margin: EdgeInsets.only(left: 8, right: 8, bottom: 8),
        decoration: BoxDecoration(border: Border.all(color: appPrimaryColor)),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              margin: EdgeInsets.all(8),
              decoration: BoxDecoration(shape: BoxShape.circle),
              child: Image.network(
                widget.foodImage,
                fit: BoxFit.cover,
                width: size.width * 0.2,
                height: size.height * 0.1,
              ),
            ),
            Flexible(
              child: Container(
                margin: EdgeInsets.only(top: 8, right: 8),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.foodName,
                      style:
                          TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      widget.foodDescription,
                      style: TextStyle(color: Colors.grey, fontSize: 14),
                      softWrap: false,
                      maxLines: 3,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            )
          ],
        ),
      ),
    );
  }

  GestureDetector buildLikeIcon() {
    Color color;
    IconData icon;

    if (liked) {
      color = Colors.pink;
      icon = FontAwesomeIcons.solidHeart;
    } else {
      icon = FontAwesomeIcons.heart;
    }

    return GestureDetector(
        child: Icon(
          icon,
          size: 25.0,
          color: color,
        ),
        onTap: () {
          _likePost(id);
        });
  }

  GestureDetector buildLikeableImage() {
    final double height = MediaQuery.of(context).size.height;
    return GestureDetector(
      onDoubleTap: () => _likePost(id),
      child: Stack(
        alignment: Alignment.center,
        children: [
          medias.length == 1
              ? Container(
                  margin: EdgeInsets.only(bottom: 10),
                  child: ClipRRect(
                    child: Image.network(medias[0].url,
                        fit: BoxFit.cover,
                        width: 1000.0,
                        height: height * 0.55),
                  ))
              : Column(
                  children: [
                    CarouselSlider(
                        items: medias
                            .map((item) => GestureDetector(
                                  onTap: () {
                                    Navigator.push(
                                        context,
                                        PageRouteBuilder(
                                            pageBuilder: (context, animation,
                                                    secondaryAnimation) =>
                                                MultiImagesDetailActivity(
                                                  numOfReaction:
                                                      this.numOfReaction,
                                                  numOfComment:
                                                      this.numOfComment,
                                                  postId: this.id,
                                                  isLiked: this.liked,
                                                  content: this.content,
                                                  location: this.location,
                                                  displayName: this.displayName,
                                                  avatar: this.avatar,
                                                  dateTime: this.dateTime,
                                                ),
                                            transitionsBuilder: (context,
                                                animation,
                                                secondaryAnimation,
                                                child) {
                                              const begin = Offset(0.0, 1.0);
                                              const end = Offset.zero;
                                              const curve = Curves.ease;

                                              var tween = Tween(
                                                      begin: begin, end: end)
                                                  .chain(
                                                      CurveTween(curve: curve));

                                              return SlideTransition(
                                                position:
                                                    animation.drive(tween),
                                                child: child,
                                              );
                                            })).then(_updateTotalCommentLike);
                                  },
                                  child: Container(
                                    margin: EdgeInsets.only(bottom: 10),
                                    child: ClipRRect(
                                        child: Stack(
                                      children: <Widget>[
                                        Image.network(item.url,
                                            fit: BoxFit.cover, width: 1000.0),
                                      ],
                                    )),
                                  ),
                                ))
                            .toList(),
                        carouselController: _controller,
                        options: CarouselOptions(
                            autoPlay: false,
                            onPageChanged: (index, reason) {
                              setState(() {
                                _current = index;
                              });
                            },
                            height: height * 0.55,
                            viewportFraction: 1.0,
                            enlargeCenterPage: false)),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: medias.asMap().entries.map((entry) {
                        return GestureDetector(
                          onTap: () => _controller.animateToPage(entry.key),
                          child: Container(
                            width: 9.0,
                            height: 9.0,
                            margin: EdgeInsets.symmetric(
                                vertical: 8.0, horizontal: 4.0),
                            decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: (Theme.of(context).brightness ==
                                            Brightness.dark
                                        ? Colors.white
                                        : Colors.black)
                                    .withOpacity(
                                        _current == entry.key ? 0.9 : 0.4)),
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ),
          showHeart
              ? Positioned(
                  child: Container(
                    width: 100,
                    height: 100,
                    child: Opacity(
                        opacity: 0.85,
                        child: FlareActor(
                          "assets/flare/Like.flr",
                          animation: "Like",
                        )),
                  ),
                )
              : Container()
        ],
      ),
    );
  }

  Widget buildPostHeader() {
    final Size size = MediaQuery.of(context).size;
    return Padding(
      padding: const EdgeInsets.only(left: 15, right: 0, top: 3, bottom: 3),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          (avatar != null)
              ? CircleAvatar(
                  radius: 17,
                  backgroundColor: Colors.grey,
                  backgroundImage: NetworkImage(avatar),
                )
              : CircleAvatar(
                  /*child: Image.asset("assets/images/default_avatar.png",
                                      width: size.width * 0.20,
                                      height: size.width * 0.20,
                                      fit: BoxFit.fill),*/
                  radius: 17,
                  backgroundColor: Colors.grey,
                  backgroundImage:
                      AssetImage('assets/images/default_avatar.png')),
          SizedBox(
            width: size.width * 0.04,
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              GestureDetector(
                child: Row(
                  children: [
                    displayName != null
                        ? Text(displayName, style: boldStyle)
                        : Text("user", style: boldStyle),
                    SizedBox(width: 3,),
                    widget.isNutritionist ? Icon(Icons.check_circle, color: Colors.blue, size: 15,) : Container()
                  ],
                ),
                onTap: () {
                  openProfile(context, userId);
                },
              ),
              SizedBox(
                height: 2,
              ),
              location != null
                  ? Text(
                      location,
                      style: TextStyle(fontSize: 12),
                    )
                  : Container()
            ],
          ),
          userId == currentUserId || saved != null
              ? Expanded(
                  child: Align(
                    alignment: Alignment.centerRight,
                    child: IconButton(
                        onPressed: () {
                          //_showModalBottomSheet(context);
                          return showModalBottomSheet(
                              context: context,
                              builder: (context) => buildMoreVert(size));
                        },
                        icon: Icon(Icons.more_vert)),
                  )
            /*Container(
                    alignment: Alignment.centerRight,
                    child: IconButton(
                      onPressed: () {
                        Navigator.push(
                            context,
                            PageRouteBuilder(
                                pageBuilder:
                                    (context, animation, secondaryAnimation) =>
                                        widget.kind == Config.postMomentType ? EditPostActivity(
                                          id: this.id,
                                          medias: this.medias,
                                          content: this.content,
                                          avatar: this.avatar,
                                          displayName: this.displayName,
                                          location: this.location,
                                          foodRefId: "",
                                        ) :  widget.kind == Config.postRecommendType? EditRecommendedPostActivity(
                                          tags: tags,
                                          should: widget.should,
                                          shouldNot: widget.shouldNot,
                                          caption: widget.content,
                                          id: this.id,
                                        ) : EditPostActivity(
                                          id: this.id,
                                          medias: this.medias,
                                          content: this.content,
                                          avatar: this.avatar,
                                          displayName: this.displayName,
                                          location: this.location,
                                          foodImage: widget.foodImage,
                                          foodRefId: widget.foodRefId,
                                          foodDescription: widget.foodDescription,
                                          foodName: widget.foodName,
                                        ),
                                transitionsBuilder: (context, animation,
                                    secondaryAnimation, child) {
                                  const begin = Offset(0.0, 1.0);
                                  const end = Offset.zero;
                                  const curve = Curves.ease;

                                  var tween = Tween(begin: begin, end: end)
                                      .chain(CurveTween(curve: curve));

                                  return FadeTransition(
                                    opacity: animation,
                                    child: child,
                                  );
                                })).then(_updatePost);
                      },
                      icon: Icon(Icons.edit_outlined),
                      color: Colors.black.withOpacity(0.7),
                    ),
                  ),*/
                )
              : Container()
        ],
      ),
    );
  }
  Widget buildMoreVert(Size size){
    return Container(
      color: Color(0xFF737373),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(29),
            topRight: const Radius.circular(29),
          ),
        ),

        child: Column(

          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            Icon(Icons.remove, color: Colors.grey),
            Text(
              "Options",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
            ),
            Divider(),
            userId == currentUserId ? ListTile(
              leading: Icon(
                Icons.edit_outlined,
                color: Colors.black,
              ),
              title: Text(
                "Edit Post",
                style: TextStyle(fontSize: 16),
              ),
              onTap: () {
                Navigator.of(context).pop();
                Timer(const Duration(milliseconds: 300), () {
                  Navigator.push(
                      context,
                      PageRouteBuilder(
                          pageBuilder:
                              (context, animation, secondaryAnimation) =>
                          widget.kind == Config.postMomentType ? EditPostActivity(
                            id: this.id,
                            medias: this.medias,
                            content: this.content,
                            avatar: this.avatar,
                            displayName: this.displayName,
                            location: this.location,
                            foodRefId: "",
                          ) :  widget.kind == Config.postRecommendType? EditRecommendedPostActivity(
                            tags: tags,
                            should: widget.should,
                            shouldNot: widget.shouldNot,
                            caption: widget.content,
                            id: this.id,
                          ) : EditPostActivity(
                            id: this.id,
                            medias: this.medias,
                            content: this.content,
                            avatar: this.avatar,
                            displayName: this.displayName,
                            location: this.location,
                            foodImage: widget.foodImage,
                            foodRefId: widget.foodRefId,
                            foodDescription: widget.foodDescription,
                            foodName: widget.foodName,
                          ),
                          transitionsBuilder: (context, animation,
                              secondaryAnimation, child) {
                            const begin = Offset(0.0, 1.0);
                            const end = Offset.zero;
                            const curve = Curves.ease;

                            var tween = Tween(begin: begin, end: end)
                                .chain(CurveTween(curve: curve));

                            return SlideTransition(
                              position: animation.drive(tween),
                              child: child,
                            );
                          })).then(_updatePost);
                });

              },
            ) : Container(),
            userId == currentUserId ? Divider() : Container(),
            saved != null ? ListTile(
              leading: Icon(
                FontAwesomeIcons.solidFloppyDisk,
                color: Colors.black,
              ),
              title: Text(
                saved ? "Unsave Post" : "Save Post",
                style: TextStyle(fontSize: 16),
              ),
              onTap: () async {
                Navigator.of(context).pop();
                savePost(size);
              },
            ) : Container(),
            saved != null ? Divider() : Container(),
            SizedBox(height: 20,)
          ],
        ),
      ),
    );
  }
  Container loadingPlaceHolder = Container(
    height: 400.0,
    child: Center(child: CircularProgressIndicator()),
  );

  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;

    return widget.kind == Config.postRecommendType
        ? Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              buildPostHeader(),
              Padding(
                padding: const EdgeInsets.only(left: 15, right: 15),
                child: SizedBox(
                  height: 30,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    shrinkWrap: true,
                    itemCount: tags.length,
                    separatorBuilder: (context, index) {
                      return SizedBox(
                        width: 5,
                      );
                    },
                    itemBuilder: (context, index) {
                      return GestureDetector(
                        onTap: (){
                          Navigator.push(
                              context,
                              PageRouteBuilder(
                                  pageBuilder:
                                      (context, animation, secondaryAnimation) =>
                                   FeedTopicActivity(
                                        topicName: tags[index],
                                   ),
                                  transitionsBuilder: (context, animation,
                                      secondaryAnimation, child) {
                                    const begin = Offset(0.0, 1.0);
                                    const end = Offset.zero;
                                    const curve = Curves.ease;

                                    var tween = Tween(begin: begin, end: end)
                                        .chain(CurveTween(curve: curve));

                                    return SlideTransition(
                                      position: animation.drive(tween),
                                      child: child,
                                    );
                                  }));
                        },
                        child: Container(
                          child: Padding(
                            padding: const EdgeInsets.only(
                                left: 8, top: 8, bottom: 8, right: 8),
                            child: Text(
                              tags[index],
                              style: TextStyle(color: Colors.white, fontSize: 12),
                            ),
                          ),
                          decoration: BoxDecoration(
                              color: tags[index] != "Gymer"
                                  ? Color(StringToHex.toColor(tags[index]))
                                  : Color(defaultTagsColor),
                              borderRadius: BorderRadius.circular(10)),
                        ),
                      );
                    },
                  ),
                ),
              ),
              Padding(
                  padding: const EdgeInsets.only(left: 15, right: 15, top: 10),
                  child: Text(
                    content,
                    style: TextStyle(color: Colors.black),
                    maxLines: 1000,
                  )),
              
              Container(
                  child: TabBar(
                    onTap: (index){
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
                  text:"Should",
                  icon: Icon(
                    FontAwesomeIcons.circleCheck,
                    color: indexTab == 0 ? Colors.green : Colors.black26,
                  ),
                ),
                Tab(
                  text:"Should not",
                  icon: Icon(
                    FontAwesomeIcons.circleXmark,
                    color: indexTab == 1 ? Colors.red : Colors.black26,
                  ),
                )
              ]
                  )),
              IntrinsicHeight(
                child: indexTab == 0 ?  Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Flexible(
                      child: Padding(
                        padding: const EdgeInsets.all(15.0),
                        child: Text(widget.should.advice, maxLines: 10,),
                      ),
                    ),
                    SizedBox(
                      height: size.height*0.4,
                      child: ListView.separated(
                        padding: EdgeInsets.only(left: 15,right: 15),
                        scrollDirection: Axis.horizontal,
                        shrinkWrap: true,
                        itemCount: widget.should.foods.length,
                        itemBuilder: (context, index) {

                          return GestureDetector(
                            onTap: (){
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (context) => FoodInstructionWidget(
                                      id:  widget.should.foods[index].id,
                                      name: widget.should.foods[index].name,
                                    )),
                              );
                            },
                            child: Container(
                              height: size.height*0.35,
                              width: size.width * 0.8,
                              decoration: BoxDecoration(
                                  borderRadius: BorderRadius.all(Radius.circular(5.0)),
                                  image: DecorationImage(
                                    image: NetworkImage(
                                      widget.should.foods[index].photos[0].url,

                                    ),
                                    fit: BoxFit.cover,
                                  )
                              ),
                              child: Align(
                                alignment: Alignment.bottomLeft,
                                child: Padding(
                                  padding: const EdgeInsets.only(bottom: 20, left: 10, right: 10),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.end,
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        widget.should.foods[index].name,
                                        maxLines: 2,
                                        style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                                      ),
                                      Text(
                                        widget.should.foods[index].totalTime.toString() + " minutes",
                                        style: TextStyle(color: Colors.white),

                                      )
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          );




                        },
                        separatorBuilder: (context, index) {
                          return SizedBox(width: 15,);
                        },
                      ),
                    )
                  ],
                ) :   Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(15.0),
                      child: Text(widget.shouldNot.advice, maxLines: 10,),
                    ),
                    SizedBox(
                      height: size.height*0.4,
                      child: ListView.separated(
                        padding: EdgeInsets.only(left: 15,right: 15),
                        scrollDirection: Axis.horizontal,
                        shrinkWrap: true,
                        itemCount: widget.shouldNot.foods.length,
                        itemBuilder: (context, index) {

                          return GestureDetector(
                            onTap: (){
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (context) => FoodInstructionWidget(
                                      id:  widget.shouldNot.foods[index].id,
                                      name: widget.shouldNot.foods[index].name,
                                    )),
                              );
                            },
                            child: Container(
                              height: size.height*0.35,
                              width: size.width * 0.8,
                              decoration: BoxDecoration(
                                  borderRadius: BorderRadius.all(Radius.circular(5.0)),
                                  image: DecorationImage(
                                    image: NetworkImage(
                                      widget.shouldNot.foods[index].photos[0].url,

                                    ),
                                    fit: BoxFit.cover,
                                  )
                              ),
                              child: Align(
                                alignment: Alignment.bottomLeft,
                                child: Padding(
                                  padding: const EdgeInsets.only(bottom: 20, left: 10, right: 10),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.end,
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        widget.shouldNot.foods[index].name,
                                        maxLines: 2,
                                        style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                                      ),
                                      Text(
                                        widget.shouldNot.foods[index].totalTime.toString() + " minutes",
                                        style: TextStyle(color: Colors.white),

                                      )
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          );




                        },
                        separatorBuilder: (context, index) {
                          return SizedBox(width: 15,);
                        },
                      ),
                    )
                  ],
                ),
              ),

              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: <Widget>[
                  Padding(
                      padding: const EdgeInsets.only(left: 15.0, top: 40.0)),
                  buildLikeIcon(),

                  Expanded(
                      child: Container(
                        margin: EdgeInsets.only(right: 15),
                        alignment: Alignment.centerRight,
                        child: GestureDetector(
                          onTap: () {
                            return showModalBottomSheet(
                              context: context,
                              builder: (BuildContext context) {
                                return CommentActivity(
                                  targetId: id,
                                  targetType: Config.postCommentsType,
                                  stepName: " ",
                                );
                              },
                              isScrollControlled: true,
                              backgroundColor: Colors.transparent,
                            ).then(_updateTotalCommentLike);
                          },
                          child: Icon(
                            FontAwesomeIcons.comment,
                            size: 25.0,
                          ),
                        ),
                      ))
                ],
              ),
              Container(
                margin: EdgeInsets.only(left: 15, right: 15),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    numOfReaction > 1
                        ? Text(
                      "${numOfReaction} likes",
                    )
                        : numOfReaction == 0 || numOfReaction == 1
                        ? Text(
                      "${numOfReaction} like",
                    )
                        : Container(),
                    numOfComment > 1
                        ? Text(
                      "${numOfComment} comments",
                    )
                        : numOfComment == 0 || numOfComment == 1
                        ? Text(
                      "${numOfComment} comment",
                    )
                        : Container()
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(
                    left: 15, right: 15, top: 3, bottom: 3),
                child: Divider(
                  height: 2,
                  thickness: 0.4,
                ),
              ),
              SizedBox(
                height: 5,
              ),
              Row(children: <Widget>[
                Container(
                  margin: const EdgeInsets.only(left: 15.0),
                  child: Text(
                    timeago.format(dateTime),
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(fontSize: 13, color: Colors.grey),
                  ),
                )
              ])

            ],
          )
        : Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              buildPostHeader(),
              Padding(
                padding: const EdgeInsets.only(left: 15, right: 15),
                child: SizedBox(
                  height: 30,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    shrinkWrap: true,
                    itemCount: tags.length,
                    separatorBuilder: (context, index) {
                      return SizedBox(
                        width: 5,
                      );
                    },
                    itemBuilder: (context, index) {
                      return GestureDetector(
                        onTap: (){
                          Navigator.push(
                              context,
                              PageRouteBuilder(
                                  pageBuilder:
                                      (context, animation, secondaryAnimation) =>
                                      FeedTopicActivity(
                                        topicName: tags[index],
                                      ),
                                  transitionsBuilder: (context, animation,
                                      secondaryAnimation, child) {
                                    const begin = Offset(1.0, 0.0);
                                    const end = Offset.zero;
                                    const curve = Curves.ease;

                                    var tween = Tween(begin: begin, end: end)
                                        .chain(CurveTween(curve: curve));

                                    return SlideTransition(
                                      position: animation.drive(tween),
                                      child: child,
                                    );
                                  }));
                        },
                        child: Container(
                          child: Padding(
                            padding: const EdgeInsets.only(
                                left: 8, top: 8, bottom: 8, right: 8),
                            child: Text(
                              tags[index],
                              style: TextStyle(color: Colors.white, fontSize: 12),
                            ),
                          ),
                          decoration: BoxDecoration(
                              color: tags[index] != "Gymer"
                                  ? Color(StringToHex.toColor(tags[index]))
                                  : Color(defaultTagsColor),
                              borderRadius: BorderRadius.circular(10)),
                        ),
                      );
                    },
                  ),
                ),
              ),
              SizedBox(
                height: 8,
              ),
              widget.foodRefId != "" ? _buildFoodRef() : Container(),
              buildLikeableImage(),
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: <Widget>[
                  Padding(
                      padding: const EdgeInsets.only(left: 15.0, top: 40.0)),
                  buildLikeIcon(),


                  Expanded(
                      child: Container(
                    margin: EdgeInsets.only(right: 15),
                    alignment: Alignment.centerRight,
                    child: GestureDetector(
                      onTap: () {
                        return showModalBottomSheet(
                          context: context,
                          builder: (BuildContext context) {
                            return CommentActivity(
                              targetId: id,
                              targetType: Config.postCommentsType,
                              stepName: " ",
                            );
                          },
                          isScrollControlled: true,
                          backgroundColor: Colors.transparent,
                        ).then(_updateTotalCommentLike);
                      },
                      child: Icon(
                        FontAwesomeIcons.comment,
                        size: 25.0,
                      ),
                    ),
                  ))
                ],
              ),
              Container(
                margin: EdgeInsets.only(left: 15, right: 15),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    numOfReaction > 1
                        ? Text(
                            "${numOfReaction} likes",
                          )
                        : numOfReaction == 0 || numOfReaction == 1
                            ? Text(
                                "${numOfReaction} like",
                              )
                            : Container(),
                    numOfComment > 1
                        ? Text(
                            "${numOfComment} comments",
                          )
                        : numOfComment == 0 || numOfComment == 1
                            ? Text(
                                "${numOfComment} comment",
                              )
                            : Container()
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(
                    left: 15, right: 15, top: 3, bottom: 3),
                child: Divider(
                  height: 2,
                  thickness: 0.4,
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(left: 15, right: 15),
                child: RichText(
                    textAlign: TextAlign.left,
                    text: TextSpan(children: [
                      TextSpan(text: displayName + "  ", style: boldStyle),
                      TextSpan(
                          text: content, style: TextStyle(color: Colors.black))
                    ])),
              ),
              SizedBox(
                height: 5,
              ),
              Row(children: <Widget>[
                Container(
                  margin: const EdgeInsets.only(left: 15.0),
                  child: Text(
                    timeago.format(dateTime),
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(fontSize: 13, color: Colors.grey),
                  ),
                )
              ])
            ],
          );
  }

  void _likePost(String postId2) async {
    await APIService.react(ReactRequestModel(
        react: 'LOVE', targetId: id, targetType: Config.postReactType));
    if (liked) {
      setState(() {
        liked = false;
        numOfReaction--;
      });
    } else {
      setState(() {
        liked = true;
        showHeart = true;
        numOfReaction++;
      });
      Timer(const Duration(milliseconds: 2000), () {
        setState(() {
          showHeart = false;
        });
      });
    }

    print("l");
  }

  void openProfile(BuildContext context, String userId) {
    Navigator.push(
        context,
        MaterialPageRoute(
            builder: (context) => ProfileActivity(
                  userId: userId,
                )));
  }

  void savePost(Size size) async {
    if (saved) {
      var res = await APIService.deleteSavedPost(this.id);
      setState(() {
        saved = !saved;
      });
      _showToast(res.meta.messages[0], size);
    } else {
      var res = await APIService.savePost(this.id);
      setState(() {
        saved = !saved;
      });
      _showToast(res.meta.messages[0], size);
    }

  }
}
