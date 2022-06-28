import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:image_picker/image_picker.dart';
import 'package:tastify/Model/CommentRequestModel.dart';
import 'package:tastify/Model/CommentRespondModel.dart';
import 'package:tastify/Model/PostDetailRespondModel.dart';
import 'package:tastify/Model/PresignedLinkedRequestModel.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:tastify/config.dart';
import 'package:timeago/timeago.dart' as timeago;

import '../constants.dart';

class CommentActivity extends StatefulWidget {
  final String targetId;
  final String targetType;
  final String stepName;

  const CommentActivity({this.targetId, this.targetType, this.stepName});

  @override
  _CommentActivityState createState() =>
      _CommentActivityState(targetId, targetType, stepName);
}

class _CommentActivityState extends State<CommentActivity> {
  final String targetId;
  final String targetType;
  final String stepName;
  List<Comment> comments;
  bool didFetchComments = false;
  FocusNode focusNode = FocusNode();
  String labelText = "";
  String replyFor = "";
  ScrollController _scrollController = ScrollController();
  bool showSpaceWhenScroll = false;
  ImagePicker imagePicker = ImagePicker();
  File file;

  _CommentActivityState(this.targetId, this.targetType, this.stepName);

  final TextEditingController _commentController = TextEditingController();

  @override
  void initState() {
    super.initState();
    fetchData();
  }

  /* _scrollToEnd() async {
    if (_needsScroll) {
      _needsScroll = false;
      _scrollController.animateTo(_scrollController.position.maxScrollExtent,
          duration: Duration(milliseconds: 200), curve: Curves.easeInOut);
    }
  }*/
  @override
  Widget build(BuildContext context) {
    return buildPage();
  }

  updateLabelText(String text, String replyFor) {
    print('update label');
    setState(() {
      labelText = text;
      this.replyFor = replyFor;
    });
  }

