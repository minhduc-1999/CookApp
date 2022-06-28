import 'dart:async';
import 'dart:io';

import 'package:bubble/bubble.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_client_sse/flutter_client_sse.dart';
import 'package:flutter_observer/Observable.dart';
import 'package:flutter_observer/Observer.dart';
import 'package:image_picker/image_picker.dart';
import 'package:image_size_getter/file_input.dart';
import 'package:image_size_getter/image_size_getter.dart' as imageSizeGetter;
import 'package:optimized_cached_image/optimized_cached_image.dart';
import 'package:speech_to_text/speech_recognition_result.dart';
import 'package:speech_to_text/speech_to_text.dart';
import 'package:tastify/Model/Message.dart';
import 'package:tastify/Model/MessageRequestModel.dart';
import 'package:tastify/Model/MessageRespondModel.dart';
import 'package:tastify/Model/PresignedLinkedRequestModel.dart';
import 'package:tastify/Model/UserWallRespondModel.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:tastify/main.dart';

import '../config.dart';
import '../constants.dart';

class MessageActivity extends StatefulWidget {
  final String conversationId;
  final String cover;
  final String displayName;

  const MessageActivity(
      {Key key, this.conversationId, this.cover, this.displayName})
      : super(key: key);

  @override
  _MessageActivityState createState() => _MessageActivityState();
}

class _MessageActivityState extends State<MessageActivity> with Observer {
  UserWallRespondModel user;
  List<Message> messages = [];
  bool circular = true;
  final messageInsert = TextEditingController();
  ScrollController _scrollController = ScrollController();
  int totalPage = 1000;
  int offset = 0;
  ImagePicker imagePicker = ImagePicker();
  FocusNode focusNode = FocusNode();
  File file;

  @override
  void initState() {
    // TODO: implement initState
    Observable.instance.addObserver(this);
    super.initState();
    fetchData();
    _scrollController.addListener(() {
      if (_scrollController.position.pixels ==
          _scrollController.position.maxScrollExtent) {
        _getMoreData();
      }
    });
  }

  void fetchData() async {
    setState(() {
      circular = true;
      offset = 0;
    });
    var dataUser = await APIService.getUserWall(currentUserId);
    var dataMessages =
        await APIService.getMessages(widget.conversationId, offset);
    List<Message> tempMessages = [];
    for (var i in dataMessages.data.messages) {
      if (i.sender.id != currentUserId) {
        tempMessages.add(Message(
            content: i.content,
            avatar: i.sender.avatar.url,
            createdAt: DateTime.fromMillisecondsSinceEpoch(i.createdAt),
            isUser: false,
        type: i.type,
        height: i.config != null ? i.config.height : 0,
        width: i.config != null ? i.config.width : 0));
      } else {
        tempMessages.add(Message(
            content: i.content,
            avatar: i.sender.avatar.url,
            createdAt: DateTime.fromMillisecondsSinceEpoch(i.createdAt),
            isUser: true,
            type: i.type,
            height: i.config != null ? i.config.height : 0,
            width: i.config != null ? i.config.width : 0));
      }
    }
    setState(() {
      if (dataMessages.data.messages.length > 0) {
        totalPage = dataMessages.data.metadata.totalPage;
      }
      user = dataUser;
      messages = tempMessages;
      circular = false;
      offset++;
    });
  }

  void _getMoreData() async {
    print("get more:" + offset.toString());
    var dataMessages =
        await APIService.getMessages(widget.conversationId, offset);
    List<Message> tempMessages = [];
    for (var i in dataMessages.data.messages) {
      if (i.sender.id != currentUserId) {
        tempMessages.add(Message(
            content: i.content,
            avatar: i.sender.avatar.url,
            createdAt: DateTime.fromMillisecondsSinceEpoch(i.createdAt),
            isUser: false,
            type: i.type,
            height: i.config != null ? i.config.height : 0,
            width: i.config != null ? i.config.width : 0));
      } else {
        tempMessages.add(Message(
            content: i.content,
            avatar: i.sender.avatar.url,
            createdAt: DateTime.fromMillisecondsSinceEpoch(i.createdAt),
            isUser: true,
            type: i.type,
            height: i.config != null ? i.config.height : 0,
            width: i.config != null ? i.config.width : 0));
      }
    }

    setState(() {
      messages.addAll(tempMessages);
      offset++;
    });
  }

