import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_app/HomeScreen/HomeActivity.dart';
import 'package:flutter_app/LoginScreen/SignUpActivity.dart';
import 'package:flutter_app/Model/LoginRequestModel.dart';
import 'package:flutter_app/Services/APIService.dart';
import 'package:flutter_app/constants.dart';
import 'package:snippet_coder_utils/FormHelper.dart';
import 'package:snippet_coder_utils/ProgressHUD.dart';

import 'LoginButton.dart';
import 'RoundedPasswordFeild.dart';
import 'RoundedTextField.dart';
import 'TextFieldContainer.dart';

class LoginActivity extends StatefulWidget {
  @override
  _LoginActivityState createState() => _LoginActivityState();
}

class _LoginActivityState extends State<LoginActivity> {
  bool isAPIcallProcess = false;
  bool hidePassword = true;
  GlobalKey<FormState> globalFormKey = GlobalKey<FormState>();
  String username;
  String password;

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
          if (onValidateVal.length < 8){
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
        Container(
          alignment: Alignment.center,
          child: Text(
            "Forgot Password?",
            style: TextStyle(fontSize: 16.0, color: appPrimaryColor),
          ),
        ),
        SizedBox(
          height: size.height * 0.01,
        ),
        Center(
          child: LoginButton(
            text: "Log in",
            press: () {
              if (validateAndSave()) {
                setState(() {
                  isAPIcallProcess = true;
                });
                LoginRequestModel model =
                    LoginRequestModel(username: username, password: password);
                APIService.login(model).then((response) => {
                      setState(() {
                        isAPIcallProcess = false;
                      }),
                      if (response)
                        {
                          Navigator.pushAndRemoveUntil(context,
                              MaterialPageRoute(
                                builder: (context) {
                                  return HomeActivity();
                                },
                              ), (route) => false)
                        }
                      else
                        {
                          showDialog(
                            context: context,
                            builder: (_) => new AlertDialog(
                              title: new Text("ERROR!!!"),
                              content: new Text("Wrong email or password"),
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
                          )
                        }
                    });
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

/*class LoginActivity extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Body(),
    );
  }
}

class Body extends StatelessWidget {
  String username;
  String password;
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Container(
      height: size.height,
      width: double.infinity,
      child: Stack(
        alignment: Alignment.center,
        children: <Widget>[
          SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                SizedBox(
                  height: size.height * 0.06,
                ),
                Text(
                  "Log in",
                  style: TextStyle(
                      fontSize: size.height * 0.03, color: Colors.black),
                ),
                SizedBox(
                  height: size.height * 0.06,
                ),
                FormHelper.inputFieldWidget(context, const Icon(Icons.person), "username", "username",
                    (onValidateVal){
                      if(onValidateVal.isEmpty){
                        return "Username can\'t be empty";
                      }
                      return null;
                    },
                    (onSavedVal){
                      username = onSavedVal;
                    },
                    prefixIconColor: appPrimaryColor,
                    borderRadius: 10,
                  textColor: Colors.black,
                  hintColor: Colors.black,
                  borderFocusColor: appPrimaryColor
                ),

                SizedBox(
                  height: size.height * 0.01,
                ),
                TextFieldContainer(
                  child: RoundedPasswordField(
                    hintText: "Password",
                    controller: passwordController,
                  ),
                ),
                SizedBox(
                  height: size.height * 0.01,
                ),
                Container(
                  child: Text(
                    "Forgot Password?",
                    style: TextStyle(fontSize: 16.0, color: appPrimaryColor),
                  ),
                ),
                SizedBox(
                  height: size.height * 0.03,
                ),
                LoginButton(
                  text: "Log in",
                  press: () {
                    LoginRequestModel model = LoginRequestModel(
                        username: usernameController.value.text,
                        password: passwordController.value.text);
                    APIService.login(model).then((response) => {
                          if (response)
                            {
                              Navigator.pushAndRemoveUntil(context,
                                  MaterialPageRoute(
                                builder: (context) {
                                  return HomeActivity();
                                },
                              ), (route) => false)
                            }
                          else
                            {
                              showDialog(
                                context: context,
                                builder: (_) => new AlertDialog(
                                  title: new Text("ERROR!!!"),
                                  content: new Text(
                                      "Wrong email or password"),
                                  actions: <Widget>[
                                    FlatButton(
                                      child: Text(
                                        "OK",
                                        style:
                                            TextStyle(color: appPrimaryColor),
                                      ),
                                      onPressed: () {
                                        Navigator.of(context).pop();
                                      },
                                    )
                                  ],
                                ),
                              )
                            }
                        });
                  },
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
                        Navigator.pop(context);
                        Navigator.push(context, MaterialPageRoute(
                          builder: (context) {
                            return SignUpActivity();
                          },
                        ));
                      },
                      child: Text(
                        "Sign up",
                        style:
                            TextStyle(fontSize: 16.0, color: appPrimaryColor),
                      ),
                    ),
                  ],
                ),
                SizedBox(
                  height: size.height * 0.05,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  TextEditingController usernameController = new TextEditingController();
  TextEditingController passwordController = new TextEditingController();
}*/
