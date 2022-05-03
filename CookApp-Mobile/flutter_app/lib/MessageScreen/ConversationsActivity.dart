import 'dart:async';

import 'package:bubble/bubble.dart';
import 'package:flutter/material.dart';
import 'package:flutter_observer/Observable.dart';
import 'package:flutter_observer/Observer.dart';
import 'package:tastify/MessageScreen/MessageActivity.dart';
import 'package:tastify/Model/ConversationsRespondModel.dart';

import 'package:tastify/Services/APIService.dart';
import 'package:intl/intl.dart';
import 'package:tastify/main.dart';

import '../constants.dart';
import 'Conversation.dart';

class ConversationsActivity extends StatefulWidget {
  @override
  _ConversationsActivityState createState() => _ConversationsActivityState();
}

class _ConversationsActivityState extends State<ConversationsActivity> with Observer{
  ConversationsRespondModel model;
  List<Conversation> conversations = [];
  String avatar;
  String displayname;
  bool circular = true;
  TextEditingController conversationController = new TextEditingController();
  @override
  void initState() {
    // TODO: implement initState
    Observable.instance.addObserver(this);
    super.initState();
    fetchData();

  }
  @override
  update(Observable observable, String notifyName, Map map) async{
    // TODO: implement update
    if(notifyName == "new_message"){
      print("Conversation Notifierd");
      var dataConversations = await APIService.getConversations();
      Conversation item = conversations.where((element) => element.id == map["to"]).first;
      Conversation newItem = item;
      newItem.readAll = false;
      newItem.lastMessage.content = map["content"];
      newItem.lastMessage.createdAt = map["createdAt"];
      newItem.lastMessage.updatedAt = map["updatedAt"];
      newItem.lastMessage.type = map["type"];
      newItem.lastMessage.id = map["id"];
      List<Conversation> temp = conversations;
      var data = map["id"];
      print("c");
      List<Conversation> preConversation = conversations;
      preConversation.remove(item);
      preConversation.add(newItem);
      List<Conversation> afterConversation = preConversation;
      print("an");
      setState(() {
         /* conversations.remove(item);

          conversations.insert(0, newItem);*/
        conversations = preConversation;
      });


    }

  }
  @override
  void dispose() {
    // TODO: implement dispose
    Observable.instance.removeObserver(this);
    super.dispose();
  }
  void fetchData() async {
    var dataUser = await APIService.getUserWall(currentUserId);
    var dataConversations = await APIService.getConversations();
    List<Conversation> tempConversation = [];
    for(var i in dataConversations.data.conversations){
      tempConversation.add(Conversation(id: i.id, name: i.name,type: i.type,cover: i.cover,lastMessage: i.lastMessage,readAll: i.readAll ));
    }
    setState(() {
      model = dataConversations;
      conversations = tempConversation;
      avatar = dataUser.data.avatar.url;
      displayname = dataUser.data.displayName;
      circular = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;
    return Scaffold(
      body: circular
          ? Center(child: CircularProgressIndicator())
          : Container(
            margin: EdgeInsets.only(left: 15,right: 15,top: size.height*0.06),
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
                    Text("Chats", style: TextStyle(fontSize: 24,fontWeight: FontWeight.bold),)
                  ],
                ),
                Container(
                    height: size.height * 0.055,
                    margin: EdgeInsets.only(top: 20),
                    decoration: BoxDecoration(
                        color: Colors.white, borderRadius: BorderRadius.circular(30)),
                    child: TextField(
                      controller: conversationController,
                      cursorColor: Colors.black,
                      decoration: InputDecoration(
                        hintStyle: TextStyle(fontSize: size.height * 0.021),
                        hintText: "Search",
                        fillColor: backGroundFoodScreenColor,
                        filled: true,
                        focusedBorder:OutlineInputBorder(
                          borderSide: const BorderSide(color: Colors.black, width: 0.5),
                          borderRadius: BorderRadius.circular(25.0),
                        ),

                        suffixIcon: IconButton(
                          icon: Icon(Icons.search,color: appPrimaryColor,),
                          onPressed: () {

                          },
                        ),
                        border: OutlineInputBorder(
                          borderSide: const BorderSide(color: Colors.black, width: 0.5),
                          borderRadius: BorderRadius.circular(25.0),
                        ),
                        contentPadding:
                        EdgeInsets.only(left: 15, bottom: 5, top: 5, right: 15),
                      ),
                    )),


                ListView.builder(
                  padding: EdgeInsets.only(top: 20),
                    itemCount: conversations.length,

                    shrinkWrap: true,
                    itemBuilder: (BuildContext context, int index) {
                      return ConversationTitle(
                          conversation: conversations[index]);
                    }),
              ],
            ),
          ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: appPrimaryColor,
        onPressed: (){},
        tooltip: 'Increment',
        child: Icon(Icons.message),
      ),
    );

  }


}

class ConversationTitle extends StatefulWidget {
  final Conversation conversation;

  const ConversationTitle({Key key, this.conversation}) : super(key: key);

  @override
  _ConversationTitleState createState() => _ConversationTitleState(
      id: conversation.id,
      name: conversation.name,
      type: conversation.type,
      cover: conversation.cover,
      lastMessage: conversation.lastMessage,
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
    return Container(
      margin: EdgeInsets.only(bottom: 15),
      child: GestureDetector(
        onTap: ()async{
          if(!readAll){
            APIService.seen(id, lastMessage.id);
          }
          openConversation();
          setState(() {
            readAll = true;
          });

        },
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
            Container(
                child: Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(name, style: readAll ? TextStyle(fontSize: 18) : TextStyle(fontSize: 18, fontWeight: FontWeight.bold),),
                      SizedBox(
                        height: 2,
                      ),
                      Container(
                        child: lastMessage != null
                            ? Row(
                                children: [
                                  Text(
                                    lastMessage.content.length < 25
                                        ? lastMessage.content
                                        : lastMessage.content.substring(0, 25) +
                                            "...",
                                    style: readAll ? TextStyle(fontSize: 14) : TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                                    overflow: TextOverflow.ellipsis,
                                    maxLines: 1,
                                    softWrap: false,
                                  ),
                                  SizedBox(
                                    width: 15,
                                  ),
                                  Text(
                                    DateFormat('hh:mm').format(
                                        DateTime.fromMillisecondsSinceEpoch(
                                            lastMessage.createdAt)),
                                    style: readAll ? TextStyle(fontSize: 14) : TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                                  )
                                ],
                              )
                            : Text(
                                  tempMessage.length < 34 ? tempMessage : tempMessage.substring(0,29) + "...",
                                  style: readAll ? TextStyle(fontSize: 14) : TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                                  overflow: TextOverflow.ellipsis,
                                  maxLines: 1,
                                ),

                      )
                    ],
                  ),
                ),

            ),
          ],
        ),
      ),
    );
  }
  FutureOr updateLastMessage (dynamic value) async{
      var data = await APIService.getConversationsById(this.id);
      setState(() {
        lastMessage = data.data.lastMessage;
      });
  }
  void openConversation() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => MessageActivity(conversationId: this.id, cover: this.cover, displayName: this.name,)),
    ).then(updateLastMessage);
  }
}
