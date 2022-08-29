import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:snippet_coder_utils/ProgressHUD.dart';
import 'package:string_to_hex/string_to_hex.dart';
import 'package:tastify/Model/EditProfileRespondModel.dart';
import 'package:tastify/Model/EditUserRequestModel.dart';
import 'package:tastify/Model/InterestTopicRequestModel.dart';
import 'package:tastify/Model/PresignedLinkedRequestModel.dart';
import 'package:tastify/Model/UserInterestedTopicsRespondModel.dart';
import 'package:tastify/Model/UserRespondModel.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import 'package:tastify/UploadScreen/TagsActivity.dart';

import '../constants.dart';
import '../main.dart';

class EditProfileActivity extends StatefulWidget {
  @override
  _EditProfileActivityState createState() => _EditProfileActivityState();
}

class _EditProfileActivityState extends State<EditProfileActivity> {
  UserRespondModel user;
  bool circular = true;
  DateTime _selectedDate;
  String _groupsexual;
  bool femaleSelected = false;
  File file;
  bool isAPIcallProcess = false;
  GlobalKey<FormState> globalFormKey = GlobalKey<FormState>();
  ImagePicker imagePicker = ImagePicker();

  TextEditingController firstNameController = TextEditingController();
  TextEditingController lastNameController = TextEditingController();
  TextEditingController birthDayController = TextEditingController();
  TextEditingController heightController = TextEditingController();
  TextEditingController weightController = TextEditingController();
  TextEditingController displayNameController = TextEditingController();
  TextEditingController bioController = TextEditingController();
  FToast fToast;


  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    fToast = FToast();
    fToast.init(context);
    fetchData();
  }

  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;
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
          actions: [
            IconButton(
                onPressed: () async {
                  FocusScope.of(context).unfocus();
                  setState(() {
                    isAPIcallProcess = true;
                  });
                  String objectName;
                  if (file != null) {
                    List<String> names = [];
                    names.add(
                        file.path.substring(file.path.lastIndexOf("/") + 1));
                    var response = await APIService.getPresignedLink(
                        PresignedLinkedRequestModel(fileNames: names));
                    await APIService.uploadImage(
                        file, response.data.items[0].signedLink);
                    objectName = response.data.items[0].objectName;
                  }
                  EditUserRequestModel profile = EditUserRequestModel(
                    displayName: displayNameController.text,
                    avatar: file != null ? objectName : "",
                    bio: bioController.text,
                    height: int.parse(heightController.text != ""
                        ? heightController.text
                        : "0"),
                    weight: int.parse(weightController.text != ""
                        ? weightController.text
                        : "0"),
                    birthDate: DateTime.now().microsecondsSinceEpoch,
                    firstName: firstNameController.text,
                    lastName: lastNameController.text,
                    sex: _groupsexual,
                  );
                  EditProfileRespondModel response =
                      await APIService.editProfile(profile);

                  setState(() {
                    isAPIcallProcess = false;
                  });
                  _showToast(response.meta.messages[0], size);
                  if (response.meta.ok) {
                    Navigator.of(context).pop();
                  }
                },
                icon: Icon(Icons.check))
          ],
        ),
        body: circular
            ? Center(
                child: CircularProgressIndicator(),
              )
            : ProgressHUD(
                child: Form(
                  key: globalFormKey,
                  child: _editProfileUI(context),
                ),
                inAsyncCall: isAPIcallProcess,
                key: UniqueKey(),
                opacity: 0.3,
              ));
  }

  Widget _editProfileUI(BuildContext context) {
    return Container(
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
                            width: 1, color: Colors.black.withOpacity(0.2)),
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
                            image: file != null
                                ? new FileImage(file)
                                : user.data.avatar != null
                                    ? NetworkImage(user.data.avatar.url)
                                    : AssetImage(
                                        'assets/images/default_avatar.png'))),
                  ),
                  Positioned(
                      bottom: 0,
                      right: 0,
                      child: GestureDetector(
                        onTap: () async {
                          PickedFile imageFile = await imagePicker.getImage(
                              source: ImageSource.gallery,
                              maxWidth: 1920,
                              maxHeight: 1200,
                              imageQuality: 80);
                          if (imageFile != null) {
                            setState(() {
                              file = File(imageFile.path);
                            });
                          }
                        },
                        child: Container(
                          height: 35,
                          width: 35,
                          decoration: BoxDecoration(
                              shape: BoxShape.circle, color: appPrimaryColor),
                          child: Icon(
                            Icons.edit,
                            color: Colors.white,
                          ),
                        ),
                      ))
                ],
              ),
            ),
            buildName("First Name", firstNameController),
            buildName("Last Name", lastNameController),
            buildName("Display Name", displayNameController),
            buildName("Bio", bioController),
            buildWeightAndHeight("Height (cm)", heightController),
            buildWeightAndHeight("Weight (kg)", weightController),
            buildSexual(),
            SizedBox(
              height: 10,
            ),

          ],
        ),
      ),
    );
  }

  Widget buildName(String label, TextEditingController controller) {
    return TextField(
      maxLines: 5,
      minLines: 1,
      controller: controller,
      decoration: InputDecoration(
          labelText: label,
          hintStyle: TextStyle(
            fontSize: 16,
            color: Colors.grey.withOpacity(0.3),
          )),
    );
  }

  Widget buildWeightAndHeight(String label, TextEditingController controller) {
    return TextField(
      controller: controller,
      keyboardType: TextInputType.number,
      decoration: InputDecoration(
          labelText: label,
          hintStyle: TextStyle(
            fontSize: 16,
            color: Colors.grey.withOpacity(0.3),
          )),
    );
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

  void fetchData() async {
    var response = await APIService.getUser();

    setState(() {
      user = response;

      circular = false;
      if (user.data.profile.firstName != null) {
        firstNameController.text = user.data.profile.firstName;
      }
      if (user.data.profile.bio != null) {
        bioController.text = user.data.profile.bio;
      }
      if (user.data.profile.lastName != null) {
        lastNameController.text = user.data.profile.lastName;
      }
      if (user.data.profile.birthDate != null) {
        birthDayController.text =
            DateTime.fromMicrosecondsSinceEpoch(user.data.profile.birthDate)
                .toString();
      }
      if (user.data.displayName != null) {
        displayNameController.text = user.data.displayName;
      }
      if (user.data.profile.height != null) {
        heightController.text = user.data.profile.height.toString();
      }
      if (user.data.profile.weight != null) {
        weightController.text = user.data.profile.weight.toString();
      }
      if (user.data.profile.sex != null) {
        if (user.data.profile.sex == "MALE") {
          _groupsexual = "MALE";
        } else if (user.data.profile.sex == "FEMALE") {
          _groupsexual = "FEMALE";
        }
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
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              SizedBox(
                width: 20,
              ),
              Radio(
                value: "MALE",
                groupValue: _groupsexual,
                onChanged: (value) {
                  setState(() {
                    _groupsexual = value;
                  });
                },
              ),
              Text(
                "Male",
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.black,
                ),
              ),
              SizedBox(
                width: 40,
              ),
              Radio(
                value: "FEMALE",
                groupValue: _groupsexual,
                onChanged: (value) {
                  setState(() {
                    _groupsexual = value;
                  });
                },
              ),
              Text(
                "Female",
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.black,
                ),
              ),
            ],
          ),
        ]));
  }

  Widget itemGender(String value) {
    return Row(
      children: [
        Radio(
          value: value,
          groupValue: _groupsexual,
          onChanged: (value) {
            this._groupsexual = value;
          },
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 16,
            color: Colors.black,
          ),
        ),
      ],
    );
  }

  applyChanges() async {
    setState(() {
      isAPIcallProcess = true;
    });
    String objectName;
    if (file != null) {
      List<String> names = [];

      names.add(file.path.substring(file.path.lastIndexOf("/") + 1));
      var response = await APIService.getPresignedLink(
          PresignedLinkedRequestModel(fileNames: names));
      await APIService.uploadImage(file, response.data.items[0].signedLink);
      objectName = response.data.items[0].objectName;
    }
    EditUserRequestModel profile = EditUserRequestModel(
      displayName: displayNameController.text,
      avatar: file != null ? objectName : user.data.avatar,
      height: int.parse(heightController.text),
      weight: int.parse(weightController.text),
      birthDate: DateTime.now().microsecondsSinceEpoch,
      firstName: firstNameController.text,
      lastName: lastNameController.text,
      sex: _groupsexual,
    );
    EditProfileRespondModel response = await APIService.editProfile(profile);

    setState(() {
      isAPIcallProcess = false;
    });
  }
}

class AlwaysDisabledFocusNode extends FocusNode {
  @override
  bool get hasFocus => false;
}

class Topic {
  String id;
  String title;

  Topic({this.id, this.title});
}
