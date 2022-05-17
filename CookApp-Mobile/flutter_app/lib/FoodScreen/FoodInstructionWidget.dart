import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:snippet_coder_utils/ProgressHUD.dart';
import 'package:tastify/CommentScreen/CommentActivity.dart';
import 'package:tastify/FoodScreen/RateActivity.dart';
import 'package:tastify/Model/FoodInstructionRespondModel.dart';
import 'package:tastify/Services/APIService.dart';

import 'package:youtube_player_flutter/youtube_player_flutter.dart';

import '../config.dart';
import '../constants.dart';

class FoodInstructionWidget extends StatefulWidget {
  final String id;
  final String name;

  const FoodInstructionWidget({this.id, this.name});

  @override
  _FoodInstructionWidgetState createState() =>
      _FoodInstructionWidgetState(this.id, this.name);
}

class _FoodInstructionWidgetState extends State<FoodInstructionWidget> {
  FoodInstructionRespondModel food = FoodInstructionRespondModel();
  final String id;
  final String name;
  bool circular = true;
  bool isAPIcallProcess = false;
  FToast fToast;
  GlobalKey<FormState> globalFormKey = GlobalKey<FormState>();

  _FoodInstructionWidgetState(this.id, this.name);

  List<String> ingredients = [];
  List<Steps> steps = [];

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    fToast = FToast();
    fToast.init(context);
    fetchData();

  }

  void fetchData() async {
    var temp = await APIService.getFoodInstruction(id);
    setState(() {
      food = temp;
      circular = false;
      for (var i in food.data.ingredients) {
        ingredients.add(
            i.quantity.toString() + " " + i.unit.toString() + " " + i.name);
      }
      for (var i in food.data.steps) {
        steps.add(i);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final double height = MediaQuery.of(context).size.height;
    /*ingredients.clear();
    steps.clear();
    for (var i in food.data.ingredients) {
      ingredients.add(i.quantity.toString() + " " + i.unit.toString() + " " + i.name);
    }
    for (var i in food.data.steps) {
      steps.add(i);
    }*/
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: true,
        brightness: Brightness.dark,
        title: Text(
          name,
        ),
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: <Color>[appPrimaryColor, appPrimaryColor],
            ),
          ),
        ),
      ),
      body: ProgressHUD(
        child: Form(
          key: globalFormKey,
          child: _foodInstructionUI(context, height),
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
  Widget _foodInstructionUI(BuildContext context, double height) {
    return circular
        ? Center(child: CircularProgressIndicator())
        : Container(
            margin: EdgeInsets.all(8),
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.all(Radius.circular(5.0)),
                    child: Image.network(
                      food.data.photos[0].url,
                      fit: BoxFit.cover,
                      height: height * 0.5,
                    ),
                  ),
                  SizedBox(
                    height: 20,
                  ),
                  Text(
                    "Ingredients",
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                  Column(
                    children: ingredients.map((item) {
                      return Ingredient(
                        info: item,
                      );
                    }).toList(),
                  ),
                  SizedBox(
                    height: 10,
                  ),
                  Text(
                    "Instructions",
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                  /* Column(
                  children: steps.map((item) {
                    return StepItem(step: item,index: steps.indexOf(item) + 1, height: height,);
                  }).toList(),
                ),*/
                  StepItem(
                    steps: steps,
                  ),
                  food.data.videoUrl != null
                      ? Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Video",
                              style: TextStyle(
                                  fontSize: 22, fontWeight: FontWeight.bold),
                            ),
                            SizedBox(
                              height: 10,
                            ),
                            Container(
                              child: YoutubePlayerBuilder(
                                player: YoutubePlayer(
                                  controller: YoutubePlayerController(
                                    initialVideoId:
                                        YoutubePlayer.convertUrlToId(
                                            food.data.videoUrl),
                                    flags: YoutubePlayerFlags(autoPlay: false),
                                  ),
                                  showVideoProgressIndicator: true,
                                  progressIndicatorColor: Colors.blue,
                                  progressColors: ProgressBarColors(
                                      playedColor: Colors.blue,
                                      handleColor: Colors.blueAccent),
                                ),
                                builder: (context, player) {
                                  return Column(
                                    children: [player],
                                  );
                                },
                              ),
                            ),
                          ],
                        )
                      : Container(),
                  SizedBox(
                    height: 20,
                  ),
                  GestureDetector(
                    onTap: () async {
                      TextEditingController commentController =
                          TextEditingController();
                      setState(() {
                        isAPIcallProcess = true;
                      });
                      var userVoteData = await APIService.getUserVote(this.id);
                      if (userVoteData.meta.ok) {
                        commentController.text = userVoteData.data.comment;
                      }
                      setState(() {
                        isAPIcallProcess = false;
                      });
                      return showModalBottomSheet(
                        context: context,
                        builder: (BuildContext context) {
                          return RateActivity(
                              foodId: this.id,
                              foodUrl: this.food.data.photos[0].url,
                              voted: userVoteData.meta.ok ? true : false,
                              userRating: userVoteData.meta.ok
                                  ? userVoteData.data.star.toDouble()
                                  : 1,
                              commentController: commentController);
                        },
                        isScrollControlled: true,
                      ).then((value) {
                        if (value == "Rated") {
                          _showToast("Rating food successfully!", MediaQuery.of(context).size);
                        }
                      });
                    },
                    child: Center(
                      child: Container(
                        decoration: BoxDecoration(
                            color: appPrimaryColor,
                            borderRadius:
                                BorderRadius.all(Radius.circular(20))),
                        child: Padding(
                          padding: const EdgeInsets.only(
                              top: 10, bottom: 10, left: 25, right: 25),
                          child: Text(
                            "Rate Food",
                            style: TextStyle(color: Colors.white, fontSize: 16),
                          ),
                        ),
                      ),
                    ),
                  ),
                  SizedBox(
                    height: 20,
                  ),
                ],
              ),
            ),
          );
  }
}

