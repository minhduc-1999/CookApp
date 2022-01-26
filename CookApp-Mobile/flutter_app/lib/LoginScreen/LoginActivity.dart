import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:tastify/HomeScreen/HomeActivity.dart';
import 'package:tastify/LoginScreen/SignUpActivity.dart';
import 'package:tastify/Model/LoginByGoogleRequestModel.dart';
import 'package:tastify/Model/LoginRequestModel.dart';
import 'package:tastify/Model/ResendEmailRequestModel.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:tastify/Services/Auth.dart';
import 'package:tastify/Services/SharedService.dart';
import 'package:tastify/constants.dart';
import 'package:snippet_coder_utils/FormHelper.dart';
import 'package:snippet_coder_utils/ProgressHUD.dart';

import 'LoginButton.dart';

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

  _LoginActivityState(this.auth);

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
            context, const Icon(Icons.person), "username", "Username",
            (onValidateVal) {
          if (onValidateVal.isEmpty) {
            return "Username can\'t be empty";
          }
          return null;
        }, (onSavedVal) {
          username = onSavedVal;
        },
            prefixIconColor: appPrimaryColor,
            borderRadius: 10,
            textColor: Colors.black,
            hintColor: Colors.black.withOpacity(0.5),
            borderFocusColor: appPrimaryColor),
        SizedBox(
          height: size.height * 0.015,
        ),
        FormHelper.inputFieldWidget(
            context, const Icon(Icons.vpn_key_rounded), "password", "Password",
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
              if (validateAndSave()) {
                setState(() {
                  isAPIcallProcess = true;
                });
                LoginRequestModel model = LoginRequestModel(username: username, password: password);
                var response = await APIService.login(model);
                if (response.meta.ok) {
                  if (response.data.emailVerified) {
                    //await auth.signInFirebaseWithToken(response.data.loginToken);
                    await SharedService.setLoginDetails(response);
                    setState(() {
                      isAPIcallProcess = false;
                    });
                    Navigator.pushAndRemoveUntil(context, MaterialPageRoute(
                      builder: (context) {
                        return HomeActivity(
                          auth: auth,
                        );
                      },
                    ), (route) => false);
                  } else if (!response.data.emailVerified) {
                    setState(() {
                      isAPIcallProcess = false;
                    });
                    showDialog(
                      context: context,
                      builder: (_) => new AlertDialog(
                        title: new Text("NOTIFICATION"),
                        content: new Text("Please confirm your email first!"),
                        actions: <Widget>[
                          TextButton(
                            child: Text(
                              "RESEND",
                              style: TextStyle(color: appPrimaryColor),
                            ),
                            onPressed: () {
                              APIService.resendEmail(
                                  ResendEmailRequestModel(
                                      email: response.data.email),
                                  response.data.accessToken);
                            },
                          ),
                          TextButton(
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
              String idToken = await _signInWithGoogle();
              var response = await APIService.loginByGoogle(
                  LoginByGoogleRequestModel(idToken: idToken));
              if (response) {
                Navigator.pushAndRemoveUntil(context, MaterialPageRoute(
                  builder: (context) {
                    return HomeActivity(
                      auth: auth,
                    );
                  },
                ), (route) => false);
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
                style: TextStyle(fontSize: 16.0, color: appPrimaryColor),
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