  Widget buildPage() {
    final Size size = MediaQuery.of(context).size;
    return DraggableScrollableSheet(
        minChildSize: 0.5,
        maxChildSize: 0.9,
        initialChildSize: 0.9,
        builder: (_, controller) => Container(
              decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.vertical(
                    top: Radius.circular(15),
                  )),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                      padding: EdgeInsets.all(8),
                      child: Center(
                          child: Text(
                        targetType == Config.postCommentsType
                            ? "Comments"
                            : stepName,
                        style: TextStyle(fontSize: 22),
                      ))),
                  Divider(
                    height: 10.0,
                    color: Colors.grey.withOpacity(0.5),
                  ),
                  Expanded(
                    child: buildComment(),
                  ),
                  Padding(
                    padding: MediaQuery.of(context).viewInsets,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.start,
                            children: [
                              this.labelText != ""
                                  ? Padding(
                                      padding: const EdgeInsets.only(top: 8.0),
                                      child: Wrap(
                                        spacing: 10,
                                        children: [
                                          Text(
                                            labelText,
                                            style: TextStyle(
                                                fontWeight: FontWeight.bold,
                                                fontSize: 12),
                                          ),
                                          GestureDetector(
                                              onTap: () {
                                                setState(() {
                                                  labelText = "";
                                                  replyFor = "";
                                                });
                                              },
                                              child: Text(
                                                "Cancel",
                                                style: TextStyle(
                                                    fontWeight: FontWeight.bold,
                                                    fontSize: 12,
                                                    color: Colors.black
                                                        .withOpacity(0.6)),
                                              ))
                                        ],
                                      ),
                                    )
                                  : Container(),
                              Row(
                                children: <Widget>[
                                  // Button send image
                                  Material(
                                    child: Container(
                                      margin:
                                          EdgeInsets.symmetric(horizontal: 1.0),
                                      child: IconButton(
                                        icon: Icon(Icons.image),
                                        onPressed: () async {
                                          XFile temp =
                                              await imagePicker.pickImage(
                                                  source: ImageSource.gallery);
                                          setState(() {
                                            file = File(temp.path);
                                          });
                                        },
                                        color: appPrimaryColor,
                                      ),
                                    ),
                                    color: Colors.white,
                                  ),

                                  // Edit text
                                  Flexible(
                                    child: Container(
                                      child: TextFormField(
                                        focusNode: focusNode,
                                        style: TextStyle(fontSize: 15.0),
                                        controller: _commentController,
                                        decoration: InputDecoration.collapsed(
                                          hintText: 'Type your message...',
                                        ),
                                      ),
                                    ),
                                  ),

                                  // Button send message
                                  Material(
                                    child: Container(
                                      margin:
                                          EdgeInsets.symmetric(horizontal: 8.0),
                                      child: IconButton(
                                        icon: Icon(Icons.send),
                                        onPressed: () {
                                          setState(() {
                                            showSpaceWhenScroll = true;
                                          });

                                          addComment(_commentController.text,
                                              replyFor,context);
                                        },
                                        color: appPrimaryColor,
                                      ),
                                    ),
                                    color: Colors.white,
                                  ),
                                ],
                              ),
                            ],
                          ),
                          width: double.infinity,
                          height: labelText != "" ? 71.0 : 50.0,
                          decoration: BoxDecoration(
                              border: Border(
                                  top: BorderSide(
                                      color: appPrimaryColor, width: 0.5)),
                              color: Colors.white),
                        ),
                        file != null
                            ? Container(
                                margin: EdgeInsets.all(5.0),
                                width: size.width * 0.3,
                                height: size.width * 0.3,
                                child: ClipRRect(
                                    borderRadius:
                                        BorderRadius.all(Radius.circular(5.0)),
                                    child: Stack(
                                      children: <Widget>[
                                        Image.file(file,
                                            fit: BoxFit.cover, width: 1000.0),
                                        Positioned(
                                            top: 0,
                                            right: 0,
                                            child: GestureDetector(
                                              onTap: () {
                                                setState(() {
                                                  file = null;
                                                });
                                              },
                                              child: Container(
                                                height: 35,
                                                width: 35,
                                                child: Icon(
                                                  Icons.clear,
                                                  color: Colors.white
                                                      .withOpacity(0.8),
                                                ),
                                              ),
                                            )),
                                      ],
                                    )),
                              )
                            : Container()
                      ],
                    ),
                  ),
                ],
              ),
            ));
  }

  Widget buildComment() {
    if (this.didFetchComments == false) {
      return Container(
          alignment: FractionalOffset.center,
          child: CircularProgressIndicator());
    } else {
      return comments.length > 0
          ? ListView.builder(
              controller: _scrollController,
              shrinkWrap: true,
              itemCount: comments.length + 1,
              itemBuilder: (context, index) {
                if (index == comments.length) {
                  return Container(
                    height: showSpaceWhenScroll
                        ? labelText != ""
                            ? 15
                            : 75.0
                        : 0,
                  );
                }
                return comments[index];
              },
            )
          : Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    "No comments yet",
                    style: TextStyle(
                        fontSize: 16, color: Colors.black.withOpacity(0.5)),
                  ),
                  Text("Be the first to comment.",
                      style: TextStyle(
                          fontSize: 16, color: Colors.black.withOpacity(0.5)))
                ],
              ),
            );
    }
  }

  void fetchData() async {
    CommentRespondModel dataComment =
        await APIService.getComment(targetId, targetType, "");
    List<Comment> temp = [];
    //print("total comment: " + dataComment.data.comments.length.toString());
    for (var i in dataComment.data.comments) {
      temp.add(Comment(
        displayName: i.user.displayName,
        userId: i.user.id,
        avatar: i.user.avatar.url != null ? i.user.avatar.url : null,
        comment: i.content,
        dateTime: DateTime.fromMillisecondsSinceEpoch(i.createdAt),
        id: i.id,
        numberOfReply: i.numberOfReply,
        focusNode: this.focusNode,
        updateLabelText: this.updateLabelText,
        targetType: this.targetType,
        targetId: this.targetId,
        medias: i.medias,
      ));
    }
    setState(() {
      didFetchComments = true;
      showSpaceWhenScroll = false;
      comments = temp;
    });
  }

  void addComment(String comment, String replyFor, BuildContext context) async {
    _commentController.clear();
    File savedFile = file;
    file = null;
    List<String> objectName = [];
    FocusScope.of(context).unfocus();
    if (savedFile != null) {
      List<String> names = [];
      names.add(savedFile.path.substring(savedFile.path.lastIndexOf("/") + 1));
      var response = await APIService.getPresignedLink(
          PresignedLinkedRequestModel(fileNames: names));
      await APIService.uploadImage(savedFile, response.data.items[0].signedLink);
      objectName.add(response.data.items[0].objectName);
    }

    await APIService.comment(CommentRequestModel(
      targetId: targetId,
      content: comment,
      replyFor: replyFor,
      targetType: targetType,
      images: objectName,
    ));
    if (comments.length > 0) {
      _scrollController.animateTo(_scrollController.position.maxScrollExtent,
          duration: Duration(milliseconds: 300), curve: Curves.easeOut);
    }
    await fetchData();
  }
}

