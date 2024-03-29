import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:tastify/SettingsScreen/ChangePasswordActivity.dart';
import 'package:tastify/SettingsScreen/NotificationSettingsActivity.dart';

import '../config.dart';
import '../constants.dart';
class SettingsActivity extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        brightness: Brightness.dark,
        title: Text(
          Config.settings,

        ),
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: <Color>[appPrimaryColor, appPrimaryColor],
            ),
          ),
        ),
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
      ),
      body: SingleChildScrollView(
        child: Container(
          margin: EdgeInsets.fromLTRB(5, 10, 5, 10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ListTile(
                leading: Icon(
                  Icons.notifications_none,
                  color: Colors.black,
                ),
                title: Text("Notifications", style: TextStyle(fontSize: 16),),
                onTap: (){
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => NotificationSettingsActivity()),
                  );
                },
              ),
              ListTile(
                leading: Icon(
                  Icons.vpn_key_outlined,
                  color: Colors.black,
                ),
                title: Text("Change Password", style: TextStyle(fontSize: 16),),
                onTap: (){
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => ChangePasswordActivity()),
                  );
                },
              )
            ],
          ),
        ),
      ),
    );
  }
}