  @override
  void dispose() {
    // TODO: implement dispose
    Observable.instance.removeObserver(this);
    super.dispose();
  }

  @override
  update(Observable observable, String notifyName, Map map) async {
    // TODO: implement update
    if (notifyName == "new_message") {

      if (map["to"] == widget.conversationId) {
        if (map["sender"]["id"] != currentUserId) {
          if (map["type"] == Config.messageImageType){
            Message mess = Message(
              avatar: map["sender"]["avatar"]["url"],
              createdAt: DateTime.now(),
              isUser: false,
              content: "https://storage.googleapis.com/cookapp-3ae24.appspot.com/" + map["content"],
              width: map["config"]["width"],
              height: map["config"]["height"],
              type: Config.messageImageType,
            );
            await APIService.seen(map["to"], map["id"]);
            setState(() {
              messages.insert(0, mess);
            });
          } else if (map["type"] == Config.messageTextType){
            Message mess = Message(
                          content: map["content"],
                          avatar: map["sender"]["avatar"]["url"],
                          createdAt: DateTime.now(),
                          isUser: false);
            await APIService.seen(map["to"], map["id"]);
            setState(() {
              messages.insert(0, mess);
            });
          }
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: <Color>[
                Theme.of(context).scaffoldBackgroundColor,
                Theme.of(context).scaffoldBackgroundColor
              ],
            ),
          ),
        ),
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back,
            color: Colors.black,
          ),
          onPressed: () async {
            await FocusScope.of(context).unfocus();
            Timer(const Duration(milliseconds: 200), () {
              Navigator.of(context).pop();
            });
          },
        ),
        title: Row(
          children: [
            CircleAvatar(
              radius: 15,
              backgroundColor: Colors.grey,
              backgroundImage: NetworkImage(widget.cover),
            ),
            SizedBox(
              width: size.width * 0.04,
            ),
            Text(
              widget.displayName,
              style: TextStyle(fontSize: 16, color: Colors.black),
            )
          ],
        ),
      ),
      body: Container(
        child: Column(
          children: <Widget>[
            Expanded(
                child: circular
                    ? Center(child: CircularProgressIndicator())
                    : ListView.builder(
                        controller: _scrollController,
                        reverse: true,
                        itemCount: messages.length + 1,
                        itemBuilder: (context, i) {
                          if (i == messages.length) {
                            return offset < totalPage
                                ? messages.length >= 20
                                    ? Column(
                                        children: [
                                          SizedBox(
                                            height: 10,
                                          ),
                                          CupertinoActivityIndicator(),
                                        ],
                                      )
                                    : Container()
                                : SizedBox(
                                    height: 10,
                                  );
                          }
                          return chat(messages[i]);
                        })),
            Divider(
              height: 5.0,
              color: appPrimaryColor,
            ),
            Container(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ListTile(
                    contentPadding: EdgeInsets.symmetric(horizontal: 8),
                    leading: IconButton(
                      icon: Icon(Icons.image),
                      onPressed: () async {
                        XFile temp = await imagePicker.pickImage(
                            source: ImageSource.gallery);
                        setState(() {
                          file = File(temp.path);
                        });
                      },
                      color: appPrimaryColor,
                    ),
                    title: Container(
                      height: 40,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.all(Radius.circular(15)),
                        color: Color.fromRGBO(220, 220, 220, 1),
                      ),
                      padding: EdgeInsets.only(left: 15),
                      child: TextFormField(
                        controller: messageInsert,
                        decoration: InputDecoration(
                          hintText: "Enter a Message...",
                          hintStyle: TextStyle(color: Colors.black26),
                          border: InputBorder.none,
                          focusedBorder: InputBorder.none,
                          enabledBorder: InputBorder.none,
                          errorBorder: InputBorder.none,
                          disabledBorder: InputBorder.none,
                        ),
                        style: TextStyle(fontSize: 16, color: Colors.black),
                        onChanged: (value) {},
                      ),
                    ),
                    trailing: IconButton(
                        icon: Icon(
                          Icons.send,
                          size: 30.0,
                          color: appPrimaryColor,
                        ),
                        onPressed: () async {
                          File savedFile;
                          if (messageInsert.text.isEmpty && file == null) {
                            print("empty message");
                          } else if (messageInsert.text.isNotEmpty) {
                            Message mess = Message(
                                content: messageInsert.text,
                                avatar: "",
                                createdAt: DateTime.now(),
                                isUser: true,
                                type: Config.messageTextType);
                            savedFile = file;
                            messageInsert.clear();
                            setState(() {
                              file = null;
                            });
                            await APIService.sendMessage(MessageRequestModel(
                                to: widget.conversationId,
                                message: mess.content,
                                type: Config.messageTextType));
                            setState(() {
                              messages.insert(0, mess);
                            });
                            if (savedFile != null) {
                              List<String> names = [];
                              String objectName;
                              names.add(savedFile.path
                                  .substring(savedFile.path.lastIndexOf("/") + 1));
                              var response = await APIService.getPresignedLink(
                                  PresignedLinkedRequestModel(fileNames: names));
                              await APIService.uploadImage(
                                  savedFile, response.data.items[0].signedLink);
                              objectName = response.data.items[0].objectName;
                              print("objectName: " + objectName);
                              var sizeImage =
                              imageSizeGetter.ImageSizeGetter.getSize(
                                  FileInput(savedFile));
                              Message mess = Message(
                                avatar: "",
                                createdAt: DateTime.now(),
                                isUser: true,
                                content: "https://storage.googleapis.com/cookapp-3ae24.appspot.com/images/chat/images" + objectName.substring(4),
                                width: sizeImage.width,
                                height: sizeImage.height,
                                type: Config.messageImageType,
                              );
                              await APIService.sendMessage(MessageRequestModel(
                                  to: widget.conversationId,
                                  type: Config.messageImageType,
                                  imageContent: ImageContent(
                                      image: objectName,
                                      width: sizeImage.width,
                                      height: sizeImage.height)));
                              setState(() {
                                messages.insert(0, mess);
                              });
                            }
                          } else if (file != null) {
                            List<String> names = [];
                            String objectName;
                            savedFile = file;
                            setState(() {
                              file = null;
                            });
                            names.add(savedFile.path
                                .substring(savedFile.path.lastIndexOf("/") + 1));
                            var response = await APIService.getPresignedLink(
                                PresignedLinkedRequestModel(fileNames: names));
                            await APIService.uploadImage(
                                savedFile, response.data.items[0].signedLink);
                            objectName = response.data.items[0].objectName;
                            print("objectName: " + objectName);
                            var sizeImage =
                                imageSizeGetter.ImageSizeGetter.getSize(
                                    FileInput(savedFile));
                            Message mess = Message(
                              avatar: "",
                              createdAt: DateTime.now(),
                              isUser: true,
                              content: "https://storage.googleapis.com/cookapp-3ae24.appspot.com/images/chat/images" + objectName.substring(4),
                              width: sizeImage.width,
                              height: sizeImage.height,
                              type: Config.messageImageType,
                            );
                            await APIService.sendMessage(MessageRequestModel(
                                to: widget.conversationId,
                                type: Config.messageImageType,
                                imageContent: ImageContent(
                                    image: objectName,
                                    width: sizeImage.width,
                                    height: sizeImage.height)));
                            setState(() {
                              messages.insert(0, mess);
                            });
                          }
                        }),
                  ),
                  file != null
                      ? Container(
                          margin: EdgeInsets.all(5.0),
                          width: size.width * 0.3,
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
                                            color:
                                                Colors.white.withOpacity(0.8),
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
      ),
    );
  }



  Widget chat(Message message) {
    final Size size = MediaQuery.of(context).size;
    return Container(
      padding: EdgeInsets.only(left: 20, right: 20),
      child: message.type == Config.messageTextType
          ? Row(
              mainAxisAlignment: message.isUser == true
                  ? MainAxisAlignment.end
                  : MainAxisAlignment.start,
              children: [
                message.isUser == false
                    ? Container(
                        height: 35,
                        width: 35,
                        child: CircleAvatar(
                          radius: 15,
                          backgroundColor: Colors.grey,
                          backgroundImage: NetworkImage(message.avatar),
                        ),
                      )
                    : Container(),
                Padding(
                  padding:
                      EdgeInsets.only(left: 10.0, right: 10, top: 6, bottom: 6),
                  child: Bubble(
                      radius: Radius.circular(15.0),
                      color: message.isUser == true
                          ? appPrimaryColor
                          : backGroundFoodScreenColor,
                      elevation: 0.0,
                      child: Padding(
                        padding: EdgeInsets.all(2.0),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: <Widget>[
                            SizedBox(
                              width: 10.0,
                            ),
                            Flexible(
                                child: Container(
                              constraints: BoxConstraints(maxWidth: 200),
                              child: Text(
                                message.content,
                                style: TextStyle(
                                    color: message.isUser
                                        ? Colors.white
                                        : Colors.black),
                              ),
                            ))
                          ],
                        ),
                      )),
                ),
                /*message.isUser == true
              ? Container(
            height: 35,
            width: 35,
            child: (user.data.avatar.url != null)
                ? CircleAvatar(
              radius: size.width * 0.11,
              backgroundColor: Colors.grey,
              backgroundImage:
              NetworkImage(user.data.avatar.url),
            )
                : CircleAvatar(
              */ /*child: Image.asset("assets/images/default_avatar.png",
                                    width: size.width * 0.20,
                                    height: size.width * 0.20,
                                    fit: BoxFit.fill),*/ /*
                radius: size.width * 0.11,
                backgroundColor: Colors.grey,
                backgroundImage: AssetImage(
                    'assets/images/default_avatar.png')),
          )
              : Container(),*/
              ],
            )
          : message.type == Config.messageImageType
              ? Row(
                  mainAxisAlignment: message.isUser == true
                      ? MainAxisAlignment.end
                      : MainAxisAlignment.start,
                  children: [
                    message.isUser == false
                        ? Container(
                            height: 35,
                            width: 35,
                            child: CircleAvatar(
                              radius: 15,
                              backgroundColor: Colors.grey,
                              backgroundImage: NetworkImage(message.avatar),
                            ),
                          )
                        : Container(),
                    message.width < (size.width*0.65).toInt() ?
                    Container(
                      margin: EdgeInsets.only(left: 10.0, right: 10, top: 6, bottom: 6),
                      width: message.width,
                      height: message.height,
                      child: OptimizedCacheImage(
                          imageUrl: message.content,
                          imageBuilder: (context, imageProvider) => Container(
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.all(Radius.circular(20.0)),
                              image: DecorationImage(
                                image: imageProvider,
                                fit: BoxFit.cover,
                              ),
                            ),
                          ),
                          placeholder: (context, url) => Center(child: CircularProgressIndicator()),
                          errorWidget: (context, url, error) => Icon(Icons.error),
                        ),
                    ) :
                    Container(
                      margin: EdgeInsets.only(left: 10.0, right: 10, top: 6, bottom: 6),
                      width: size.width*0.65,
                      height: message.height * size.width*0.65 / message.width,
                      child: OptimizedCacheImage(
                        imageUrl: message.content,
                        imageBuilder: (context, imageProvider) => Container(
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.all(Radius.circular(20.0)),
                            image: DecorationImage(
                                image: imageProvider,
                                fit: BoxFit.cover,
                                ),
                          ),
                        ),
                        placeholder: (context, url) => Center(child: CircularProgressIndicator()),
                        errorWidget: (context, url, error) => Icon(Icons.error),
                      ),
                    )
                    /*Padding(
                      padding: EdgeInsets.only(
                          left: 10.0, right: 10, top: 6, bottom: 6),
                      child: message.width < (size.width * 0.6).toInt() ?
                      NetworkImage(message.content) : Container(
                        width: size.width*0.6,
                        decoration: BoxDecoration(
                            borderRadius: BorderRadius.all(Radius.circular(20.0)),
                            image: DecorationImage(
                              image: NetworkImage(
                                  "https://storage.googleapis.com/cookapp-3ae24.appspot.com/images/chat/images/9b79d368-289f-43ba-8b72-34583302c2b5_1655991709456_image_picker3422894144275232183.png"
                              ),
                              fit: BoxFit.cover,
                            )
                        ),

                      )
                    ),*/
                    /*message.isUser == true
              ? Container(
            height: 35,
            width: 35,
            child: (user.data.avatar.url != null)
                ? CircleAvatar(
              radius: size.width * 0.11,
              backgroundColor: Colors.grey,
              backgroundImage:
              NetworkImage(user.data.avatar.url),
            )
                : CircleAvatar(
              */ /*child: Image.asset("assets/images/default_avatar.png",
                                    width: size.width * 0.20,
                                    height: size.width * 0.20,
                                    fit: BoxFit.fill),*/ /*
                radius: size.width * 0.11,
                backgroundColor: Colors.grey,
                backgroundImage: AssetImage(
                    'assets/images/default_avatar.png')),
          )
              : Container(),*/
                  ],
                )
              : Container(),
    );
  }
}
