import 'dart:convert';

import 'package:api_cache_manager/utils/cache_manager.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_observer/Observable.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:onesignal_flutter/onesignal_flutter.dart';
import 'package:pinput/pin_put/pin_put.dart';
import 'package:tastify/ChooseTopicScreen/ChooseTopicActivity.dart';
import 'package:tastify/HomeScreen/HomeActivity.dart';
import 'package:tastify/Model/ResendEmailRequestModel.dart';
import 'package:tastify/Model/VerifyEmailRequestModel.dart';
import 'package:tastify/ProfileScreen/EditProfileActivity.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:tastify/Services/Auth.dart';
import 'package:tastify/Services/SharedService.dart';

import 'package:tastify/constants.dart';

import '../main.dart';

class VerifyActivity extends StatefulWidget {
  final String email;
  final AuthBase auth;
  const VerifyActivity({Key key, this.email, this.auth}) : super(key: key);
  @override
  _VerifyActivityState createState() => _VerifyActivityState();
}

class _VerifyActivityState extends State<VerifyActivity> {
  final pinController = TextEditingController();
  final focusNode = FocusNode();
  final BoxDecoration pinPutDecoration = BoxDecoration(
      borderRadius: BorderRadius.circular(10),
      border: Border.all(color: appPrimaryColor));
  bool isAPIProcess = false;
  FToast fToast;
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    fToast = FToast();
    fToast.init(context);
  }
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
  @override
  Widget build(BuildContext context) {
    const focusedBorderColor = Color.fromRGBO(23, 171, 144, 1);
    const fillColor = Color.fromRGBO(243, 246, 249, 0);
    const borderColor = Color.fromRGBO(23, 171, 144, 0.4);
    final Size size = MediaQuery.of(context).size;
    return GestureDetector(
      onTap: (){
        FocusScope.of(context).unfocus();
      },
      child: Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          leading: IconButton(
            icon: Icon(Icons.arrow_back, color: appPrimaryColor),
            onPressed: () {
              Navigator.of(context).pop();
              APICacheManager().deleteCache("login");

            },
          ),
        ),
        body: SingleChildScrollView(
          child: Column(
            children: [
              SizedBox(
                height: size.height * 0.05,
              ),
              Center(
                  child: Text(
                    "Verification",
                    style: TextStyle(
                        color: Color.fromRGBO(30, 60, 87, 1),
                        fontWeight: FontWeight.w700,
                        fontSize: 24),
                  )),
              SizedBox(
                height: size.height * 0.02,
              ),
              Center(
                  child: Text(
                    "Enter the code sent to the email",
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.black38,
                    ),
                  )),
              SizedBox(
                height: size.height * 0.02,
              ),
              Text(
                widget.email,
                style: TextStyle(
                  fontSize: 16,
                  color: Color.fromRGBO(30, 60, 87, 1),
                ),
              ),
              SizedBox(
                height: size.height * 0.05,
              ),
              Padding(
                padding: const EdgeInsets.only(left: 24.0, right: 24.0),
                child: PinPut(
                  fieldsCount: 6,
                  eachFieldHeight: 50,
                  eachFieldWidth: 40,
                  focusNode: focusNode,
                  controller: pinController,
                  onSubmit: (String pin) async{
                    FocusScope.of(context).unfocus();
                    setState(() {
                      isAPIProcess = true;
                    });
                    var res = await APIService.verifyEmail(VerifyEmailRequestModel(code: pin));
                    if(!res.meta.ok){

                      setState(() {
                        isAPIProcess = false;
                      });
                      _showToast(res.meta.messages[0], size);
                    } else {
                      var loginDetails = await SharedService.loginDetails();
                      var dataTags = await APIService.getTags();
                      tagsInit.clear();
                      for (var i in dataTags.data.topics) {
                        tagsInit.add(Topic(id: i.id,title: i.title));
                      }

                      currentUserId = loginDetails.data.userId;
                      role = loginDetails.data.role;

                      var userTopic = await APIService.getUsersTopics();
                      await SharedService.chatService();

                      setState(() {
                        isAPIProcess = false;
                      });
                      Navigator.pushAndRemoveUntil(context, MaterialPageRoute(
                        builder: (context) {
                          if (userTopic.data.topics.length > 0) {
                            return HomeActivity(
                              auth: widget.auth,
                            );
                          } else {
                            return ChooseTopicActivity();
                          }
                        },
                      ), (route) => false);
                    }
                  },
                  submittedFieldDecoration: pinPutDecoration,
                  selectedFieldDecoration: pinPutDecoration,
                  followingFieldDecoration: pinPutDecoration,
                  pinAnimationType: PinAnimationType.scale,
                ),
              ),
              SizedBox(
                height: size.height * 0.025,
              ),
              isAPIProcess ? CupertinoActivityIndicator() : Container(),
              SizedBox(
                height: size.height * 0.025,
              ),
              Text(
                'Didn’t receive code?',
                style: TextStyle(
                  fontSize: 16,
                  color: appPrimaryColor,
                ),
              ),
              SizedBox(
                height: size.height * 0.01,
              ),
              GestureDetector(
                onTap: () async{
                  var res = await APIService.resendEmail(ResendEmailRequestModel(email: widget.email));
                  _showToast(res.meta.messages[0], size);
                },
                child: Text(
                  'Resend',
                  style: TextStyle(
                    fontSize: 16,
                    decoration: TextDecoration.underline,
                    color: appPrimaryColor,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
