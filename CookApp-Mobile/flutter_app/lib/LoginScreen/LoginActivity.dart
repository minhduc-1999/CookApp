import 'dart:convert';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_observer/Observable.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:tastify/ChooseTopicScreen/ChooseTopicActivity.dart';
import 'package:tastify/HomeScreen/HomeActivity.dart';
import 'package:tastify/LoginScreen/SignUpActivity.dart';
import 'package:tastify/LoginScreen/VerifyActivity.dart';
import 'package:tastify/Model/LoginByGoogleRequestModel.dart';
import 'package:tastify/Model/LoginRequestModel.dart';
import 'package:tastify/Model/ResendEmailRequestModel.dart';
import 'package:tastify/Model/ResetPasswordRequestModel.dart';
import 'package:tastify/ProfileScreen/EditProfileActivity.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:tastify/Services/Auth.dart';
import 'package:tastify/Services/SharedService.dart';
import 'package:tastify/constants.dart';
import 'package:snippet_coder_utils/FormHelper.dart';
import 'package:snippet_coder_utils/ProgressHUD.dart';

import '../main.dart';
import 'Components/LoginButton.dart';

class LoginActivity extends StatefulWidget {
  final AuthBase auth;

  const LoginActivity({Key key, this.auth}) : super(key: key);

  @override
  _LoginActivityState createState() => _LoginActivityState(this.auth);
}

