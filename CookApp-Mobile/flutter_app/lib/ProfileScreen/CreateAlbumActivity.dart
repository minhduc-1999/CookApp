import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:snippet_coder_utils/ProgressHUD.dart';
import 'package:tastify/Model/CreateAlbumRequestModel.dart';
import 'package:tastify/Model/PresignedLinkedRequestModel.dart';
import 'package:tastify/Services/APIService.dart';

import '../constants.dart';

class CreateAlbumActivity extends StatefulWidget {
  @override
  _CreateAlbumActivityState createState() => _CreateAlbumActivityState();
}

class _CreateAlbumActivityState extends State<CreateAlbumActivity> {
  TextEditingController nameController = TextEditingController();
  TextEditingController descriptionController = TextEditingController();
  List<File> files = [];
  ImagePicker imagePicker = ImagePicker();
  bool isAPIcallProcess = false;
  GlobalKey<FormState> globalFormKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        resizeToAvoidBottomInset: false,
        appBar: AppBar(
            backgroundColor: appPrimaryColor,
            leading: IconButton(
              icon: Icon(Icons.arrow_back, color: Colors.white),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            title: const Text(
              "Create Album",
              style: const TextStyle(color: Colors.white),
            ),
            actions: <Widget>[
              FlatButton(
                  onPressed: () async {
                      if (files != null) {
                      setState(() {
                        isAPIcallProcess = true;
                      });
                      List<String> names = [];
                      for (var i in files) {
                        //names.add(i.path.substring(i.path.lastIndexOf("/")+1));
                        names.add(
                            i.path.substring(i.path.lastIndexOf("/") + 1));
                      }
                      List<String> objectName = [];
                      List<String> videos = [];
                      var response = await APIService.getPresignedLink(
                          PresignedLinkedRequestModel(fileNames: names));
                      //uploadImage(response, objectName);
                      for (int i = 0; i < response.data.items.length; i++) {
                        await APIService.uploadImage(
                            files[i], response.data.items[i].signedLink);
                        objectName.add(response.data.items[i].objectName);
                      }
                      print("object name " + objectName.length.toString());
                      await APIService.createAlbum(CreateAlbumRequestModel(
                        name: nameController.text,
                        description: descriptionController.text,
                        images: objectName,
                        videos: videos
                      ));
                      setState(() {
                        isAPIcallProcess = false;
                      });
                      Navigator.of(context).pop();
                    }
                  },
                  child:
                      IconButton(icon: Icon(Icons.done, color: Colors.white)))
            ]),
        body: ProgressHUD(
          child: Form(
            key: globalFormKey,
            child: _createAlbumUI(context),
          ),
          inAsyncCall: isAPIcallProcess,
          key: UniqueKey(),
          opacity: 0.3,
        ));
  }

  Widget _createAlbumUI(BuildContext context) {
    return Container(
      child: Column(
        children: [
          TextField(
            controller: nameController,
            decoration: InputDecoration(
                contentPadding: EdgeInsets.only(left: 8, right: 8),
                hintText: "Album name",
                focusedBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: appPrimaryColor, width: 1))),
            cursorColor: appPrimaryColor,
          ),
          TextField(
            controller: descriptionController,
            decoration: InputDecoration(
                contentPadding: EdgeInsets.only(left: 8, right: 8),
                hintText: "Description",
                focusedBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: appPrimaryColor, width: 1))),
            cursorColor: appPrimaryColor,
          ),
          SizedBox(
            height: 5,
          ),
          GestureDetector(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                IconButton(
                  onPressed: () async {
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
                  icon: Icon(Icons.add_to_photos),
                  color: appPrimaryColor,
                  iconSize: 32,
                ),
                Text(
                  "Add Photos",
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
            height: 5,
          ),
          files.length > 0
              ? GridView.builder(
                  itemCount: files.length,
                  shrinkWrap: true,
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 3,
                      crossAxisSpacing: 2,
                      mainAxisSpacing: 2),
                  itemBuilder: (BuildContext context, int index) {
                    return _photoTitle(files[index]);
                  })
              : Container(),
        ],
      ),
    );
  }

  Widget _photoTitle(File file) {
    return Stack(children: [
      Container(
        height: 1000,
        width: 1000,
        child: Image.file(file, fit: BoxFit.fill),
      ),
      Positioned(
          top: 0,
          right: 0,
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
          )),
    ]);
  }
}
