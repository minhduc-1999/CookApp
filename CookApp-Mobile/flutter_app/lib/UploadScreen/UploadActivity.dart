import 'dart:io';

import 'package:flutter/material.dart';
import 'package:snippet_coder_utils/ProgressHUD.dart';
import 'package:tastify/Model/PostRequestModel.dart';
import 'package:tastify/Model/PresignedLinkedRequestModel.dart';
import 'package:tastify/Model/PresignedLinkedRespondModel.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:image_picker/image_picker.dart';
import 'package:photo_manager/photo_manager.dart';
import 'package:uuid/uuid.dart';

import '../constants.dart';

class UploadActivity extends StatefulWidget {
  @override
  _UploadActivityState createState() => _UploadActivityState();
}

class _UploadActivityState extends State<UploadActivity> {
  List<File> files = [];
  bool isAPIcallProcess = false;
  GlobalKey<FormState> globalFormKey = GlobalKey<FormState>();
  ImagePicker imagePicker = ImagePicker();
  bool circular = false;
  Map<String, double> currentLocation = Map();
  TextEditingController descriptionController = TextEditingController();
  TextEditingController locationController = TextEditingController();
  bool uploading = false;
  List<AssetEntity> _selectedList = [];
  List<Widget> _photoList = [];
  int currentPage = 0;
  int lastPage;
  int maxSelection = 1;

  _handleScrollEvent(ScrollNotification scroll) {
    if (scroll.metrics.pixels / scroll.metrics.maxScrollExtent > 0.33) {
      if (currentPage != lastPage) {
        _fetchPhotos();
      }
    }
  }

  _fetchPhotos() async {
    lastPage = currentPage;
    var result = await PhotoManager.requestPermission();
    if (result) {
      //load the album list
      List<AssetPathEntity> albums = await PhotoManager.getAssetPathList(
          onlyAll: true, type: RequestType.image);
      List<AssetEntity> media =
          await albums[0].getAssetListPaged(currentPage, 60);
      List<Widget> temp = [];
      for (var asset in media) {
        temp.add(
          PhotoPickerItem(
              asset: asset,
              onSelect: (AssetEntity asset) {
                _getFile(asset);
              }),
        );
      }
      setState(() {
        _photoList.addAll(temp);
        currentPage++;
      });
    } else {
      // fail
      /// if result is fail, you can call `PhotoManager.openSetting();`  to open android/ios applicaton's setting to get permission
    }
  }

  @override
  initState() {
    //variables with location assigned as 0.0

    super.initState();
    _fetchPhotos();
  }

