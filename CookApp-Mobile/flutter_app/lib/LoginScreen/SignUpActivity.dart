import 'package:flutter/material.dart';
import 'package:tastify/LoginScreen/LoginActivity.dart';
import 'package:tastify/LoginScreen/LoginButton.dart';
import 'package:tastify/LoginScreen/TextFieldContainer.dart';
import 'package:tastify/Model/RegisterRequestModel.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:snippet_coder_utils/FormHelper.dart';
import 'package:snippet_coder_utils/ProgressHUD.dart';

import '../config.dart';
import '../constants.dart';
import 'RoundedPasswordFeild.dart';
import 'RoundedTextField.dart';

class SignUpActivity extends StatefulWidget {
  @override
  _SignUpActivityState createState() => _SignUpActivityState();
}

class _SignUpActivityState extends State<SignUpActivity> {
  bool isAPIcallProcess = false;
  GlobalKey<FormState> globalFormKey = GlobalKey<FormState>();
  bool hidePassword = true;

  String username;
  String password;
  String email;
  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: Scaffold(
          backgroundColor: Colors.white,
          body: ProgressHUD(
            child: Form(
              key: globalFormKey,
              child: _registerUI(context),
            ),
            inAsyncCall: isAPIcallProcess,
            key: UniqueKey(),
            opacity: 0.3,
          ),
        ));
  }
  Widget _registerUI(BuildContext context) {
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
                "Register",
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
                context, "password", "Password",
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
              height: size.height * 0.015,
            ),
            FormHelper.inputFieldWidget(
                context, "email", "Email",
                    (onValidateVal) {
                  if (onValidateVal.isEmpty) {
                    return "Email can\'t be empty";
                  }
                  return null;
                }, (onSavedVal) {
              email = onSavedVal;
            },
                showPrefixIcon: true,
                prefixIcon: const Icon(Icons.email),
                prefixIconColor: appPrimaryColor,
                borderRadius: 10,
                textColor: Colors.black,
                hintColor: Colors.black.withOpacity(0.5),
                borderFocusColor: appPrimaryColor),
            SizedBox(
              height: size.height * 0.015,
            ),
            Center(
              child: LoginButton(
                text: "Register",
                press: () {
                  FocusScope.of(context).unfocus();
                  if (validateAndSave()) {

                    setState(() {
                      isAPIcallProcess = true;
                    });
                    RegisterRequestModel model = RegisterRequestModel(
                      username: username,
                      password: password,
                      email: email,
                    );
                    APIService.register(model).then((response) => {
                      setState(() {
                        isAPIcallProcess = false;
                      }),
                      if (response.data != null)
                        {
                          showDialog(
                            context: context,
                            builder: (_) => new AlertDialog(
                              title: new Text(Config.appName),
                              content: new Text("Sign up successfull. Please login to the account."),
                              actions: <Widget>[
                                FlatButton(
                                  child: Text(
                                    "OK",
                                    style: TextStyle(color: appPrimaryColor),
                                  ),
                                  onPressed: () {
                                    Navigator.of(context).pop();
                                    Navigator.push(context, MaterialPageRoute(
                                      builder: (context) {
                                        return LoginActivity();
                                      },
                                    ));
                                  },
                                )
                              ],
                            ),
                          )
                        }
                      else
                        {

                          showDialog(
                            context: context,
                            builder: (_) => new AlertDialog(
                              title: new Text(Config.appName),
                              //content: new Text(response.meta.messages.toString()),
                              content: new Text(response.meta.errorCode),
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
                Text("Already an account? ",
                    style: TextStyle(
                      fontSize: 16.0,)),
                GestureDetector(
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(context, MaterialPageRoute(
                      builder: (context) {
                        return LoginActivity();
                      },
                    ));
                  },
                  child: Text(
                    "Login here",
                    style: TextStyle(color: appPrimaryColor,
                      fontSize: 16.0,),
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

/*
class SignUpActivity extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Body(),
    );
  }

}

class Body extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery
        .of(context)
        .size;

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
                  "Sign Up",
                  style: TextStyle(
                      fontSize: size.height * 0.03, color: Colors.black),
                ),
                SizedBox(
                  height: size.height * 0.05,
                ),
                */
/*TextFieldContainer(
                  child: RoundedTextField(
                    icon: Icons.email,
                    controller: emailController,
                    hintText: "Email",
                  ),
                ),*//*

                TextFieldContainer(
                  child: RoundedTextField(
                    icon: Icons.person,
                    controller: usernameController,
                    hintText: "Username",
                  ),
                ),
                TextFieldContainer(
                  child: RoundedPasswordField(
                    hintText: "Password",
                    controller: passwordController,
                  ),
                ),
                TextFieldContainer(
                  child: RoundedPasswordField(
                    hintText: "Confirm Password",
                    controller: repeatPasswordController,
                  ),
                ),
                LoginButton(
                  text: "Sign up",
                  press: () {

                  },
                ),
                SizedBox(
                  height: size.height * 0.01,
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    Text("Already an account? ",
                        style: TextStyle(
                  fontSize: 16.0,)),
                    GestureDetector(
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.push(context, MaterialPageRoute(
                          builder: (context) {
                            return LoginActivity();
                          },
                        ));
                      },
                      child: Text(
                        "Login here",
                        style: TextStyle(color: appPrimaryColor,
                          fontSize: 16.0,),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  //TextEditingController emailController = new TextEditingController();
  TextEditingController passwordController = new TextEditingController();
  TextEditingController usernameController = new TextEditingController();
  TextEditingController repeatPasswordController = new TextEditingController();
}*/
