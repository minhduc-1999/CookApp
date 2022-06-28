import 'dart:async';

import 'package:bubble/bubble.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_observer/Observable.dart';
import 'package:flutter_observer/Observer.dart';
import 'package:tastify/MessageScreen/ChatBotActivity.dart';
import 'package:tastify/MessageScreen/MessageActivity.dart';
import 'package:tastify/Model/ConversationsRespondModel.dart';

import 'package:tastify/Services/APIService.dart';
import 'package:intl/intl.dart';
import 'package:tastify/config.dart';
import 'package:tastify/main.dart';

import '../constants.dart';
import 'Conversation.dart';

class ConversationsActivity extends StatefulWidget {
  @override
  _ConversationsActivityState createState() => _ConversationsActivityState();
}

class _ConversationsActivityState extends State<ConversationsActivity>
    with Observer {
  ConversationsRespondModel model;
  List<Conversation> conversations = [];
  String avatar;
  String displayname;
  bool circular = true;
  TextEditingController conversationController = new TextEditingController();
  int offset = 0;
  int offsetQuery = 0;
  int currentOffset = 0;
  ScrollController _scrollController = ScrollController();
  int totalPage = 1000;
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

  @override
  update(Observable observable, String notifyName, Map map) async {
    // TODO: implement update
    if (notifyName == "new_message") {
      if (conversations
          .where((element) => element.id == map["to"])
          .isNotEmpty) {
        Conversation item =
            conversations.where((element) => element.id == map["to"]).first;
        Conversation newItem = item;
        newItem.readAll = false;
        newItem.lastMessage.content = map["content"];
        newItem.lastMessage.createdAt = map["createdAt"].toInt();
        newItem.lastMessage.updatedAt = map["updatedAt"].toInt();
        newItem.lastMessage.type = map["type"];
        newItem.lastMessage.id = map["id"];
        newItem.lastMessage.sender.id = map["sender"]["id"];
        newItem.lastMessage.sender.avatar = map["sender"]["avatar"];
        newItem.lastMessage.sender.displayName = map["sender"]["displayName"];

        print("an");
        setState(() {
          conversations.remove(item);
          conversations.insert(0, newItem);
        });
      } else {
        Conversation newItem;
        newItem.type = "DIRECT";
        newItem.readAll = false;
        newItem.lastMessage.content = map["content"];
        newItem.lastMessage.createdAt = map["createdAt"].toInt();
        newItem.lastMessage.updatedAt = map["updatedAt"].toInt();
        newItem.lastMessage.type = map["type"];
        newItem.lastMessage.id = map["id"];
        newItem.lastMessage.sender.id = map["sender"]["id"];
        newItem.lastMessage.sender.avatar = map["sender"]["avatar"];
        newItem.lastMessage.sender.displayName = map["sender"]["displayName"];
        newItem.id = map["to"];
        newItem.cover = map["sender"]["avatar"]["url"];
        newItem.name = map["sender"]["displayName"];
        setState(() {
          conversations.insert(0, newItem);
        });
      }

      print("update conver");
      /* var dataConversations = await APIService.getConversations();
      List<Conversation> tempConversation = [];
      for(var i in dataConversations.data.conversations){
        tempConversation.add(Conversation(id: i.id, name: i.name,type: i.type,cover: i.cover,lastMessage: i.lastMessage,readAll: i.readAll ));
      }
      print("ln");
      setState(() {
        conversations.clear();
      });
      setState(() {

        conversations.addAll(tempConversation);
      });*/
    }
  }

  @override
  void dispose() {
    // TODO: implement dispose
    Observable.instance.removeObserver(this);
    super.dispose();
  }

  void updateConversations(String id) async {
    print("update conver");
    var dataConversations = await APIService.getConversations(0);
    List<Conversation> tempConversation = [];
    for (var i in dataConversations.data.conversations) {
      tempConversation.add(Conversation(
          id: i.id,
          name: i.name,
          type: i.type,
          cover: i.cover,
          lastMessage: i.lastMessage,
          readAll: i.readAll));
    }
    print("ln");

    setState(() {
      offset = 1;
      currentOffset = 1;
      conversations = tempConversation;
      if(dataConversations.data.conversations.length > 0){
        totalPage = dataConversations.data.metadata.totalPage;
      }
    });
  }

  void fetchData() async {
    var dataUser = await APIService.getUserWall(currentUserId);
    var dataConversations = await APIService.getConversations(offset);
    List<Conversation> tempConversation = [];
    for (var i in dataConversations.data.conversations) {
      tempConversation.add(Conversation(
          id: i.id,
          name: i.name,
          type: i.type,
          cover: i.cover,
          lastMessage: i.lastMessage,
          readAll: i.readAll));
    }
    setState(() {
      model = dataConversations;
      currentOffset = offset + 1;
      conversations = tempConversation;
      avatar = dataUser.data.avatar.url;
      displayname = dataUser.data.displayName;
      offset++;
      if(dataConversations.data.conversations.length > 0){
        totalPage = dataConversations.data.metadata.totalPage;
      }
      circular = false;
    });
  }

  void _getMoreData() async {
    List<Conversation> tempConversation = [];
    if (conversationController.text == "" ||
        conversationController.text == null) {
      var dataConversations = await APIService.getConversations(offset);
      for (var i in dataConversations.data.conversations) {
        tempConversation.add(Conversation(
            id: i.id,
            name: i.name,
            type: i.type,
            cover: i.cover,
            lastMessage: i.lastMessage,
            readAll: i.readAll));
      }
      setState(() {
        conversations.addAll(tempConversation);
        currentOffset = offset + 1;
        if(dataConversations.data.conversations.length > 0){
          totalPage = dataConversations.data.metadata.totalPage;
        }
        offset++;
      });
    } else {
      var dataConversations = await APIService.getConversationsByQuery(
          offsetQuery, conversationController.text);
      for (var i in dataConversations.data.conversations) {
        tempConversation.add(Conversation(
            id: i.id,
            name: i.name,
            type: i.type,
            cover: i.cover,
            lastMessage: i.lastMessage,
            readAll: i.readAll));
      }
      setState(() {
        conversations.addAll(tempConversation);
        currentOffset = offsetQuery + 1;
        if(dataConversations.data.conversations.length > 0){
          totalPage = dataConversations.data.metadata.totalPage;
        }
        offsetQuery++;
      });
    }
  }

  void _queryData(String text) async {
    setState(() {
      offsetQuery = 0;
      offset = 0;
    });
    if (conversationController.text != "") {
      List<Conversation> tempConversation = [];
      var dataConversations = await APIService.getConversationsByQuery(offsetQuery, text);
      for (var i in dataConversations.data.conversations) {
        tempConversation.add(Conversation(
            id: i.id,
            name: i.name,
            type: i.type,
            cover: i.cover,
            lastMessage: i.lastMessage,
            readAll: i.readAll));
      }

      setState(() {
        conversations = tempConversation;
        currentOffset = offsetQuery + 1;
        circular = false;
        if(dataConversations.data.conversations.length > 0){
          totalPage = dataConversations.data.metadata.totalPage;
        }
        offsetQuery++;
      });
    } else {
      List<Conversation> tempConversation = [];
      var dataConversations = await APIService.getConversations(offset);
      for (var i in dataConversations.data.conversations) {
        tempConversation.add(Conversation(
            id: i.id,
            name: i.name,
            type: i.type,
            cover: i.cover,
            lastMessage: i.lastMessage,
            readAll: i.readAll));
      }
      setState(() {
        currentOffset = offset + 1;
        conversations = tempConversation;
        circular = false;
        if(dataConversations.data.conversations.length > 0){
          totalPage = dataConversations.data.metadata.totalPage;
        }
        offset++;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;
    return Scaffold(
      body: circular
          ? Center(child: CircularProgressIndicator())
          : Container(
              margin:
                  EdgeInsets.only(left: 15, right: 15, top: size.height * 0.06),
              child: SingleChildScrollView(
                controller: _scrollController,
                child: Column(
                  children: [
                    Row(
                      children: [
                        CircleAvatar(
                          radius: 20,
                          backgroundColor: Colors.grey,
                          backgroundImage: NetworkImage(avatar),
                        ),
                        SizedBox(
                          width: size.width * 0.04,
                        ),
                        Text(
                          "Chats",
                          style: TextStyle(
                              fontSize: 24, fontWeight: FontWeight.bold),
                        )
                      ],
                    ),
                    Container(
                        height: size.height * 0.055,
                        margin: EdgeInsets.only(top: 20),
                        decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(30)),
                        child: TextField(
                          controller: conversationController,
                          cursorColor: Colors.black,
                          decoration: InputDecoration(
                            hintStyle: TextStyle(fontSize: size.height * 0.021),
                            hintText: "Search",
                            fillColor: backGroundFoodScreenColor,
                            filled: true,
                            focusedBorder: OutlineInputBorder(
                              borderSide: const BorderSide(
                                  color: Colors.black, width: 0.5),
                              borderRadius: BorderRadius.circular(25.0),
                            ),
                            suffixIcon: IconButton(
                              icon: Icon(
                                Icons.search,
                                color: appPrimaryColor,
                              ),
                              onPressed: () {
                                FocusScope.of(context).unfocus();
                                _queryData(conversationController.text);
                              },
                            ),
                            border: OutlineInputBorder(
                              borderSide: const BorderSide(
                                  color: Colors.black, width: 0.5),
                              borderRadius: BorderRadius.circular(25.0),
                            ),
                            contentPadding: EdgeInsets.only(
                                left: 15, bottom: 5, top: 5, right: 15),
                          ),
                        )),
                    ListView.builder(
                        padding: EdgeInsets.only(top: 20),
                        itemCount: currentOffset < totalPage ? conversations.length + 1 : conversations.length,
                        shrinkWrap: true,
                        physics: NeverScrollableScrollPhysics(),
                        itemBuilder: (BuildContext context, int index) {
                          if (index == conversations.length){
                            return CupertinoActivityIndicator();
                          }
                          return ConversationTitle(
                            key: ValueKey(conversations[index]),
                            conversation: conversations[index],
                            updateConversations: this.updateConversations,
                          );
                        }),
                  ],
                ),
              ),
            ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: appPrimaryColor,
        onPressed: () {
          Navigator.push(
              context,
              PageRouteBuilder(
                  pageBuilder: (context, animation, secondaryAnimation) =>
                      ChatBotActivity(),
                  transitionsBuilder:
                      (context, animation, secondaryAnimation, child) {
                    const begin = Offset(1.0, 0.0);
                    const end = Offset.zero;
                    const curve = Curves.easeOut;

                    var tween = Tween(begin: begin, end: end)
                        .chain(CurveTween(curve: curve));

                    return SlideTransition(
                      position: animation.drive(tween),
                      child: child,
                    );
                  }));
        },
        tooltip: 'Increment',
        child: Icon(Icons.message),
      ),
    );
  }
}

class ConversationTitle extends StatefulWidget {
  final Conversation conversation;
  final Function updateConversations;

  const ConversationTitle(
      {Key key, this.conversation, this.updateConversations})
      : super(key: key);

  @override
  _ConversationTitleState createState() => _ConversationTitleState(
      id: conversation.id,
      name: conversation.name,
      type: conversation.type,
      cover: conversation.cover,
      lastMessage: conversation.lastMessage != null
          ? conversation.lastMessage
          : LastMessage(
              content: "Start conversation with " + conversation.name,
              type: "TEXT"),
      readAll: conversation.readAll);
}

class _ConversationTitleState extends State<ConversationTitle> {
  final String id;
  final String name;
  final String type;
  final String cover;
  LastMessage lastMessage;

  bool readAll;

  _ConversationTitleState(
      {this.id,
      this.name,
      this.type,
      this.cover,
      this.lastMessage,
      this.readAll});

  @override
  Widget build(BuildContext context) {
    final double width = MediaQuery.of(context).size.width;
    String tempMessage = "Start conversation with " + name;
    return GestureDetector(
      onTap: () async {
        if (!readAll) {
          APIService.seen(id, lastMessage.id);
        }
        openConversation();
        setState(() {
          readAll = true;
        });
      },
      child: Container(
        margin: EdgeInsets.only(bottom: 15),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            CircleAvatar(
              radius: 25,
              backgroundColor: Colors.grey,
              backgroundImage: NetworkImage(cover),
            ),
            SizedBox(
              width: width * 0.04,
            ),
            Flexible(
              flex: 10,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    style: readAll
                        ? TextStyle(fontSize: 18)
                        : TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(
                    height: 2,
                  ),
                  Row(
                    children: [
                      lastMessage.id != null
                          ? lastMessage.type == Config.messageImageType
                              ? Flexible(
                                  child: Text(
                                    lastMessage.sender.id == currentUserId
                                        ? "You sent a photo"
                                        : lastMessage.sender.displayName +
                                            " sent a photo",
                                    style: readAll
                                        ? TextStyle(fontSize: 14)
                                        : TextStyle(
                                            fontSize: 14,
                                            fontWeight: FontWeight.bold),
                                    overflow: TextOverflow.ellipsis,
                                    maxLines: 1,
                                    softWrap: false,
                                  ),
                                )
                              : Flexible(
                                  child: Text(
                                    lastMessage.sender.id == currentUserId
                                        ? "You: " + lastMessage.content
                                        : lastMessage.sender.displayName +
                                            ": " +
                                            lastMessage.content,
                                    style: readAll
                                        ? TextStyle(fontSize: 14)
                                        : TextStyle(
                                            fontSize: 14,
                                            fontWeight: FontWeight.bold),
                                    overflow: TextOverflow.ellipsis,
                                    maxLines: 1,
                                    softWrap: false,
                                  ),
                                )
                          : Flexible(
                              child: Text(
                                lastMessage.content,
                                style: readAll
                                    ? TextStyle(fontSize: 14)
                                    : TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.bold),
                                overflow: TextOverflow.ellipsis,
                                maxLines: 1,
                                softWrap: false,
                              ),
                            ),
                      SizedBox(
                        width: 15,
                      ),
                      lastMessage.createdAt != null
                          ? DateTime.now()
                                      .difference(
                                          DateTime.fromMillisecondsSinceEpoch(
                                              lastMessage.createdAt))
                                      .inDays <
                                  1
                              ? Text(
                                  DateFormat('hh:mm').format(
                                      DateTime.fromMillisecondsSinceEpoch(
                                          lastMessage.createdAt)),
                                  style: readAll
                                      ? TextStyle(fontSize: 14)
                                      : TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.bold),
                                )
                              : Text(
                                  DateFormat('MMMd').format(
                                      DateTime.fromMillisecondsSinceEpoch(
                                          lastMessage.createdAt)),
                                  style: readAll
                                      ? TextStyle(fontSize: 14)
                                      : TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.bold),
                                )
                          : Container()
                    ],
                  )
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  FutureOr updateLastMessage(dynamic value) async {
    /* var data = await APIService.getConversationsById(this.id);
      setState(() {
        lastMessage = data.data.lastMessage;
      });*/
    widget.updateConversations(this.id);
  }

  void openConversation() {
    //widget.clearConversations("abc");
    Navigator.push(
      context,
      MaterialPageRoute(
          builder: (context) => MessageActivity(
                conversationId: this.id,
                cover: this.cover,
                displayName: this.name,
              )),
    ).then(updateLastMessage);
  }
}
