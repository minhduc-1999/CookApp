import 'dart:async';

import 'package:bubble/bubble.dart';
import 'package:flutter/material.dart';
import 'package:flutter_client_sse/flutter_client_sse.dart';
import 'package:flutter_observer/Observable.dart';
import 'package:flutter_observer/Observer.dart';
import 'package:speech_to_text/speech_recognition_result.dart';
import 'package:speech_to_text/speech_to_text.dart';
import 'package:tastify/Model/Message.dart';
import 'package:tastify/Model/MessageRequestModel.dart';
import 'package:tastify/Model/MessageRespondModel.dart';
import 'package:tastify/Model/UserWallRespondModel.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:tastify/main.dart';

import '../config.dart';
import '../constants.dart';
class MessageActivity extends StatefulWidget {
  final String conversationId;
  final String cover;
  final String displayName;
  const MessageActivity({Key key, this.conversationId,this.cover,this.displayName}) : super(key: key);
  @override
  _MessageActivityState createState() => _MessageActivityState();
}

class _MessageActivityState extends State<MessageActivity> with Observer {
  UserWallRespondModel user;
  List<Message> messages = [];
  bool circular = true;
  final messageInsert = TextEditingController();
  @override
  void initState() {
    // TODO: implement initState
    Observable.instance.addObserver(this);
    super.initState();
    fetchData();
  }
  @override
  void dispose() {
    // TODO: implement dispose
    Observable.instance.removeObserver(this);
    super.dispose();
  }
  @override
  update(Observable observable, String notifyName, Map map) async{
    // TODO: implement update
    if(notifyName == "new_message"){
      if(map["to"] == widget.conversationId){
        Message mess = Message(
            content: map["content"],
            avatar: map["sender"]["avatar"]["url"],
            createdAt: DateTime.now(),
            isUser: false);
        //await APIService.seen(map["to"],map["id"]);
        setState(() {
            messages.insert(0, mess);
        });

      }
    }

  }
  void fetchData() async {
    var dataUser = await APIService.getUserWall(currentUserId);
    var dataMessages = await APIService.getMessages(widget.conversationId);
    List<Message> tempMessages = [];
    for(var i in dataMessages.data.messages){
      if(i.sender.id != currentUserId){
        tempMessages.add(Message(content: i.content,avatar: i.sender.avatar.url,createdAt: DateTime.fromMillisecondsSinceEpoch(i.createdAt),isUser: false));
      } else {
        tempMessages.add(Message(content: i.content,avatar: i.sender.avatar.url,createdAt: DateTime.fromMillisecondsSinceEpoch(i.createdAt),isUser: true));
      }
    }
    setState(() {
      user = dataUser;
      messages = tempMessages;
      circular = false;
    });
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
              colors: <Color>[Theme.of(context).scaffoldBackgroundColor, Theme.of(context).scaffoldBackgroundColor],
            ),
          ),
        ),
        leading: IconButton(
          icon: Icon(Icons.arrow_back,color: Colors.black,),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        title:  Row(
          children: [
            CircleAvatar(
              radius: 15,
              backgroundColor: Colors.grey,
              backgroundImage: NetworkImage(widget.cover),
            ),
            SizedBox(
              width: size.width * 0.04,
            ),
            Text(widget.displayName, style: TextStyle(fontSize: 16, color: Colors.black),)
          ],
        ),
      ),

      body: Container(
        child: Column(
          children: <Widget>[
            Flexible(
                child: circular ? Center(child: CircularProgressIndicator()) :  ListView.builder(
                    reverse: true,
                    itemCount: messages.length,
                    itemBuilder: (context, index) => chat(messages[index]))),
            Divider(
              height: 5.0,
              color: appPrimaryColor,
            ),

            Container(
              child: ListTile(

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
                      if (messageInsert.text.isEmpty) {
                        print("empty message");
                      } else {
                        Message mess = Message(
                            content: messageInsert.text,
                            avatar: "",
                            createdAt: DateTime.now(),
                            isUser: true);
                        messageInsert.clear();
                        await APIService.sendMessage(MessageRequestModel(
                            to: widget.conversationId,
                            message: mess.content,
                            type: "TEXT"));
                        setState(() {
                          messages.insert(0, mess);
                        });

                      }

                    }),
              ),
            ),
            SizedBox(
              height: 5.0,
            )
          ],
        ),
      ),

    );
  }

  Widget suggestion(String value){
    return Container(
      child: Row(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: GestureDetector(
              onTap: (){
                messageInsert.text = value;
              },
              child: Bubble(
                  radius: Radius.circular(15.0),
                  color: Colors.grey.withOpacity(0.3),
                  elevation: 0.0,
                  child: Padding(
                    padding: EdgeInsets.only(left: 10.0,right: 10.0,top:2.0,bottom: 2.0),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: <Widget>[
                        Flexible(
                            child: Container(
                              constraints: BoxConstraints(maxHeight: 200),
                              child: Text(
                                value,
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                    color: Colors.black),
                              ),
                            )),

                      ],
                    ),
                  )
              ),
            ),
          ),
        ],
      ),
    );

  }

  Widget chat(Message message) {
    final Size size = MediaQuery.of(context).size;
    return Container(
      padding: EdgeInsets.only(left: 20, right: 20),
      child: Row(
        mainAxisAlignment: message.isUser == true
            ? MainAxisAlignment.end
            : MainAxisAlignment.start,
        children: [
          message.isUser == false
              ? Container(
            height: 35,
            width: 35,
            child:   CircleAvatar(
              radius: 15,
              backgroundColor: Colors.grey,
              backgroundImage: NetworkImage(message.avatar),
            ),
          )
              : Container(),
          Padding(
            padding: EdgeInsets.only(left: 10.0, right: 10, top: 6,bottom: 6),
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
                                  color: message.isUser ? Colors.white : Colors.black),
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
              *//*child: Image.asset("assets/images/default_avatar.png",
                                    width: size.width * 0.20,
                                    height: size.width * 0.20,
                                    fit: BoxFit.fill),*//*
                radius: size.width * 0.11,
                backgroundColor: Colors.grey,
                backgroundImage: AssetImage(
                    'assets/images/default_avatar.png')),
          )
              : Container(),*/
        ],
      ),
    );
  }




}