class _LoginActivityState extends State<LoginActivity> {
  bool hidePassword = true;
  bool isAPIcallProcess = false;
  GlobalKey<FormState> globalFormKey = GlobalKey<FormState>();
  String username;
  String password;
  final AuthBase auth;
  FToast fToast;
  TextEditingController emailResetPassword = TextEditingController();
  _LoginActivityState(this.auth);

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
    return SafeArea(
        child: Scaffold(
      backgroundColor: Colors.white,
      body: ProgressHUD(
        child: Form(
          key: globalFormKey,
          child: _loginUI(context),
        ),
        inAsyncCall: isAPIcallProcess,
        key: UniqueKey(),
        opacity: 0.3,
      ),
    ));
  }

  Future<String> _signInWithGoogle() async {
    String s = "";
    try {
      s = await auth.signInWithGoogle();
    } catch (e) {
      print(e.toString());
    }
    return s;
  }

  Widget _loginUI(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return SingleChildScrollView(
        child: Column(
      mainAxisAlignment: MainAxisAlignment.start,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: size.width,
          height: size.height / 5,
          decoration: const BoxDecoration(
              gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    appPrimaryColor,
                    appPrimaryColor,
                  ]),
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(100),
                bottomRight: Radius.circular(100),
              )),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Align(
                alignment: Alignment.center,
                child: Image.asset("assets/images/AppLogo.png",
                    width: 250, fit: BoxFit.contain),
              ),
            ],
          ),
        ),
        SizedBox(
          height: size.height * 0.05,
        ),
        Container(
          alignment: Alignment.center,
          child: Text(
            "Log in",
            style: TextStyle(fontSize: size.height * 0.04, color: Colors.black),
          ),
        ),
        SizedBox(
          height: size.height * 0.04,
        ),
        FormHelper.inputFieldWidget(
            context, "username", "Username",
            (onValidateVal) {
          if (onValidateVal.isEmpty) {
            return "Username can\'t be empty";
          }
          return null;
        }, (onSavedVal) {
          username = onSavedVal;
        },
            showPrefixIcon: true,
            prefixIcon: const Icon(Icons.person),
            prefixIconColor: appPrimaryColor,
            borderRadius: 10,
            textColor: Colors.black,
            hintColor: Colors.black.withOpacity(0.5),
            borderFocusColor: appPrimaryColor),
        SizedBox(
          height: size.height * 0.015,
        ),
        FormHelper.inputFieldWidget(
            context,  "password", "Password",
            (onValidateVal) {
          if (onValidateVal.isEmpty) {
            return "Password can\'t be empty";
          }
          if (onValidateVal.length < 8) {
            return "Password must have at least 8 characters";
          }
          return null;
        }, (onSavedVal) {
          password = onSavedVal;
        },
            showPrefixIcon: true,
            prefixIcon: const Icon(Icons.vpn_key_rounded),
            prefixIconColor: appPrimaryColor,
            borderRadius: 10,
            textColor: Colors.black,
            hintColor: Colors.black.withOpacity(0.5),
            borderFocusColor: appPrimaryColor,
            obscureText: hidePassword,
            suffixIcon: IconButton(
              onPressed: () {
                setState(() {
                  hidePassword = !hidePassword;
                });
              },
              icon: Icon(
                hidePassword ? Icons.visibility_off : Icons.visibility,
                color: appPrimaryColor,
              ),
            )),
        SizedBox(
          height: size.height * 0.01,
        ),
        Center(
          child: LoginButton(
            text: "Log in",
            press: () async {
              FocusScope.of(context).unfocus();
              if (validateAndSave()) {

                setState(() {
                  isAPIcallProcess = true;
                });
                LoginRequestModel model = LoginRequestModel(username: username, password: password);
                var response = await APIService.login(model);
                if (response.meta.ok) {
                  await SharedService.setLoginDetails(response);
                  if (response.data.emailVerified) {
                    await auth.signInFirebaseWithToken(response.data.loginToken);
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
                      isAPIcallProcess = false;
                    });
                    Navigator.pushAndRemoveUntil(context, MaterialPageRoute(
                      builder: (context) {
                        if (userTopic.data.topics.length > 0) {
                          return HomeActivity(
                                                    auth: auth,
                                                  );
                        } else {
                          return ChooseTopicActivity();
                        }
                      },
                    ), (route) => false);
                  } else if (!response.data.emailVerified) {
                    setState(() {
                      isAPIcallProcess = false;
                    });
                    Navigator.push(
                        context,
                        PageRouteBuilder(
                            pageBuilder: (context, animation,
                                secondaryAnimation) =>
                                VerifyActivity(
                                  email: response.data.email,
                                  auth: this.auth,
                                ),
                            transitionsBuilder: (context,
                                animation,
                                secondaryAnimation,
                                child) {
                              const begin = Offset(1.0, 0.0);
                              const end = Offset.zero;
                              const curve = Curves.easeOut;

                              var tween = Tween(
                                  begin: begin, end: end)
                                  .chain(
                                  CurveTween(curve: curve));

                              return SlideTransition(
                                position:
                                animation.drive(tween),
                                child: child,
                              );
                            }));
                  }
                } else {

                  showDialog(
                    context: context,
                    builder: (_) => new AlertDialog(
                      title: new Text("ERROR!!!"),
                      content: Text( response.meta.messages[0] == "Wrong credentials provided" ? "Wrong username or password" : "There're some error"),
                      actions: <Widget>[
                        FlatButton(
                          child: Text(
                            "OK",
                            style: TextStyle(color: appPrimaryColor),
                          ),
                          onPressed: () {
                            Navigator.of(context).pop();
                            setState(() {
                              isAPIcallProcess = false;
                            });
                          },
                        )
                      ],
                    ),
                  );
                }
              }
            },
          ),
        ),
        Center(
          child: Text(
            "Or",
            style: TextStyle(color: appPrimaryColor),
          ),
        ),
        Center(
          child: LoginButton(
            text: "Log in by Google",
            press: () async {
              String authCode = await _signInWithGoogle();
              print("ln");
              var response = await APIService.loginByGoogle(authCode);
              print("ln");
              if (response.meta.ok) {
                await SharedService.setLoginDetails(response);
                if (response.data.emailVerified) {
                  await auth.signInFirebaseWithToken(response.data.loginToken);
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
                    isAPIcallProcess = false;
                  });
                  Navigator.pushAndRemoveUntil(context, MaterialPageRoute(
                    builder: (context) {
                      if (userTopic.data.topics.length > 0) {
                        return HomeActivity(
                          auth: auth,
                        );
                      } else {
                        return ChooseTopicActivity();
                      }
                    },
                  ), (route) => false);
                } else if (!response.data.emailVerified) {
                  setState(() {
                    isAPIcallProcess = false;
                  });
                  Navigator.push(
                      context,
                      PageRouteBuilder(
                          pageBuilder: (context, animation,
                              secondaryAnimation) =>
                              VerifyActivity(
                                email: response.data.email,
                                auth: this.auth,
                              ),
                          transitionsBuilder: (context,
                              animation,
                              secondaryAnimation,
                              child) {
                            const begin = Offset(1.0, 0.0);
                            const end = Offset.zero;
                            const curve = Curves.easeOut;

                            var tween = Tween(
                                begin: begin, end: end)
                                .chain(
                                CurveTween(curve: curve));

                            return SlideTransition(
                              position:
                              animation.drive(tween),
                              child: child,
                            );
                          }));
                }

              } else {
                showDialog(
                  context: context,
                  builder: (_) => new AlertDialog(
                    title: new Text("ERROR!!!"),
                    content: new Text("There're some error"),
                    actions: <Widget>[
                      FlatButton(
                        child: Text(
                          "OK",
                          style: TextStyle(color: appPrimaryColor),
                        ),
                        onPressed: () {
                          Navigator.of(context).pop();
                        },
                      )
                    ],
                  ),
                );
                try {
                  await widget.auth.signOut();
                } catch (e) {
                  print(e.toString());
                }
              }
            },
          ),
        ),
        SizedBox(
          height: size.height * 0.01,
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              "Don't have an account? ",
              style: TextStyle(color: Colors.black),
            ),
            GestureDetector(
              onTap: () {
                Navigator.pushNamed(context, '/signup');
              },
              child: Text(
                "Sign up",
                style: TextStyle( color: appPrimaryColor),
              ),
            ),
          ],
        ),
        SizedBox(
          height: size.height * 0.01,
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              "Forgot password? ",
              style: TextStyle(color: Colors.black),
            ),
            GestureDetector(
              onTap: () {
                showDialog(
                  context: context,
                  builder: (_) => new AlertDialog(
                    title: Text("Your Email"),
                    content: TextField(
                      cursorColor: appPrimaryColor,
                      controller: emailResetPassword,
                      decoration: InputDecoration(
                          hintText: "Enter your email",
                          enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: appPrimaryColor),
                    ),
                    focusedBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: appPrimaryColor),
                    ),

                  ),
                    ),
                    actions: <Widget>[
                      FlatButton(
                        child: Text(
                          "SUMMIT",
                          style: TextStyle(color: appPrimaryColor),
                        ),
                        onPressed: () async{
                          Navigator.of(context).pop();
                          var res = await APIService.resetPassword(ResetPasswordRequestModel(email: emailResetPassword.text));
                          _showToast(res.meta.messages[0], size);
                          },
                      )
                    ],
                  ),
                );
              },
              child: Text(
                "Reset password",
                style: TextStyle( color: appPrimaryColor),
              ),
            ),
          ],
        ),
      ],
    ));
  }

  bool validateAndSave() {
    final form = globalFormKey.currentState;
    if (form.validate()) {
      form.save();
      return true;
    } else {
      return false;
    }
  }
}
