import 'dart:io';

import 'package:flutter/material.dart';
//import 'package:geocoding/geocoding.dart';
import 'package:snippet_coder_utils/ProgressHUD.dart';
import 'package:tastify/Model/PostRequestModel.dart';
import 'package:tastify/Model/PresignedLinkedRequestModel.dart';
import 'package:tastify/Model/PresignedLinkedRespondModel.dart';
import 'package:tastify/ProfileScreen/EditProfileActivity.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:image_picker/image_picker.dart';
import 'package:photo_manager/photo_manager.dart';
/*import 'package:geolocator/geolocator.dart';
import 'package:location/location.dart' as loca;*/
import 'package:tastify/UploadScreen/TagsActivity.dart';
import 'package:string_to_hex/string_to_hex.dart';
import 'package:tastify/main.dart';
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
  //Map<String, double> currentLocation = Map();
  TextEditingController descriptionController = TextEditingController();
  //TextEditingController locationController = TextEditingController();
  bool uploading = false;
  List<AssetEntity> _selectedList = [];
  List<Widget> _photoList = [];
  int currentPage = 0;
  int lastPage;
  int maxSelection = 1;

  List<Topic> userTags = [];
  //Placemark userLocation;

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
    //_initLocation();
    _fetchPhotos();
  }

  /*_initLocation() async {
    Position position = await _determinePosition();
    List<Placemark> placemarks =
        await placemarkFromCoordinates(position.latitude, position.longitude);

    setState(() {
      userLocation = placemarks[0];
    });
  }*/

  /*Future<Position> _determinePosition() async {
    bool serviceEnabled;
    LocationPermission permission;
    loca.Location location = new loca.Location();
    // Test if location services are enabled.
    serviceEnabled = await location.serviceEnabled();
    if (!serviceEnabled) {
      // Location services are not enabled don't continue
      // accessing the position and request users of the
      // App to enable the location services.
      serviceEnabled = await location.requestService();

      if (!serviceEnabled) {
        return Future.error('Location services are disabled.');
      }
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        // Permissions are denied, next time you could try
        // requesting permissions again (this is also where
        // Android's shouldShowRequestPermissionRationale
        // returned true. According to Android guidelines
        // your App should show an explanatory UI now.
        return Future.error('Location permissions are denied');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      // Permissions are denied forever, handle appropriately.
      return Future.error(
          'Location permissions are permanently denied, we cannot request permissions.');
    }

    // When we reach here, permissions are granted and we can
    // continue accessing the position of the device.
    return await Geolocator.getCurrentPosition();
  }*/

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
                      userTags.clear();
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
                          FocusScope.of(context).unfocus();
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
                          List<String> tags = [];
                          for (var i in userTags) {
                            tags.add(i.title);
                          }
                          var response = await APIService.getPresignedLink(
                              PresignedLinkedRequestModel(fileNames: names));
                          //uploadImage(response, objectName);
                          for (int i = 0; i < response.data.items.length; i++) {
                            await APIService.uploadImage(
                                files[i], response.data.items[i].signedLink);
                            objectName.add(response.data.items[i].objectName);
                          }
                          print("object name " + objectName.length.toString());
                          await APIService.uploadPost(PostRequestModel(
                              content: descriptionController.text,
                              images: objectName,
                              videos: video,

                              tags: tags,
                              kind: "MOMENT",
                              name: "string"));
                          setState(() {
                            isAPIcallProcess = false;
                          });
                          Navigator.of(context).pop();
                        }
                      },
                      child: IconButton(
                          icon: Icon(Icons.send, color: Colors.white)))
                ]),
            body: ProgressHUD(
              child: Form(
                key: globalFormKey,
                child: _uploadUI(context),
              ),
              inAsyncCall: isAPIcallProcess,
              key: UniqueKey(),
              opacity: 0.3,
            ));
  }

  Widget _uploadUI(BuildContext context) {
    return ListView(
      children: <Widget>[
        Column(
          children: <Widget>[
            uploading
                ? LinearProgressIndicator()
                : Padding(padding: EdgeInsets.only(top: 0.0)),
            Divider(),
            ListTile(
              leading: Container(
                height: 45.0,
                width: 45.0,
                child: AspectRatio(
                  aspectRatio: 487 / 451,
                  child: Container(
                    decoration: BoxDecoration(
                        image: DecorationImage(
                          fit: BoxFit.fill,
                          alignment: FractionalOffset.topCenter,
                          image: FileImage(files[0]),
                        )),
                  ),
                ),
              ),
              title: Container(
                width: 250.0,
                child: TextField(
                  controller: descriptionController,
                  decoration: InputDecoration(
                      hintText: "Write a caption...",
                      border: InputBorder.none),
                ),
              ),
            ),
            /*Row(
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
                        image: FileImage(files[0]),
                      )),
                    ),
                  ),
                ),
                Container(
                  width: 250.0,
                  child: TextField(
                    controller: descriptionController,
                    decoration: InputDecoration(
                        hintText: "Write a caption...",
                        border: InputBorder.none),
                  ),
                ),
              ],
            ),*/
            Divider(),
            ListTile(
              leading: Icon(Icons.tag),
              title: Container(
                  child: TextField(
                enableInteractiveSelection: false, //
                focusNode: new AlwaysDisabledFocusNode(),
                decoration:
                    InputDecoration(hintText: "Tags", border: InputBorder.none),
              )),
              trailing: IconButton(
                icon: Icon(Icons.attachment),
                onPressed: () {
                  FocusScope.of(context).unfocus();
                  return showModalBottomSheet(
                    context: context,
                    builder: (BuildContext context) {
                      return TagsActivity(
                        tags: tagsInit,
                      );
                    },
                    isScrollControlled: true,
                    backgroundColor: Colors.transparent,
                  ).then((value) {
                    if (value != null) {
                      if (!userTags.contains(value)) {
                        setState(() {
                          userTags.add(value);
                        });
                      }
                    }
                    return FocusScope.of(context).unfocus();
                  });
                },
              ),
            ),
            userTags.length <= 0
                ? Container()
                : SizedBox(
                    height: 35,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      shrinkWrap: true,
                      itemCount: userTags.length,
                      separatorBuilder: (context, index) {
                        return SizedBox(
                          width: 5,
                        );
                      },
                      itemBuilder: (context, index) {
                        return Stack(
                          children: [
                            Container(
                              child: Padding(
                                padding: const EdgeInsets.only(
                                    left: 15, top: 8, bottom: 8, right: 15),
                                child: Text(
                                  userTags[index].title,
                                  style: TextStyle(color: Colors.white),
                                ),
                              ),
                              decoration: BoxDecoration(
                                  color: userTags[index].title != "Gymer"
                                      ? Color(StringToHex.toColor(
                                          userTags[index].title))
                                      : Color(defaultTagsColor),
                                  borderRadius: BorderRadius.circular(10)),
                            ),
                            Positioned(
                                top: 0,
                                right: 3,
                                child: GestureDetector(
                                  onTap: () {
                                    setState(() {
                                      userTags.remove(userTags[index]);
                                    });
                                  },
                                  child: Container(
                                    height: 15,
                                    width: 15,
                                    child: Icon(
                                      Icons.clear,
                                      color: Colors.white.withOpacity(0.8),
                                      size: 15,
                                    ),
                                  ),
                                )),
                          ],
                        );
                      },
                    ),
                  ),
           /* Divider(),
            ListTile(
              leading: Icon(Icons.pin_drop),
              title: Container(
                width: 250.0,
                child: TextField(
                  controller: locationController,
                  decoration: InputDecoration(
                      hintText: "Where was this photo taken?",
                      border: InputBorder.none),
                ),
              ),
            )*/
          ],
        ),
        Divider(),
        /*(userLocation == null)
            ? Container()
            : SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                padding: EdgeInsets.only(right: 5.0, left: 5.0),
                child: Row(
                  children: <Widget>[
                    //buildLocationButton(location.street),
                    buildLocationButton(userLocation.locality),
                    buildLocationButton(userLocation.administrativeArea),
                    buildLocationButton(userLocation.country),
                  ],
                ))*/
      ],
    );
  }

  _getFile(AssetEntity asset) async {
    File temp = await asset.file;
    setState(() {
      files.add(temp);
    });
  }

  /*buildLocationButton(String locationName) {
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
  }*/
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

  PostForm({
    this.imageFile,
    this.descriptionController,
    this.loading,
    this.locationController,
  });

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
        Divider(),
        ListTile(
          leading: Icon(Icons.tag),
          title: Container(
            child: TextField(
              enableInteractiveSelection: false, //
              focusNode: new AlwaysDisabledFocusNode(),
              decoration:
                  InputDecoration(hintText: "Tags", border: InputBorder.none),
            ),
          ),
          trailing: IconButton(
            icon: Icon(Icons.attachment),
            onPressed: () {
              return showModalBottomSheet(
                context: context,
                builder: (BuildContext context) {
                  return TagsActivity(
                    tags: tagsInit,
                  );
                },
                isScrollControlled: true,
                backgroundColor: Colors.transparent,
              );
            },
          ),
        ),
        Divider(),
        ListTile(
          leading: Icon(Icons.pin_drop),
          title: Container(
            width: 250.0,
            child: TextField(
              controller: locationController,
              decoration: InputDecoration(
                  hintText: "Where was this photo taken?",
                  border: InputBorder.none),
            ),
          ),
        )
      ],
    );
  }
}

class AlwaysDisabledFocusNode extends FocusNode {
  @override
  bool get hasFocus => false;
}
