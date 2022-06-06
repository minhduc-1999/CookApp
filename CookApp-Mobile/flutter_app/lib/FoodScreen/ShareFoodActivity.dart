import 'dart:io';

import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:geocoding/geocoding.dart';
import 'package:geolocator/geolocator.dart';
import 'package:image_picker/image_picker.dart';
import 'package:snippet_coder_utils/ProgressHUD.dart';
import 'package:string_to_hex/string_to_hex.dart';
import 'package:tastify/Model/FoodRespondModel.dart';
import 'package:location/location.dart' as loca;
import 'package:tastify/Model/PostRequestModel.dart';
import 'package:tastify/Model/PresignedLinkedRequestModel.dart';
import 'package:tastify/Model/UserRespondModel.dart';
import 'package:tastify/ProfileScreen/EditProfileActivity.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:tastify/UploadScreen/TagsActivity.dart';
import 'package:tastify/config.dart';
import '../constants.dart';
import '../main.dart';

class ShareFoodActivity extends StatefulWidget {
  final String foodId;
  final Foods food;

  const ShareFoodActivity({Key key, this.foodId, this.food}) : super(key: key);

  @override
  _ShareFoodActivityState createState() =>
      _ShareFoodActivityState(food: this.food);
}

class _ShareFoodActivityState extends State<ShareFoodActivity> {
  Foods food;
  Placemark userLocation;
  bool isAPIcallProcess = false;
  GlobalKey<FormState> globalFormKey = GlobalKey<FormState>();
  bool circular = true;
  UserRespondModel user;

  String ingredients;
  List<File> files = [];
  ImagePicker imagePicker = ImagePicker();
  FToast fToast;
  _ShareFoodActivityState({this.food});

  TextEditingController descriptionController = TextEditingController();
  TextEditingController locationController = TextEditingController();


  List<Topic> userTags = [];
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    _initLocation();

    fetchData();