  @override
  Widget build(BuildContext context) {
    return files.length == 0
        ? Scaffold(
            resizeToAvoidBottomInset: false,
            appBar: AppBar(
              brightness: Brightness.dark,
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
                icon: Icon(Icons.arrow_back, color: Colors.white),
                onPressed: () {
                  setState(() {
                    files.clear();
                  });
                  Navigator.of(context).pop();
                },
              ),
              title: const Text(
                "Choose Image",
              ),
              actions: [
                IconButton(
                  icon: Icon(Icons.add_to_photos_rounded),
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
                ),
                IconButton(
                  icon: Icon(Icons.add_a_photo),
                  onPressed: () async {
                    PickedFile imageFile = await imagePicker.getImage(
                        source: ImageSource.camera,
                        maxWidth: 1920,
                        maxHeight: 1200,
                        imageQuality: 80);
                    if (imageFile != null) {
                      setState(() {
                        files.add(File(imageFile.path));
                      });
                    }
                  },
                )
              ],
            ),
            body: NotificationListener<ScrollNotification>(
              onNotification: (ScrollNotification scroll) {
                _handleScrollEvent(scroll);
                return;
              },
              child: GridView.builder(
                  itemCount: _photoList.length,
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 3,
                      crossAxisSpacing: 2,
                      mainAxisSpacing: 2),
                  itemBuilder: (BuildContext context, int index) {
                    return _photoList[index];
                  }),
            ))
        : Scaffold(
              resizeToAvoidBottomInset: false,
              appBar: AppBar(
                  backgroundColor: appPrimaryColor,
                  leading: IconButton(
                    icon: Icon(Icons.arrow_back, color: Colors.white),
                    onPressed: () {
                      setState(() {
                        files.clear();
                      });
                    },
                  ),
                  title: const Text(
                    "New Post",
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
                            List<String> video = [];
                            var response = await APIService.getPresignedLink(
                                PresignedLinkedRequestModel(fileNames: names));
                            uploadImage(response, objectName);
                            for (int i = 0; i < response.data.items.length; i++) {
                              await APIService.uploadImage(
                                  files[i], response.data.items[i].signedLink);
                              objectName.add(response.data.items[i].objectName);
                            }
                            print("object name " + objectName.length.toString());
                            await APIService.uploadPost(PostRequestModel(
                                content: descriptionController.text,
                                images: objectName,
                                videos: video));
                            setState(() {
                              isAPIcallProcess = false;
                            });
                            Navigator.of(context).pop();
                          }
                        },
                        child: IconButton(
                            icon: Icon(Icons.send,
                                color: Colors.white))
                        )
                  ]),
              body: ProgressHUD(
                child: Form(
                  key: globalFormKey,
                  child: _uploadUI(context),
                ),
                inAsyncCall: isAPIcallProcess,
                key: UniqueKey(),
                opacity: 0.3,
              )
            );

  }
  Widget _uploadUI(BuildContext context){
    return ListView(
      children: <Widget>[
        PostForm(
          imageFile: files,
          descriptionController: descriptionController,
          locationController: locationController,
          loading: uploading,
        ),
        Divider(),
      ],
    );
  }
  _getFile(AssetEntity asset) async {
    File temp = await asset.file;
    setState(() {
      files.add(temp);
    });
  }

  buildLocationButton(String locationName) {
    if (locationName != null ?? locationName.isNotEmpty) {
      return InkWell(
        onTap: () {
          locationController.text = locationName;
        },
        child: Center(
          child: Container(
            //width: 100.0,
            height: 30.0,
            padding: EdgeInsets.only(left: 8.0, right: 8.0),
            margin: EdgeInsets.only(right: 3.0, left: 3.0),
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(5.0),
            ),
            child: Center(
              child: Text(
                locationName,
                style: TextStyle(color: Colors.grey),
              ),
            ),
          ),
        ),
      );
    } else {
      return Container();
    }
  }

  void uploadImage(
      PresignedLinkedRespondModel response, List<String> objectName) {}
}

class PhotoPickerItem extends StatefulWidget {
  final AssetEntity asset;
  final bool Function(AssetEntity asset) onSelect;

  const PhotoPickerItem({this.asset, this.onSelect});

  @override
  _PhotoPickerItemState createState() => _PhotoPickerItemState();
}

class _PhotoPickerItemState extends State<PhotoPickerItem> {
  bool isSelected = false;

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: widget.asset.thumbDataWithSize(200, 200),
      builder: (BuildContext context, snapshot) {
        if (snapshot.connectionState == ConnectionState.done)
          return GestureDetector(
            onTap: () {
              setState(() {
                // isSelected = !isSelected;
                isSelected = widget.onSelect(widget.asset);
              });
            },
            child: Stack(
              children: <Widget>[
                Positioned.fill(
                  child: Image.memory(
                    snapshot.data,
                    fit: BoxFit.cover,
                  ),
                ),
              ],
            ),
          );
        return Container();
      },
    );
  }
}

class PostForm extends StatelessWidget {
  final imageFile;
  final TextEditingController descriptionController;
  final TextEditingController locationController;
  final bool loading;

  PostForm(
      {this.imageFile,
      this.descriptionController,
      this.loading,
      this.locationController});

  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        loading
            ? LinearProgressIndicator()
            : Padding(padding: EdgeInsets.only(top: 0.0)),
        Divider(),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: <Widget>[
            Container(
              height: 45.0,
              width: 45.0,
              child: AspectRatio(
                aspectRatio: 487 / 451,
                child: Container(
                  decoration: BoxDecoration(
                      image: DecorationImage(
                    fit: BoxFit.fill,
                    alignment: FractionalOffset.topCenter,
                    image: FileImage(imageFile[0]),
                  )),
                ),
              ),
            ),
            Container(
              width: 250.0,
              child: TextField(
                controller: descriptionController,
                decoration: InputDecoration(
                    hintText: "Write a caption...", border: InputBorder.none),
              ),
            ),
          ],
        ),

      ],
    );
  }
}
