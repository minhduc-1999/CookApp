import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:image_picker/image_picker.dart';
import 'package:snippet_coder_utils/ProgressHUD.dart';
import 'package:tastify/Model/EditPostRequestModel.dart';
import 'package:tastify/Model/NewFeedRespondModel.dart';
import 'package:tastify/Model/PresignedLinkedRequestModel.dart';
import 'package:tastify/Services/APIService.dart';

import '../constants.dart';

class EditPostActivity extends StatefulWidget {
  final String id;
  final List<Medias> medias;
  final String content;
  final String displayName;
  final String avatar;
  final String location;

  const EditPostActivity(
      {Key key,
      this.id,
      this.medias,
      this.content,
      this.displayName,
      this.avatar,
      this.location,
      })
      : super(key: key);

  @override
  _EditPostActivityState createState() => _EditPostActivityState(
      id: this.id,
      medias: this.medias,
      content: this.content,
      displayName: this.displayName,
      avatar: this.avatar,
  location: this.location);
}

class _EditPostActivityState extends State<EditPostActivity> {
  String id;
  List<Medias> medias;
  List<String> deleteImages = [];
  String content;
  String location;
  final String displayName;
  final String avatar;
  List<File> files = [];
  ImagePicker imagePicker = ImagePicker();

  bool isAPIcallProcess = false;
  GlobalKey<FormState> globalFormKey = GlobalKey<FormState>();

  TextEditingController contentController = TextEditingController();