class Ingredient extends StatelessWidget {
  final String info;

  const Ingredient({this.info});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(top: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            info,
            style: TextStyle(fontSize: 14),
          ),
          Divider(
            height: 10.0,
            color: Colors.grey.withOpacity(0.5),
          )
        ],
      ),
    );
  }
}

/*class StepItem extends StatelessWidget {
  final Steps step;
  final int index;
  final double height;

  const StepItem({this.step, this.index, this.height});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(top: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            index.toString() + ". " + step.content,
            style: TextStyle(fontSize: 14),
          ),
          SizedBox(
            height: 10,
          ),
          ClipRRect(
            borderRadius: BorderRadius.all(Radius.circular(5.0)),
            child: Image.network(
              step.photos[0],
              fit: BoxFit.cover,
              height: height * 0.2,
              width: height * 0.2,
            ),
          )
        ],
      ),
    );
    ;
  }
}*/

class StepItem extends StatefulWidget {
  final List<Steps> steps;

  const StepItem({Key key, this.steps}) : super(key: key);

  @override
  _StepItemState createState() => _StepItemState(this.steps);
}

class _StepItemState extends State<StepItem> {
  final List<Steps> steps;
  int currentStep = 0;

  _StepItemState(this.steps);

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Theme(
        data: Theme.of(context)
            .copyWith(colorScheme: ColorScheme.light(primary: appPrimaryColor)),
        child: Stepper(
          steps: steps.map((item) {
            return Step(
                isActive: currentStep == steps.indexOf(item),
                title: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      "Step " + (steps.indexOf(item) + 1).toString(),
                      style: TextStyle(fontSize: 16),
                    ),
                    currentStep == steps.indexOf(item)
                        ? GestureDetector(
                            child: Icon(
                              FontAwesomeIcons.comment,
                              size: 25.0,
                            ),
                            onTap: () {
                              return showModalBottomSheet(
                                context: context,
                                builder: (BuildContext context) {
                                  return CommentActivity(
                                    targetId: steps[currentStep].id,
                                    targetType: Config.stepCommentsType,
                                    stepName:
                                        "Step " + (currentStep + 1).toString(),
                                  );
                                },
                                isScrollControlled: true,
                                backgroundColor: Colors.transparent,
                              );
                            },
                          )
                        : Container()
                  ],
                ),
                content: Text(item.content));
          }).toList(),
          onStepTapped: (int index) {
            setState(() {
              currentStep = index;
            });
          },
          physics: ClampingScrollPhysics(),
          currentStep: currentStep,
          controlsBuilder: (BuildContext context,
              {VoidCallback onStepContinue, VoidCallback onStepCancel}) {
            return Row(
              children: <Widget>[
                Container(
                  child: null,
                ),
                Container(
                  child: null,
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
