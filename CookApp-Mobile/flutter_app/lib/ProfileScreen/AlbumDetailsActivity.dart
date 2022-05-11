import 'dart:async';
import 'dart:io';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:image_picker/image_picker.dart';
import 'package:tastify/CommentScreen/CommentActivity.dart';
import 'package:tastify/Model/AlbumDetailsRespondModel.dart';
import 'package:tastify/Model/ReactRequestModel.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:tastify/constants.dart';
import 'package:tastify/main.dart';
import 'package:timeago/timeago.dart' as timeago;

import '../config.dart';

class AlbumDetailsActivity extends StatefulWidget {
  const AlbumDetailsActivity({Key key, this.albumId, this.name, this.userId})
      : super(key: key);

  @override
  _AlbumDetailsActivityState createState() => _AlbumDetailsActivityState();
  final String albumId;
  final String name;
  final String userId;
}

class _AlbumDetailsActivityState extends State<AlbumDetailsActivity> {
  AlbumDetailsRespondModel model;
  bool circular = true;
  int numOfComment;
  int numOfReaction;
  List<File> files = [];
  ImagePicker imagePicker = ImagePicker();
  bool isLiked;
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    fetchData();
  }

  void fetchData() async {
    AlbumDetailsRespondModel data = await APIService.getAlbumDetails(
        widget.albumId);
    setState(() {
      model = data;
      numOfReaction = data.data.numOfReaction;
      numOfComment = data.data.numOfComment;
      isLiked = data.data.reaction != null;
      circular = false;
    });
  }

  Widget buildLikeIcon() {
    Color color;
    IconData icon;

    if (isLiked) {
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
        onTap: () => _likeAlbum(widget.albumId));
  }

  FutureOr _updateTotalComment(dynamic value) async {
    var data = await APIService.getAlbumDetails(widget.albumId);
    if (data.data.numOfComment != numOfComment) {
      setState(() {
        numOfComment = data.data.numOfComment;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          backgroundColor: appPrimaryColor,
          leading: IconButton(
            icon: Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () {
              Navigator.of(context).pop();
            },
          ),
          title: Text(
            widget.name,
            style: const TextStyle(color: Colors.white),
          ),
          actions: <Widget>[
          ])
      ,
      body: circular ? Center(child: CircularProgressIndicator()) :
      SingleChildScrollView(
        child: Container(
          margin: EdgeInsets.only(top: 15, bottom: 15),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Text(
                    "Updated " + timeago.format(
                        DateTime.fromMillisecondsSinceEpoch(
                            model.data.updatedAt))
                ),
              ),
              Container(
                margin: EdgeInsets.only(left: 15, right: 15, top: 15),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    numOfReaction > 1
                        ? Text(
                      "${numOfReaction} likes",
                    )
                        : numOfReaction == 1 ||
                        numOfReaction == 0
                        ? Text(
                      "${numOfReaction} like",
                    )
                        : Container(),
                    numOfComment > 1
                        ? Text(
                      "${numOfComment} comments",
                    )
                        : numOfComment == 1 ||
                        numOfComment == 0
                        ? Text(
                      "${numOfComment} comment",
                    )
                        : Container()
                  ],
                ),
              ),
              Padding(
                padding:
                const EdgeInsets.only(
                    left: 15.0, right: 15.0, bottom: 3, top: 3),
                child: Divider(
                  height: 2,
                  thickness: 0.4,
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(left: 15, bottom: 15),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: <Widget>[
                    buildLikeIcon(),
                    Padding(padding: const EdgeInsets.only(right: 20.0)),
                    GestureDetector(
                        child: const Icon(
                          FontAwesomeIcons.comment,
                          size: 25.0,
                        ),
                        onTap: () {
                          return showModalBottomSheet(
                            context: context,
                            builder: (BuildContext context) {
                              return CommentActivity(
                                targetId: widget.albumId,
                                targetType: Config.albumReactType,
                                stepName: " ",
                              );
                            },
                            isScrollControlled: true,
                            backgroundColor: Colors.transparent,
                          ).then(_updateTotalComment);
                        }),
                  ],
                ),
              ),
              /*widget.userId == currentUserId ?
              GestureDetector(
                child: Row(

                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    IconButton(
                      onPressed: () async {
                        List<XFile> imageFiles = await imagePicker.pickMultiImage();
                        if (imageFiles.isNotEmpty) {
                          List<File> temp = [];
                          for (var image in imageFiles) {
                            temp.add(File(image.path));
                          }
                          setState(() {
                            files.addAll(temp);
                          });
                        }
                      },
                      icon: Icon(Icons.add_to_photos),
                      color: appPrimaryColor,
                      iconSize: 32,
                    ),
                    Text(
                      "Add Photos",
                      style: TextStyle(
                          fontSize: 16,
                          color: appPrimaryColor,
                          fontWeight: FontWeight.bold),
                    )
                  ],
                ),
                onTap: () async {
                  List<XFile> imageFiles = await imagePicker.pickMultiImage();
                  if (imageFiles.isNotEmpty) {
                    List<File> temp = [];
                    for (var image in imageFiles) {
                      temp.add(File(image.path));
                    }
                    setState(() {
                      files.addAll(temp);
                    });
                  }
                },
              ) : Container(),*/
              SizedBox(
                height: 5,
              ),
              model.data.medias.length > 0
                  ? GridView.builder(
                  itemCount: model.data.medias.length,
                  shrinkWrap: true,
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 3,
                      crossAxisSpacing: 2,
                      mainAxisSpacing: 2),
                  itemBuilder: (BuildContext context, int index) {
                    return _photoTitle(model.data.medias[index].url,index);
                  })
                  : Container(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _photoTitle(String url, int index,) {
    return GestureDetector(
      onTap: (){
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => AlbumMediasView(medias: model.data.medias, initIndex: index,)),
        );
      },
      child: Container(
          height: 1000,
          width: 1000,
          child: CachedNetworkImage(
            imageUrl: url,
            imageBuilder: (context, imageProvider) => Container(
              decoration: BoxDecoration(
                image: DecorationImage(
                    image: imageProvider,
                    fit: BoxFit.cover,
                   ),
              ),
            ),
            placeholder: (context, url) => Center(child: CircularProgressIndicator()),
            errorWidget: (context, url, error) => Icon(Icons.error),
          ),
        ),
    );
  }

  void _likeAlbum(String albumId) async {
    await APIService.react(ReactRequestModel(
        react: 'LOVE',
        targetId: widget.albumId,
        targetType: Config.albumReactType));
      if (isLiked) {
      setState(() {
        isLiked = false;
        numOfReaction--;
      });
    } else {
      setState(() {
        isLiked = true;
        numOfReaction++;
      });
    }

  }


}

class AlbumMediasView extends StatefulWidget {
  final List<Medias> medias;
  final int initIndex;
  const AlbumMediasView({Key key, this.medias,this.initIndex}) : super(key: key);

  @override
  _AlbumMediasViewState createState() =>
      _AlbumMediasViewState(medias: this.medias);
}

class _AlbumMediasViewState extends State<AlbumMediasView> {
  List<Medias> medias;

  _AlbumMediasViewState({this.medias});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.black,
      body:
      Builder(
        builder: (context) {
          final double height = MediaQuery.of(context).size.height;
          return Container(
            margin: EdgeInsets.only(top: height*0.15),
            child: CarouselSlider(
              options: CarouselOptions(
                initialPage: widget.initIndex,
                height: height * 0.7,
                viewportFraction: 1.0,
                enlargeCenterPage: false,
                // autoPlay: false,
              ),
              items: medias
                  .map((item) => Container(
                child: Center(
                    child: Image.network(
                      item.url,
                      fit: BoxFit.cover,
                      height: height,
                    )),
              ))
                  .toList(),
            ),
          );
        },
      ),
    );
  }
}

