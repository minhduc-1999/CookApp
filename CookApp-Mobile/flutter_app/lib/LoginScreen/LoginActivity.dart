

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_app/LoginScreen/SignUpActivity.dart';
import 'package:flutter_app/constants.dart';

import 'LoginButton.dart';
import 'RoundedPasswordFeild.dart';
import 'RoundedTextField.dart';
import 'TextFieldContainer.dart';

class LoginActivity extends StatelessWidget {
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
                TextFieldContainer(
                  child: RoundedTextField(
                    controller: usernameController,
                    hintText: "Username",
                  ),
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
                    style: TextStyle(
                        fontSize: 16.0,
                        color: appPrimaryColor),
                  ),
                ),
                SizedBox(
                  height: size.height * 0.03,
                ),
                LoginButton(
                  text: "Log in",
                  press: () {
                  },
                ),
                SizedBox(
                  height: size.height * 0.01,
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    Text("Don't have an account? ",
                        style: TextStyle(
                          color: Colors.black
                        ),
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
                        style: TextStyle(
                            fontSize: 16.0,
                            color: appPrimaryColor),
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
}