    fToast = FToast();
    fToast.init(context);
  }


  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;
    return Scaffold(
      appBar: AppBar(
        backgroundColor: appPrimaryColor,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        title: const Text(
          "New Post",
          style: const TextStyle(color: Colors.white),
        ),
        actions: <Widget>[
          FlatButton(
              onPressed: () async {
                if (files.length > 0 && userTags.length > 0) {
                  FocusScope.of(context).unfocus();
                  setState(() {
                    isAPIcallProcess = true;
                  });
                  List<String> names = [];
                  for (var i in files) {
                    //names.add(i.path.substring(i.path.lastIndexOf("/")+1));
                    names.add(i.path.substring(i.path.lastIndexOf("/") + 1));
                  }
                  List<String> objectName = [];
                  List<String> video = [];
                  var response = await APIService.getPresignedLink(
                      PresignedLinkedRequestModel(fileNames: names));
                  //uploadImage(response, objectName);
                  for (int i = 0; i < response.data.items.length; i++) {
                    await APIService.uploadImage(
                        files[i], response.data.items[i].signedLink);
                    objectName.add(response.data.items[i].objectName);
                  }
                  List<String> tags = [];
                  for (var i in userTags){
                    tags.add(i.id);
                  }
                  print("object name " + objectName.length.toString());
                  await APIService.uploadPost(
                    PostRequestModel(
                        content: descriptionController.text,
                        images: objectName,
                        videos: video,
                        location: locationController.text,
                        tags: tags,
                        kind: Config.postFoodShareType,
                        name: "string",
                        foodRefId: widget.food.id),
                  );
                  setState(() {
                    isAPIcallProcess = false;
                  });
                  Navigator.of(context).pop();
                } else if (files.length == 0) {
                  _showToast("You have to add photos first!", size);
                } else if (userTags.length == 0){
                  _showToast("You have to add tags first!", size);
                }
              },
              child: IconButton(icon: Icon(Icons.send, color: Colors.white)))
        ],
      ),
      body: ProgressHUD(
        child: Form(
          key: globalFormKey,
          child: _uploadUI(context),
        ),
        inAsyncCall: isAPIcallProcess,
        key: UniqueKey(),
        opacity: 0.3,
      ),
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
  Widget _uploadUI(BuildContext context) {
    final Size size = MediaQuery.of(context).size;
    return circular
        ? Center(child: CircularProgressIndicator())
        : SingleChildScrollView(
            child: Column(children: [
            Padding(
              padding:
                  const EdgeInsets.only(left: 15, right: 0, top: 10, bottom: 3),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  CircleAvatar(
                    radius: 25,
                    backgroundColor: Colors.grey,
                    backgroundImage: NetworkImage(user.data.avatar.url),
                  ),
                  SizedBox(
                    width: size.width * 0.04,
                  ),
                  user.data.displayName != null
                      ? Text(user.data.displayName,
                          style: TextStyle(
                            color: Colors.black,
                            fontWeight: FontWeight.bold,
                          ))
                      : Text("user",
                          style: TextStyle(
                            color: Colors.black,
                            fontWeight: FontWeight.bold,
                          )),
                ],
              ),
            ),
            _buildFoodRef(),
            GestureDetector(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  IconButton(
                    onPressed: () async {
                      List<XFile> imageFiles =
                          await imagePicker.pickMultiImage();
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
            files.length > 0
                ? Container(
                    child: CarouselSlider(
                    options: CarouselOptions(),
                    items: files
                        .map((item) => Container(
                              child: Container(
                                margin: EdgeInsets.all(5.0),
                                child: ClipRRect(
                                    borderRadius:
                                        BorderRadius.all(Radius.circular(5.0)),
                                    child: Stack(
                                      children: <Widget>[
                                        Image.file(item,
                                            fit: BoxFit.cover, width: 1000.0),
                                        Positioned(
                                            top: 0,
                                            right: 0,
                                            child: GestureDetector(
                                              onTap: () {
                                                setState(() {
                                                  files.remove(item);
                                                });
                                              },
                                              child: Container(
                                                height: 35,
                                                width: 35,
                                                child: Icon(
                                                  Icons.clear,
                                                  color: Colors.white
                                                      .withOpacity(0.8),
                                                ),
                                              ),
                                            )),
                                      ],
                                    )),
                              ),
                            ))
                        .toList(),
                  ))
                : Container(),
              ListTile(
                leading: Icon(Icons.tag),
                title: Container(
                    child: TextField(
                      enableInteractiveSelection: false, //
                      focusNode: new AlwaysDisabledFocusNode(),
                      decoration: InputDecoration(
                          hintText: "Tags", border: InputBorder.none),
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
                    ).then((value){

                      setState(() {
                        userTags.add(value);

                      });
                      return FocusScope.of(context).unfocus();

                    });
                  },
                ),
              ),

              userTags.length <= 0 ?Container(
              ) : SizedBox(
                height: 35,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  shrinkWrap: true,
                  itemCount: userTags.length,
                  separatorBuilder: (context, index) {
                    return SizedBox(width: 5,);
                  },
                  itemBuilder: (context, index) {

                    return Stack(
                      children: [
                        Container(
                          child: Padding(
                            padding: const EdgeInsets.only(left: 15, top: 8, bottom: 8, right: 15),
                            child: Text(userTags[index].title, style: TextStyle(color: Colors.white),),
                          ),
                          decoration: BoxDecoration(
                              color: userTags[index].title != "Gymer" ? Color(StringToHex.toColor(userTags[index])): Color(defaultTagsColor) ,
                              borderRadius: BorderRadius.circular(10)
                          ),
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
                                  color: Colors.white
                                      .withOpacity(0.8),
                                  size: 15,
                                ),
                              ),
                            )),
                      ],
                    );

                  },
                ),
              ),
            ListTile(
              leading: Icon(Icons.comment),
              title: Container(
                width: 1000.0,
                child: TextField(
                  cursorColor: appPrimaryColor,
                  controller: descriptionController,
                  decoration: InputDecoration(
                      hintText: "Write a caption...", border: InputBorder.none),
                ),
              ),
            ),
            Divider(),
            ListTile(
              leading: Icon(Icons.pin_drop),
              title: Container(
                width: 1000.0,
                child: TextField(
                  cursorColor: appPrimaryColor,
                  controller: locationController,
                  decoration: InputDecoration(
                      hintText: "Where was this photo taken?",
                      border: InputBorder.none),
                ),
              ),
            ),
            Divider(),
            (userLocation == null)
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
                    ))
          ]));
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

  _initLocation() async {
    Position position = await _determinePosition();
    List<Placemark> placemarks =
        await placemarkFromCoordinates(position.latitude, position.longitude);

    setState(() {
      userLocation = placemarks[0];
    });
  }

  Future<Position> _determinePosition() async {
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
  }

  Widget _buildFoodRef() {
    final Size size = MediaQuery.of(context).size;
    return Container(
      margin: EdgeInsets.all(8),
      decoration: BoxDecoration(border: Border.all(color: appPrimaryColor)),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            margin: EdgeInsets.all(8),
            decoration: BoxDecoration(shape: BoxShape.circle),
            child: Image.network(
              food.photos[0].url,
              fit: BoxFit.cover,
              width: size.width * 0.2,
              height: size.height * 0.1,
            ),
          ),
          Flexible(
            child: Container(
              margin: EdgeInsets.only(top: 8, right: 8),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    food.name,
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    "Ingredients: " + ingredients,
                    style: TextStyle(color: Colors.grey, fontSize: 14),
                    softWrap: false,
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  )
                ],
              ),
            ),
          )
        ],
      ),
    );
  }

  void fetchData() async {
    var userData = await APIService.getUser();
    var foodData = await APIService.getFoodInstruction(food.id);
    String temp = "";
    for (int i = 0; i < foodData.data.ingredients.length; i++) {
      if (foodData.data.ingredients[i].name != null) {
        if (i == foodData.data.ingredients.length) {
          temp = temp + foodData.data.ingredients[i].name;
        } else {
          temp = temp + foodData.data.ingredients[i].name + ", ";
        }
      }
    }
    setState(() {
      user = userData;
      circular = false;
      ingredients = temp;
    });
  }
}

class AlwaysDisabledFocusNode extends FocusNode {
  @override
  bool get hasFocus => false;
}