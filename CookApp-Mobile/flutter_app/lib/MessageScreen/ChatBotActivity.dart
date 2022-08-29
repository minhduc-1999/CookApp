import 'dart:async';

import 'package:bubble/bubble.dart';
import 'package:flutter/material.dart';
import 'package:tastify/Model/ChatBotRequestModel.dart';
import 'package:tastify/Model/Message.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:tastify/config.dart';

import '../constants.dart';

class ChatBotActivity extends StatefulWidget {
  @override
  _ChatBotActivityState createState() => _ChatBotActivityState();
}

class _ChatBotActivityState extends State<ChatBotActivity> {
  List<Message> messages = [];
  String botSessionID = "";
  int recipesLength = 0;
  int recipesPosition = 0;
  TextEditingController messageInsert = TextEditingController();

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
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        title: Row(
          children: [
            CircleAvatar(
              radius: 15,
              backgroundColor: Colors.grey,
              backgroundImage: AssetImage('assets/images/diet.png'),
            ),
            SizedBox(
              width: size.width * 0.04,
            ),
            Text(
              Config.appName,
              style: TextStyle(fontSize: 16, color: Colors.black),
            )
          ],
        ),
      ),
      body: Container(
        child: Column(
          children: <Widget>[
            SizedBox(height: 5,),
            Flexible(
                child: ListView.builder(
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
                        String text = messageInsert.text;
                        messageInsert.clear();
                        setState(() {
                          messages.insert(0, mess);
                        });
                        var respond = await APIService.chatWithBot(
                            ChatBotRequestModel(
                                botSessionID: this.botSessionID,
                                message: text,
                                type: Config.textType));
                        print("ln");
                        Message textRespond = Message(
                            content: respond.data.text,
                            avatar: "",
                            createdAt: DateTime.now(),
                            isUser: false);
                        setState(() {
                          messages.insert(0, textRespond);
                          if (!respond.data.endInteraction) {
                            botSessionID = respond.data.sessionID;
                          }
                        });
                        if (respond.data.attachment != null) {
                          if (respond.data.attachment.recipes != null) {
                            setState(() {
                              recipesLength =
                                  respond.data.attachment.recipes.length;
                            });
                            Timer.periodic(Duration(seconds: 3), (timer) {

                              if (recipesPosition < recipesLength) {
                                Message tempMess = Message(
                                    content: respond.data.attachment
                                        .recipes[recipesPosition].content,
                                    avatar: "",
                                    createdAt: DateTime.now(),
                                    isUser: false);
                                setState(() {
                                  messages.insert(0, tempMess);
                                  recipesPosition++;
                                });
                              } else {
                                timer.cancel();
                                setState(() {
                                  recipesLength = 0;
                                  recipesPosition = 0;
                                });
                              }
                            });
                           /* for (var i in respond.data.attachment.recipes) {
                              Message tempMess = Message(
                                  content: i.content,
                                  avatar: "",
                                  createdAt: DateTime.now(),
                                  isUser: false);
                              Timer(const Duration(milliseconds: 2000), () {
                                setState(() {
                                  messages.insert(0, tempMess);
                                });
                              });
                            }*/
                          }
                          if (respond.data.attachment.ingredients != null) {
                            String ingredients = "";
                            for (int i = 0;
                                i < respond.data.attachment.ingredients.length;
                                i++) {
                              if (i ==
                                  respond.data.attachment.ingredients.length -
                                      1) {
                                ingredients = ingredients +
                                    respond
                                        .data.attachment.ingredients[i].quantity
                                        .toString() +
                                    " " +
                                    respond
                                        .data.attachment.ingredients[i].unit +
                                    " " +
                                    respond.data.attachment.ingredients[i].name;
                              } else {
                                ingredients = ingredients +
                                    respond
                                        .data.attachment.ingredients[i].quantity
                                        .toString() +
                                    " " +
                                    respond
                                        .data.attachment.ingredients[i].unit +
                                    " " +
                                    respond
                                        .data.attachment.ingredients[i].name +
                                    "\n";
                              }
                            }
                            Message tempMess = Message(
                                content: ingredients,
                                avatar: "",
                                createdAt: DateTime.now(),
                                isUser: false);
                            setState(() {
                              messages.insert(0, tempMess);
                            });
                          }
                        }
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
                  child: CircleAvatar(
                    radius: 15,
                    backgroundColor: Colors.grey,
                    backgroundImage: AssetImage('assets/images/diet.png'),
                  ),
                )
              : Container(),
          Padding(
            padding: EdgeInsets.only(left: 10.0, right: 10, top: 6, bottom: 6),
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
                              color:
                                  message.isUser ? Colors.white : Colors.black),
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
      ),
    );
  }
}
