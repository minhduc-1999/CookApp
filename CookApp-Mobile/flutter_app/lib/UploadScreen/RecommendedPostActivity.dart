import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:snippet_coder_utils/ProgressHUD.dart';
import 'package:string_to_hex/string_to_hex.dart';
import 'package:tastify/Model/Food.dart';
import 'package:tastify/Model/Message.dart';
import 'package:tastify/Model/PostRequestModel.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:tastify/UploadScreen/SearchFoodActivity.dart';

import '../constants.dart';
import 'TagsActivity.dart';
class RecommendedPostActivity extends StatefulWidget {
  @override
  _RecommendedPostActivityState createState() => _RecommendedPostActivityState();
}

class _RecommendedPostActivityState extends State<RecommendedPostActivity> {
  TextEditingController descriptionController = TextEditingController();
  TextEditingController titleController = TextEditingController();
  TextEditingController shouldController = TextEditingController();
  TextEditingController shouldnotController = TextEditingController();
  bool isAPIcallProcess = false;
  GlobalKey<FormState> globalFormKey = GlobalKey<FormState>();
  List<String> userTags = [];
  List<Food> shouldFood = [];
  List<Food> shouldnotFood = [];
  List<String> tagsInit = [];
  bool circular = true;
  FToast fToast;
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    fetchTags();
    fToast = FToast();
    fToast.init(context);
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
  void fetchTags() async{
    var dataTags = await APIService.getTags();
    List<String> temp = [];
    for (var i in dataTags.data.topics) {
      temp.add(i.title);
    }
    setState(() {

      tagsInit = temp;
      circular = false;
    });
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
            "Recommendation",
            style: const TextStyle(color: Colors.white),
          ),
          actions: <Widget>[
            FlatButton(
                onPressed: () async {
                  if (userTags.length == 0) {
                    _showToast("You have to add tags first!", size);
                  } else if (shouldFood.length == 0 || shouldnotFood.length == 0 || shouldController.text == "" || shouldnotController.text == "" ){
                    _showToast("You have to complete your suggestion first!", size);
                  } else if (descriptionController.text == ""){
                    _showToast("You have to add caption first!", size);
                  } else {
                    setState(() {
                      isAPIcallProcess = true;
                    });
                    List<String> shouldId = [];
                    List<String> shouldnotId = [];
                    for (var i in shouldFood) {
                      shouldId.add(i.id);
                    }
                    for (var i in shouldnotFood) {
                      shouldnotId.add(i.id);
                    }
                    await APIService.uploadPost(PostRequestModel(
                        content: descriptionController.text,
                        title: titleController.text,
                        images: [],
                        videos: [],
                        should: Should(advice: shouldController.text, foodIds: shouldId),
                        shouldNot: Should(advice: shouldnotController.text, foodIds: shouldnotId),
                        tags: userTags,
                        kind: "RECOMMENDATION",
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
          child: _recommendedPostUI(context,size),
        ),
        inAsyncCall: isAPIcallProcess,
        key: UniqueKey(),
        opacity: 0.3,
      ),
    );
  }

  Widget _recommendedPostUI(BuildContext context, Size size) {

    return circular ? Center(child: CircularProgressIndicator()) : GestureDetector(
      onTap: (){
        FocusScope.of(context).unfocus();
      },
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: Text("Information", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),),
            ),
            ListTile(
              leading: Icon(FontAwesomeIcons.t, color: Colors.black,),
              title: Container(
                width: 250.0,
                child: TextField(
                  controller: titleController,
                  maxLines: 3,
                  minLines: 1,
                  decoration: InputDecoration(
                      hintText: "Write a title...",
                      border: InputBorder.none),
                ),
              ),
            ),

            Divider(),
            ListTile(
              leading: Icon(FontAwesomeIcons.commentDots, color: Colors.black),
              title: Container(
                width: 250.0,
                child: TextField(
                  controller: descriptionController,
                  maxLines: 5,
                  minLines: 1,
                  decoration: InputDecoration(

                      hintText: "Write a caption...",

                      border: InputBorder.none),
                ),
              ),
            ),


            Divider(),
            ListTile(
              leading: Icon(FontAwesomeIcons.tag,  color: Colors.black),
              title: Container(
                  child: TextField(
                    enableInteractiveSelection: false, //
                    focusNode: new AlwaysDisabledFocusNode(),
                    decoration: InputDecoration(
                        hintText: "Tags", border: InputBorder.none),
                  )),

              trailing: IconButton(
                icon: Icon(Icons.attachment, color: Colors.black,),
                onPressed: () {
                  FocusScope.of(context).unfocus();
                  return showModalBottomSheet(
                    context: context,
                    builder: (BuildContext context) {
                      return TagsActivity(
                        tags: this.tagsInit,
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
                          child: Text(userTags[index], style: TextStyle(color: Colors.white),),
                        ),
                        decoration: BoxDecoration(
                            color: userTags[index] != "Gymer" ? Color(StringToHex.toColor(userTags[index])): Color(defaultTagsColor) ,
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
            Divider(),
           /* Padding(
              padding: const EdgeInsets.all(16),
              child: Text("Suggestion", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),),
            ),*/
            ListTile(
              leading: Text("Should", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              title: Align(alignment: Alignment.centerLeft,child: Icon(FontAwesomeIcons.circleCheck, color: Colors.green,)),
            ),
            ListTile(
              leading: Icon(FontAwesomeIcons.commentDots, color: Colors.black),
              title: Container(
                width: 250.0,
                child: TextField(
                  controller: shouldController,
                  maxLines: 5,
                  minLines: 1,
                  decoration: InputDecoration(

                      hintText: "Write an advice...",

                      border: InputBorder.none),
                ),
              ),
            ),
            Divider(),
            ListTile(
              leading: Icon(Icons.lunch_dining_outlined,  color: Colors.black),
              title: Container(
                  child: TextField(
                    enableInteractiveSelection: false, //
                    focusNode: new AlwaysDisabledFocusNode(),
                    decoration: InputDecoration(
                        hintText: "Foods", border: InputBorder.none),
                  )),

              trailing: IconButton(
                icon: Icon(Icons.add_circle_outline, color: Colors.black,),
                onPressed: () {
                  FocusScope.of(context).unfocus();
                  return showModalBottomSheet(
                    context: context,
                    builder: (BuildContext context) {
                      return SearchFoodActivity();
                    },
                    isScrollControlled: true,
                    backgroundColor: Colors.transparent,
                  ).then((value){

                    setState(() {
                      shouldFood.add(value);

                    });
                    return FocusScope.of(context).unfocus();
                  });
                },
              ),
            ),
            shouldFood.length > 0 ? ListView.separated(
              physics: NeverScrollableScrollPhysics(),
              shrinkWrap: true,
              itemCount: shouldFood.length,
              itemBuilder: (context, index) {

                return ListTile(
                  leading: Image.network(
                    shouldFood[index].photo,
                    fit: BoxFit.cover,
                    width: size.width * 0.15,
                    height: size.height * 0.08,
                  ),
                  title:  Text(
                    shouldFood[index].name,
                    style:
                    TextStyle( fontWeight: FontWeight.bold),
                    overflow: TextOverflow.ellipsis,
                  ),
                  trailing: IconButton(
                    icon: Icon(Icons.remove, color: Colors.black,),
                    onPressed: () {
                      setState(() {
                        shouldFood.remove(shouldFood[index]);
                      });

                    },
                  ),
                );




              },
              separatorBuilder: (context, index) {
                return Divider();
              },
            ) : Container(),
            Divider(),
            ListTile(
              leading: Text("Should not", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              title: Align( alignment: Alignment.centerLeft,child: Icon(FontAwesomeIcons.circleXmark, color: Colors.red,)),
            ),
            ListTile(
              leading: Icon(FontAwesomeIcons.commentDots, color: Colors.black),
              title: Container(
                width: 250.0,
                child: TextField(
                  controller: shouldnotController,
                  maxLines: 5,
                  minLines: 1,
                  decoration: InputDecoration(

                      hintText: "Write an advice...",

                      border: InputBorder.none),
                ),
              ),
            ),
            Divider(),

            ListTile(
              leading: Icon(Icons.lunch_dining_outlined,  color: Colors.black),
              title: Container(
                  child: TextField(
                    enableInteractiveSelection: false, //
                    focusNode: new AlwaysDisabledFocusNode(),
                    decoration: InputDecoration(
                        hintText: "Foods", border: InputBorder.none),
                  )),

              trailing: IconButton(
                icon: Icon(Icons.add_circle_outline, color: Colors.black,),
                onPressed: () {
                  FocusScope.of(context).unfocus();
                  return showModalBottomSheet(
                    context: context,
                    builder: (BuildContext context) {
                      return SearchFoodActivity();
                    },
                    isScrollControlled: true,
                    backgroundColor: Colors.transparent,
                  ).then((value){

                    setState(() {
                      shouldnotFood.add(value);

                    });
                    return FocusScope.of(context).unfocus();
                  });
                },
              ),
            ),
            shouldnotFood.length > 0 ? ListView.separated(
              physics: NeverScrollableScrollPhysics(),
              shrinkWrap: true,
              itemCount: shouldnotFood.length,
              itemBuilder: (context, index) {

                return ListTile(
                  leading: Image.network(
                    shouldnotFood[index].photo,
                    fit: BoxFit.cover,
                    width: size.width * 0.15,
                    height: size.height * 0.08,
                  ),
                  title:  Text(
                    shouldnotFood[index].name,
                    style:
                    TextStyle( fontWeight: FontWeight.bold),
                    overflow: TextOverflow.ellipsis,
                  ),
                  trailing: IconButton(
                    icon: Icon(Icons.remove, color: Colors.black,),
                    onPressed: () {
                      setState(() {
                        shouldnotFood.remove(shouldnotFood[index]);
                      });
                    },
                  ),
                );




              },
              separatorBuilder: (context, index) {
                return Divider();
              },
            ) : Container(),
            SizedBox(height: 20,)
          ],
        ),
      ),
    );
  }
}


class AlwaysDisabledFocusNode extends FocusNode {
  @override
  bool get hasFocus => false;
}