class Comment extends StatefulWidget {
  final String displayName;
  final String userId;
  final String avatar;
  final String comment;
  final DateTime dateTime;
  final String id;
  final int numberOfReply;
  final FocusNode focusNode;
  final Function updateLabelText;
  final String targetType;
  final String targetId;
  final List<Medias> medias;

  Comment({
    this.displayName,
    this.userId,
    this.avatar,
    this.comment,
    this.dateTime,
    this.id,
    this.numberOfReply,
    this.focusNode,
    this.updateLabelText,
    this.targetType,
    this.targetId,
    this.medias
  });

  @override
  State<Comment> createState() => _CommentState();
}

class _CommentState extends State<Comment> {
  List<ChildComment> childrenComment = [];

  bool loadingChildComment = false;

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Column(
      children: <Widget>[
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Container(
              margin: EdgeInsets.only(
                  left: size.width * 0.03, right: size.width * 0.03),
              child: (widget.avatar != null)
                  ? CircleAvatar(
                      radius: 17,
                      backgroundColor: Colors.grey,
                      backgroundImage: NetworkImage(widget.avatar),
                    )
                  : CircleAvatar(
                      radius: 17,
                      backgroundColor: Colors.grey,
                      backgroundImage:
                          AssetImage('assets/images/default_avatar.png')),
            ),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(15),
                        color: backGroundFoodScreenColor),
                    child: Padding(
                      padding: const EdgeInsets.only(
                          left: 10, top: 6, right: 8, bottom: 6),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Text(
                            widget.displayName,
                            style: TextStyle(
                              fontSize: 15,
                              color: Colors.black,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(
                            height: 2,
                          ),
                          SizedBox(
                            width: size.width * 0.73,
                            child: Text(widget.comment,
                                maxLines: 100,
                                style: TextStyle(
                                  fontSize: 15,
                                  color: Colors.black,
                                )),
                          ),
                        ],
                      ),
                    ),
                  ),
                  widget.medias.length > 0 ? Container(
                    margin: EdgeInsets.only(top: 5),
                    width: size.width*0.6,
                    height: size.width*0.4,
                    decoration: BoxDecoration(
                        borderRadius: BorderRadius.all(Radius.circular(20.0)),
                        image: DecorationImage(
                          image: NetworkImage(
                              widget.medias[0].url

                          ),
                          fit: BoxFit.cover,
                        )
                    ),
                  )

