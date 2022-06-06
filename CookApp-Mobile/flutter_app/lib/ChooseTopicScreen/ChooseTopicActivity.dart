import 'package:flutter/material.dart';
import 'package:snippet_coder_utils/ProgressHUD.dart';
import 'package:tastify/ChooseTopicScreen/Topic.dart';
import 'package:tastify/HomeScreen/HomeActivity.dart';
import 'package:tastify/Model/InterestTopicRequestModel.dart';

import 'package:tastify/Model/TopicsRespondModel.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:tastify/Services/Auth.dart';

import '../constants.dart';

class ChooseTopicActivity extends StatefulWidget {
  @override
  _ChooseTopicActivityState createState() => _ChooseTopicActivityState();
}

class _ChooseTopicActivityState extends State<ChooseTopicActivity> {
  List<Topic> topics = [];
  int totalSelected = 0;
  bool circular = true;
  bool isAPIcallProcess = false;
  GlobalKey<FormState> globalFormKey = GlobalKey<FormState>();
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    fetchData();
  }

  void fetchData() async {
    var dataTopics = await APIService.getTags();
    List<Topic> temp = [];
    for (var i in dataTopics.data.topics) {
      temp.add(
          Topic(title: i.title, url: i.cover.url, id: i.id, isSelected: false));
    }
    setState(() {
      topics = temp;
      circular = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;
    return Scaffold(
      body: ProgressHUD(
        child: Form(
          key: globalFormKey,
          child: _chooseTopicUI(context,size),
        ),
        inAsyncCall: isAPIcallProcess,
        key: UniqueKey(),
        opacity: 0.3,
      ),
      floatingActionButton: circular ? null : FloatingActionButton(
        backgroundColor: totalSelected > 1 ? appPrimaryColor : Colors.grey,
        onPressed: totalSelected > 1 ? () async{
          setState(() {
            isAPIcallProcess = true;
          });
          List<String> selectedTopic = [];
          for (var i in topics){
            if(i.isSelected){
              selectedTopic.add(i.id);
            }
          };
          await APIService.chooseTopic(InterestTopicRequestModel(topicIds: selectedTopic));
          setState(() {
            isAPIcallProcess = false;
          });
          Navigator.push(
              context,
              PageRouteBuilder(
                  pageBuilder: (context, animation,
                      secondaryAnimation) =>
                      HomeActivity(
                        auth: Auth(),
                      ),
                  transitionsBuilder: (context,
                      animation,
                      secondaryAnimation,
                      child) {
                    const begin = Offset(1.0, 0.0);
                    const end = Offset.zero;
                    const curve = Curves.easeOut;

                    var tween = Tween(
                        begin: begin, end: end)
                        .chain(
                        CurveTween(curve: curve));

                    return SlideTransition(
                      position:
                      animation.drive(tween),
                      child: child,
                    );
                  }));
        }: null,

        child: Text("Start"),
      ),
    );
  }
  Widget _chooseTopicUI(BuildContext context, Size size){
    return circular
        ? Center(child: CircularProgressIndicator())
        : SingleChildScrollView(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            height: size.height * 0.06,
          ),
          Center(
            child: SizedBox(
              height: size.height * 0.05,
              child: Image.asset("assets/images/diet.png",
                  fit: BoxFit.contain),
            ),
          ),
          SizedBox(
            height: size.height * 0.04,
          ),
          Padding(
            padding: const EdgeInsets.only(left: 16, right: 16),
            child: Text(
              "What do you want to see on Tastify?",
              maxLines: 3,
              style:
              TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(left: 16, right: 16,top: 16),
            child: Text(
              "Select at least 2 interests to personalize your Tastify experience.",
              maxLines: 3,
              style:
              TextStyle(fontSize: 15, color: Colors.black.withOpacity(0.5)),
            ),
          ),
          SizedBox(
            height: size.height * 0.01,
          ),
          Divider(
            thickness: 0.7,
          ),
          Padding(
            padding: const EdgeInsets.only(left: 10, right: 10,bottom: 15),
            child: GridView.builder(
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 0.9,
                  mainAxisSpacing: 15,
                  crossAxisSpacing: 15,
                ),
                physics: NeverScrollableScrollPhysics(),
                padding: EdgeInsets.only(top: 15),
                shrinkWrap: true,
                itemCount: topics.length,
                itemBuilder: (BuildContext context, int index) {
                  return GestureDetector(
                      onTap: () {
                        setState(() {
                          if(topics[index].isSelected){
                            totalSelected--;
                          } else{
                            totalSelected++;
                          }
                          topics[index].isSelected =
                          !topics[index].isSelected;
                        });
                      },
                      child: _topicTitle(context, size, topics[index]));
                }),
          )
        ],
      ),
    );
  }
  Widget _topicTitle(BuildContext context, Size size, Topic topic) {
    return Stack(children: [
      Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.all(Radius.circular(10.0)),
          border: Border.all(color: Colors.grey),
          image: DecorationImage(
            image: NetworkImage(topic.url),
            fit: BoxFit.cover,
          ),

        ),

        child: Align(
          alignment: Alignment.bottomLeft,
          child: Padding(
            padding: const EdgeInsets.only(bottom: 20, left: 10, right: 10),
            child: Container(
              color: Colors.black,
              child: Padding(
                padding: const EdgeInsets.only(
                    left: 8, right: 8, bottom: 3.0, top: 3.0),
                child: Text(
                  topic.title,
                  maxLines: 2,
                  style: TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ),
        ),
      ),
      topic.isSelected
          ? Positioned(
              bottom: 130,
              right: 10,
              child: GestureDetector(
                onTap: () async {},
                child: Container(
                  decoration: BoxDecoration(
                      shape: BoxShape.circle, color: Colors.white),
                  child: Icon(
                    Icons.check_circle,
                    size: 20,
                    color: Colors.blue,
                  ),
                ),
              ))
          : Container()
    ]);
  }
}