  _EditPostActivityState(
      {this.id, this.medias, this.content, this.displayName, this.avatar, this.location});

/*  Widget buildPostHeader() {
    return ListTile(
      leading: (avatar != null)
          ? CircleAvatar(
              backgroundColor: Colors.grey,
              backgroundImage: NetworkImage(avatar),
            )
          : CircleAvatar(
              *//*child: Image.asset("assets/images/default_avatar.png",
                                    width: size.width * 0.20,
                                    height: size.width * 0.20,
                                    fit: BoxFit.fill),*//*
              backgroundColor: Colors.grey,
              backgroundImage: AssetImage('assets/images/default_avatar.png')),
      title: GestureDetector(
        child: displayName != null
            ? Text(displayName,
                style:
                    TextStyle(color: Colors.black, fontWeight: FontWeight.bold))
            : Text("user",
                style: TextStyle(
                    color: Colors.black, fontWeight: FontWeight.bold)),
        onTap: () {},
      ),
    );
  }*/
  Widget buildPostHeader() {
    final double width = MediaQuery.of(context).size.width;
    return Padding(
      padding: const EdgeInsets.only(left: 15, right: 0, top: 3, bottom: 3),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          (avatar != null)
              ? CircleAvatar(
            radius: 17,
            backgroundColor: Colors.grey,
            backgroundImage: NetworkImage(avatar),
          )
              : CircleAvatar(
            /*child: Image.asset("assets/images/default_avatar.png",
                                      width: size.width * 0.20,
                                      height: size.width * 0.20,
                                      fit: BoxFit.fill),*/
              radius: 17,
              backgroundColor: Colors.grey,
              backgroundImage:
              AssetImage('assets/images/default_avatar.png')),
          SizedBox(
            width: width * 0.04,
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              displayName != null
                    ? Text(displayName, style: TextStyle(
                color: Colors.black,
                fontWeight: FontWeight.bold,
              ))
                    : Text("user", style: TextStyle(
                color: Colors.black,
                fontWeight: FontWeight.bold,
              )),

              location != null ? Text(location, style: TextStyle(fontSize: 12),) : Container()
            ],
          ),
        ],
      ),
    );
  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    setState(() {
      contentController.text = this.content;
    });
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
            child: Text(
              "Edit Post",
            ),
          ),
          leading: IconButton(
            icon: Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () {
              Navigator.of(context).pop();
            },
          ),
          actions: [
            IconButton(
                onPressed: () async {
                  if (files != null) {
                    setState(() {
                      isAPIcallProcess = true;
                    });
                    List<String> names = [];
                    for (var i in files) {
                      names.add(i.path.substring(i.path.lastIndexOf("/") + 1));
                    }
                    List<String> objectName = [];
                    var response = await APIService.getPresignedLink(
                        PresignedLinkedRequestModel(fileNames: names));
                    for (int i = 0; i < response.data.items.length; i++) {
                      await APIService.uploadImage(
                          files[i], response.data.items[i].signedLink);
                      objectName.add(response.data.items[i].objectName);
                    }
                    await APIService.editPost(
                        EditPostRequestModel(
                            content: contentController.text,
                            addImages: objectName,
                            deleteImages: deleteImages,
                            name: "string",
                            location: location),
                        this.id);
                    setState(() {
                      isAPIcallProcess = false;
                    });
                    Navigator.of(context).pop();
                  }
                },
                icon: Icon(Icons.check))
          ],
        ),
        body: ProgressHUD(
          child: Form(
            key: globalFormKey,
            child: _editPostUI(context),
          ),
          inAsyncCall: isAPIcallProcess,
          key: UniqueKey(),
          opacity: 0.3,
        ));
  }

  Widget _editPostUI(BuildContext context) {
    final double height = MediaQuery.of(context).size.height;
    return SingleChildScrollView(
      child: Column(
        children: [
          SizedBox(height: 7,),
          buildPostHeader(),
          Padding(
            padding: const EdgeInsets.only(left: 16, right: 16, bottom: 8),
            child: TextFormField(
              maxLines: null,
              controller: contentController,
              cursorColor: appPrimaryColor,
              decoration: InputDecoration(
                border: InputBorder.none,
              ),
            ),
          ),
          ...medias.map((item) {
            return _imageNetwork(item, height);
          }),
          ...files.map((item) {
            return _imageFile(item, height);
          }),
          SizedBox(
            height: 10,
          ),
          GestureDetector(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                IconButton(
                  onPressed: () {},
                  icon: Icon(Icons.add_to_photos),
                  color: appPrimaryColor,
                  iconSize: 32,
                ),
                Text(
                  "Add more",
                  style: TextStyle(
                      fontSize: 16,
                      color: appPrimaryColor,
                      fontWeight: FontWeight.bold),
                )
              ],
            ),
            onTap: () async {
              List<XFile> imageFiles = await imagePicker.pickMultiImage();
              if (imageFiles.isNotEmpty) {
                List<File> temp = [];
                for (var image in imageFiles) {
                  temp.add(File(image.path));
                }
                setState(() {
                  files.addAll(temp);
                });
              }
            },
          ),
          SizedBox(
            height: 20,
          ),
        ],
      ),
    );
  }

  Widget _imageNetwork(Medias image, double height) {
    return Container(
      margin: EdgeInsets.all(5),
      child: Stack(
        children: [
          ClipRRect(
            child: Image.network(
              image.url,
              fit: BoxFit.cover,
              width: 1000.0,
              height: height * 0.5,
            ),
          ),
          Positioned(
              top: 10,
              right: 10,
              child: GestureDetector(
                onTap: () {
                  setState(() {
                    medias.remove(image);
                    deleteImages.add(image.url);
                  });
                },
                child: Container(
                  height: 35,
                  width: 35,
                  child: Icon(
                    Icons.clear,
                    color: Colors.white.withOpacity(0.8),
                  ),
                ),
              ))
        ],
      ),
    );
  }

  Widget _imageFile(File file, double height) {
    return Container(
      margin: EdgeInsets.all(5),
      child: Stack(
        children: [
          ClipRRect(
            child: Image.file(
              file,
              fit: BoxFit.cover,
              width: 1000.0,
              height: height * 0.5,
            ),
          ),
          Positioned(
              top: 10,
              right: 10,
              child: GestureDetector(
                onTap: () {
                  setState(() {
                    files.remove(file);
                  });
                },
                child: Container(
                  height: 35,
                  width: 35,
                  child: Icon(
                    Icons.clear,
                    color: Colors.white.withOpacity(0.8),
                  ),
                ),
              ))
        ],
      ),
    );
  }
}