                      : Container(),
                  Container(
                    margin: EdgeInsets.only(left: 10, right: 10, top: 4),
                    child: Wrap(
                      spacing: 15,
                      children: [
                        GestureDetector(
                            onTap: () {
                              widget.updateLabelText(
                                  "Replying to " + widget.displayName,
                                  widget.id);
                              widget.focusNode.requestFocus();
                            },
                            child: Text(
                              "Reply",
                              style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: Colors.black,
                                  fontSize: 13),
                            )),
                        Text(
                          timeago.format(widget.dateTime, locale: 'en_short'),
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(fontSize: 13, color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
                  childrenComment.length == 0
                      ? widget.numberOfReply != 0
                          ? Container(
                              margin:
                                  EdgeInsets.only(left: 10, right: 10, top: 4),
                              child: GestureDetector(
                                onTap: () async {
                                  setState(() {
                                    loadingChildComment = true;
                                  });
                                  var dataChildrenComment =
                                      await APIService.getComment(
                                          widget.targetId,
                                          widget.targetType,
                                          widget.id);

                                  List<ChildComment> temp = [];

                                  for (var i
                                      in dataChildrenComment.data.comments) {
                                    temp.add(ChildComment(
                                      displayName: i.user.displayName,
                                      userId: i.user.id,
                                      avatar: i.user.avatar.url != null
                                          ? i.user.avatar.url
                                          : null,
                                      comment: i.content,
                                      dateTime:
                                          DateTime.fromMillisecondsSinceEpoch(
                                              i.createdAt),
                                      id: i.id,
                                      parentId: widget.id,
                                      focusNode: widget.focusNode,
                                      updateLabelText: widget.updateLabelText,
                                      targetType: widget.targetType,
                                      targetId: widget.targetId,
                                      medias: i.medias,
                                    ));
                                  }
                                  setState(() {
                                    childrenComment = temp;
                                    loadingChildComment = false;
                                  });
                                },
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.start,
                                  children: [
                                    Icon(
                                      FontAwesomeIcons.reply,
                                      size: 14,
                                    ),
                                    SizedBox(
                                      width: 15,
                                    ),
                                    widget.numberOfReply == 1
                                        ? Text("View " +
                                            widget.numberOfReply.toString() +
                                            " reply")
                                        : Text("View " +
                                            widget.numberOfReply.toString() +
                                            " replies"),
                                    SizedBox(
                                      width: 15,
                                    ),
                                    loadingChildComment
                                        ? Transform.scale(
                                            scale: 0.4,
                                            child: CircularProgressIndicator())
                                        : Container(),
                                  ],
                                ),
                              ),
                            )
                          : Container()
                      : Padding(
                          padding: const EdgeInsets.only(top: 8.0),
                          child: ListView(
                            children: childrenComment,
                            shrinkWrap: true,
                            physics: NeverScrollableScrollPhysics(),
                          ),
                        ),
                  childrenComment.length == 0
                      ? SizedBox(
                          height: 10,
                        )
                      : Container(),
                ],
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class ChildComment extends StatelessWidget {
  final String displayName;
  final String userId;
  final String avatar;
  final String comment;
  final DateTime dateTime;
  final String id;
  final String parentId;
  final FocusNode focusNode;
  final Function updateLabelText;
  final String targetType;
  final String targetId;
  final List<Medias> medias;
  const ChildComment(
      {this.targetId,
      this.targetType,
      this.displayName,
      this.userId,
      this.avatar,
      this.comment,
      this.dateTime,
      this.id,
      this.focusNode,
      this.updateLabelText,
      this.parentId,
      this.medias});

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Column(
      children: <Widget>[
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Container(
              margin: EdgeInsets.only(right: size.width * 0.03),
              child: (avatar != null)
                  ? CircleAvatar(
                      radius: 14,
                      backgroundColor: Colors.grey,
                      backgroundImage: NetworkImage(avatar),
                    )
                  : CircleAvatar(
                      radius: 14,
                      backgroundColor: Colors.grey,
                      backgroundImage:
                          AssetImage('assets/images/default_avatar.png')),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(15),
                      color: backGroundFoodScreenColor),
                  child: Padding(
                    padding: const EdgeInsets.only(
                        left: 10, top: 6, right: 8, bottom: 6),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Text(
                          displayName,
                          style: TextStyle(
                            fontSize: 15,
                            color: Colors.black,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(
                          height: 2,
                        ),
                        SizedBox(
                          width: size.width * 0.62,
                          child: Text(comment,
                              maxLines: 100,
                              style: TextStyle(
                                fontSize: 15,
                                color: Colors.black,
                              )),
                        ),
                      ],
                    ),
                  ),
                ),
                medias.length > 0 ? Container(
                  margin: EdgeInsets.only(top: 5),
                  width: size.width*0.5,
                  height: size.width/3,
                  decoration: BoxDecoration(
                      borderRadius: BorderRadius.all(Radius.circular(20.0)),
                      image: DecorationImage(
                        image: NetworkImage(
                            medias[0].url

                        ),
                        fit: BoxFit.cover,
                      )
                  ),
                )

                    : Container(),
                Container(
                  margin: EdgeInsets.only(left: 10, right: 10, top: 4),
                  child: Wrap(
                    spacing: 15,
                    children: [
                      GestureDetector(
                          onTap: () {
                            updateLabelText("Replying to " + displayName, parentId);
                            focusNode.requestFocus();
                          },
                          child: Text(
                            "Reply",
                            style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: Colors.black,
                                fontSize: 13),
                          )),
                      Text(
                        timeago.format(dateTime, locale: 'en_short'),
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(fontSize: 13, color: Colors.grey),
                      ),
                    ],
                  ),
                ),
                SizedBox(
                  height: 10,
                ),
              ],
            ),
          ],
        ),
      ],
    );
  }
}
