import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_app/Model/UserRespondModel.dart';
import 'package:flutter_app/Services/APIService.dart';
import 'package:intl/intl.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';

import '../constants.dart';

class EditProfileActivity extends StatefulWidget {
  @override
  _EditProfileActivityState createState() => _EditProfileActivityState();
}

class _EditProfileActivityState extends State<EditProfileActivity> {
  UserRespondModel user;
  bool circular = true;
  DateTime _selectedDate;
  String _sexual;
  bool femaleSelected = false;
  List<bool> _isSelected = [false, false];
  TextEditingController firstNameController = TextEditingController();
  TextEditingController lastNameController = TextEditingController();
  TextEditingController birthDayController = TextEditingController();
  TextEditingController heightController = TextEditingController();
  TextEditingController weightController = TextEditingController();
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    fetchData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        brightness: Brightness.dark,
        automaticallyImplyLeading: false,
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: <Color>[appPrimaryColor, appPrimaryColor],
            ),
          ),
        ),
        title: Container(
          child: Text("Edit Profile"),
        ),
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        actions: [IconButton(onPressed: () {}, icon: Icon(Icons.check))],
      ),
      body: circular ? Center(child: CircularProgressIndicator())
          : Container(
        padding: EdgeInsets.only(left: 15, top: 25, right: 15),
        child: GestureDetector(
          onTap: () {
            FocusScope.of(context).unfocus();
          },
          child: ListView(
            children: [
              Center(
                child: Stack(
                  children: [
                    Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                          border: Border.all(
                              width: 1,
                              color: Colors.black.withOpacity(0.2)),
                          boxShadow: [
                            BoxShadow(
                                spreadRadius: 2,
                                blurRadius: 10,
                                color: Colors.black.withOpacity(0.1),
                                offset: Offset(0, 10))
                          ],
                          shape: BoxShape.circle,
                          image: DecorationImage(
                              fit: BoxFit.cover,
                              image: user.data.avatar != null
                                  ? NetworkImage(user.data.avatar)
                                  : AssetImage(
                                      'assets/images/default_avatar.png'))),
                    ),
                    Positioned(
                        bottom: 0,
                        right: 0,
                        child: Container(
                          height: 35,
                          width: 35,
                          decoration: BoxDecoration(
                              shape: BoxShape.circle, color: appPrimaryColor),
                          child: Icon(
                            Icons.edit,
                            color: Colors.white,
                          ),
                        ))
                  ],
                ),
              ),
              buildName("First Name", "Enter your first name", firstNameController),
              buildName("Last Name", "Enter your last name", lastNameController),
              buildWeightAndHeight("Height (cm)", "cm", heightController),
              buildWeightAndHeight("Weight (kg)", "kg", weightController),
              buildSexual()
            ],
          ),
        ),
      ),
    );
  }

  Widget buildName(String label, String hintText, TextEditingController controller) {
    return TextField(
              controller: controller,
              decoration: InputDecoration(
                  labelText: label,
                  hintText: hintText,
                  hintStyle: TextStyle(
                    fontSize: 16,
                    color: Colors.grey.withOpacity(0.3),
                  )),
            );
  }
  Widget buildWeightAndHeight(String label, String hintText, TextEditingController controller) {
    return TextField(
      controller: controller,
      keyboardType: TextInputType.number,
      decoration: InputDecoration(
          labelText: label,
          hintText: hintText,
          hintStyle: TextStyle(
            fontSize: 16,
            color: Colors.grey.withOpacity(0.3),
          )),
    );
  }

  void fetchData() async {
    var response = await APIService.getUser();
    setState(() {
      user = response;
      circular = false;
      if(user.data.profile.firstName != null){
        firstNameController.text = user.data.profile.firstName;
      }
      if(user.data.profile.lastName != null){
        lastNameController.text = user.data.profile.lastName;
      }
      if(user.data.profile.birthDate != null){
        birthDayController.text = DateTime.fromMicrosecondsSinceEpoch(user.data.profile.birthDate).toString();
      }
    });
  }
  Widget buildTextBirthDay() {
    return TextField(
      focusNode: new AlwaysDisabledFocusNode(),
      controller: birthDayController,
      decoration: InputDecoration(
        labelText: "Birth day",

        hintText: "Birth day",
        hintStyle: TextStyle(
          fontSize: 16,
          color: Colors.grey.withOpacity(0.3),
        ),
        floatingLabelBehavior: FloatingLabelBehavior.always,
      ),
      onTap: () {
        _selectDate(context);
      },
    );
  }

  _selectDate(BuildContext context) async {
    DateTime newSelectedDate = await showDatePicker(
        context: context,
        initialDate: _selectedDate != null ? _selectedDate : DateTime.now(),
        firstDate: DateTime(2000),
        lastDate: DateTime(2040),
        builder: (BuildContext context, Widget child) {
          return Theme(
            data: ThemeData.dark().copyWith(
              colorScheme: ColorScheme.dark(
                primary: Colors.deepPurple,
                onPrimary: Colors.white,
                surface: Colors.blueGrey,
                onSurface: Colors.black,
              ),
              dialogBackgroundColor: Colors.blue[50],
            ),
            child: child,
          );
        });

    if (newSelectedDate != null) {
      _selectedDate = newSelectedDate;
      birthDayController
        ..text = DateFormat.yMMMd().format(_selectedDate)
        ..selection = TextSelection.fromPosition(TextPosition(
            offset: birthDayController.text.length,
            affinity: TextAffinity.upstream));
    }
  }
  Widget buildSexual() {
    return Padding(
        padding: EdgeInsets.fromLTRB(0, 14, 0, 0),
        child: Row(children: [
          Text(
            "Sex: ",
            style: TextStyle(
              fontSize: 16,
              color: Colors.black,
            ),
          ),
          Divider(),
          ToggleButtons(
              isSelected: _isSelected,
              renderBorder: false,
              selectedColor: femaleSelected
                  ? Colors.pink[400]
                  : Color.fromRGBO(63, 229, 235, 1),

              fillColor: Theme.of(context).scaffoldBackgroundColor,
              children: <Widget>[
                buildMaleIconButton(),
                buildFemaleIconButton(),
              ],
              onPressed: (int newIndex) {
                if (newIndex == 0) {
                  _isSelected[0] = true;
                  _isSelected[1] = false;
                  setState(() {
                    femaleSelected = false;
                    _sexual = "Male";
                  });
                } else if (newIndex == 1) {
                  _isSelected[0] = false;
                  _isSelected[1] = true;
                  setState(() {
                    femaleSelected = true;
                    _sexual = "Female";
                  });
                }
              })
        ]));
  }

  Widget buildMaleIconButton() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(15, 0, 15, 0),
      child: Row(
        children: [
          IconButton(
            icon: Icon(MdiIcons.humanMale,
                color: femaleSelected
                    ? Colors.black26
                    : Color.fromRGBO(63, 229, 235, 1)),
          ),
          Text('Male', style: TextStyle(fontSize: 16))
        ],
      ),
    );
  }

  Widget buildFemaleIconButton() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(15, 0, 15, 0),
      child: Row(
        children: [
          IconButton(
            icon: Icon(MdiIcons.humanFemale,
                color: femaleSelected ? Colors.pink[400] : Colors.black26),
          ),
          Text('Female', style: TextStyle(fontSize: 16))
        ],
      ),
    );
  }
}
class AlwaysDisabledFocusNode extends FocusNode {
  @override
  bool get hasFocus => false;
}