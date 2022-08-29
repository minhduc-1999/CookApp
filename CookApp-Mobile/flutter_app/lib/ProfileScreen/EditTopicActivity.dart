import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:snippet_coder_utils/ProgressHUD.dart';
import 'package:string_to_hex/string_to_hex.dart';
import 'package:tastify/Model/InterestTopicRequestModel.dart';
import 'package:tastify/ProfileScreen/EditProfileActivity.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:tastify/main.dart';

import '../constants.dart';

class EditTopicActivity extends StatefulWidget {
  @override
  _EditTopicActivityState createState() => _EditTopicActivityState();
}

class _EditTopicActivityState extends State<EditTopicActivity> {
  bool isAPIcallProcess = false;
  GlobalKey<FormState> globalFormKey = GlobalKey<FormState>();
  List<Topic> userTopics = [];
  List<Topic> unselectedTopics = [];
  bool circular = true;
  FToast fToast;
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    fToast = FToast();
    fToast.init(context);
    fetchData();
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
    var dataUserTopic = await APIService.getUsersTopics();
    List<Topic> tempSelected = [];
    for (var i in dataUserTopic.data.topics) {
      tempSelected.add(Topic(id: i.id, title: i.title));
    }
    List<Topic>  tempUnselected = tagsInit;
    print("ln");
    for(var i in tempSelected){
      tempUnselected.removeWhere((element) => element.id == i.id);
    }
    print("ln");
    setState(() {
      userTopics = tempSelected;
      unselectedTopics = tempUnselected;
      circular = false;
    });
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
            child: Text("Topics"),
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
                  if(userTopics.length < 2){
                    _showToast("You need to add at least 2 topics", size);
                  } else {
                    setState(() {
                      isAPIcallProcess = true;
                    });
                    List<String> selectedTopicsId = [];
                    for (var i in userTopics) {
                      selectedTopicsId.add(i.id);
                    }
                    var res = await APIService.chooseTopic(
                        InterestTopicRequestModel(topicIds: selectedTopicsId));
                    _showToast("Update topics successfully", size);
                    if (res.meta.ok) {
                      Navigator.of(context).pop();
                    }
                  }
                  /*setState(() {
                  isAPIcallProcess = true;
                });
                String objectName;
                List<String> selectedTopic = [];
                for (var i in userTopics) {
                  selectedTopic.add(i.id);
                }
                ;
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
                await APIService.chooseTopic(
                    InterestTopicRequestModel(topicIds: selectedTopic));
                setState(() {
                  isAPIcallProcess = false;
                });
                _showToast(response.meta.messages[0], size);
                if (response.meta.ok) {
                  Navigator.of(context).pop();
                }*/
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
            child: _editTopicsUI(context),
          ),
          inAsyncCall: isAPIcallProcess,
          key: UniqueKey(),
          opacity: 0.3,
        ));

  }
  Widget _editTopicsUI(BuildContext context){
      return SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [

            Padding(
              padding: const EdgeInsets.only(left: 16.0, right: 16.0,top: 16.0,bottom: 10),
              child: Text("Followed Topics", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),),
            ),

            Padding(
              padding: const EdgeInsets.only(left: 16, right: 16,bottom: 32),
              child: Text(
                "The Topics you follow are used to personalize the Posts that you see",
                maxLines: 4,
                style:
                TextStyle(fontSize: 14, color: Colors.black.withOpacity(0.5)),
              ),
            ),
            userTopics.length <= 0 ? Container() :
            GridView.count(
                crossAxisCount: 2,
                childAspectRatio: 3,
                padding: const EdgeInsets.only(left: 16,right: 16,bottom: 0),
                mainAxisSpacing: 5,
                crossAxisSpacing: 15,

                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                children: List.generate(userTopics.length, (index) {

                  return Stack(
                    children: [
                      Container(

                        child: Padding(
                          padding: const EdgeInsets.only(
                              top: 8, bottom: 8,),
                          child: Text(
                            userTopics[index].title, textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.white),
                          ),
                        ),
                        width: 10000,
                        decoration: BoxDecoration(
                            color: userTopics[index].title != "Gymer"
                                ? Color(StringToHex.toColor(
                                userTopics[index].title))
                                : Color(defaultTagsColor),
                            borderRadius: BorderRadius.circular(10)),
                      ),
                      Positioned(
                          top: 3,
                          right: 5,
                          child: GestureDetector(
                            onTap: () {

                              Topic temp = userTopics[index];
                              setState(() {
                                userTopics.remove(temp);
                                unselectedTopics.add(temp);
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
                })),
            Padding(
              padding: const EdgeInsets.fromLTRB(16.0,16,16,32),
              child: Text("Another Topics", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),),
            ),
            unselectedTopics.length <= 0 ? Container() :
            GridView.count(
                crossAxisCount: 2,
                childAspectRatio: 3,
                padding: const EdgeInsets.only(left: 16,right: 16,bottom: 0),
                mainAxisSpacing: 5,
                crossAxisSpacing: 15,

                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                children: List.generate(unselectedTopics.length, (index) {

                  return  GestureDetector(
                    onTap: (){
                      Topic temp = unselectedTopics[index];
                      setState(() {
                        userTopics.add(temp);
                        unselectedTopics.remove(temp);
                      });
                    },
                    child: Stack(
                      children: [
                        Container(

                          child: Padding(
                            padding: const EdgeInsets.only(
                              top: 8, bottom: 8,),
                            child: Text(
                              unselectedTopics[index].title, textAlign: TextAlign.center,
                              style: TextStyle(color: Colors.white),
                            ),
                          ),
                          width: 10000,
                          decoration: BoxDecoration(
                              color: unselectedTopics[index].title != "Gymer"
                                  ? Color(StringToHex.toColor(
                                  unselectedTopics[index].title))
                                  : Color(defaultTagsColor),
                              borderRadius: BorderRadius.circular(10)),
                        ),

                      ],
                    ),
                  );
                })),
          ],
        ),
      );
  }
}
