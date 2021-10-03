import 'package:flutter/material.dart';
import 'package:flutter_app/LoginScreen/LoginActivity.dart';
import 'package:flutter_app/LoginScreen/LoginButton.dart';
import 'package:flutter_app/LoginScreen/TextFieldContainer.dart';

import '../constants.dart';
import 'RoundedPasswordFeild.dart';
import 'RoundedTextField.dart';

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
                /*TextFieldContainer(
                  child: RoundedTextField(
                    icon: Icons.email,
                    controller: emailController,
                    hintText: "Email",
                  ),
                ),*/
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
}