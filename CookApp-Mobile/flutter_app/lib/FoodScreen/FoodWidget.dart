import 'dart:async';

import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:rating_bar_flutter/rating_bar_flutter.dart';
import 'package:readmore/readmore.dart';
import 'package:tastify/FoodScreen/FoodInstructionWidget.dart';
import 'package:tastify/FoodScreen/RatingActivity.dart';
import 'package:tastify/FoodScreen/ShareFoodActivity.dart';
import 'package:tastify/Model/FoodRespondModel.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:tastify/Model/SaveFoodRequestModel.dart';
import 'package:tastify/ProfileScreen/ProfileActivity.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:tastify/config.dart';
import 'package:tastify/constants.dart';

class FoodWidget extends StatefulWidget {
  final Foods food;

  const FoodWidget({
    this.food,
  });

  @override
  _FoodWidgetState createState() => _FoodWidgetState(food: this.food,rating: this.food.rating.toDouble(),saveType: this.food.saveType);
}

class _FoodWidgetState extends State<FoodWidget> {
  final Foods food;
  double rating;
  String saveType;
  String ingredients = "";
  FToast fToast;
  _FoodWidgetState({this.food,this.rating,this.saveType});
  FutureOr updateRating(dynamic value) async{
    var data = await APIService.getFoodById(widget.food.id);
    print("ln");
    setState(() {
      rating = data.data.rating.toDouble();

    });
  }
  FutureOr updateSave(dynamic value) async{
    var data = await APIService.getFoodById(widget.food.id);
    print("ln");
    setState(() {
      saveType = data.data.saveType;

    });

  }
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    fToast = FToast();
    fToast.init(context);
  }
  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;
    String ingredients = "";
    for (int i = 0; i < food.ingredients.length; i++) {
      if (food.ingredients[i].name != null) {
        if (i == food.ingredients.length) {
          ingredients = ingredients + food.ingredients[i].name;
        } else {
          ingredients = ingredients + food.ingredients[i].name + ", ";
        }
      }
    }
    return Container(
        margin: EdgeInsets.only(bottom: 10),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.5),
              blurRadius: 4,
              offset: Offset(0, 3),
            )
          ]
        ),
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(
            children: [
              Padding(
                padding: EdgeInsets.only(left: 10, right: 10),
                child: GestureDetector(
                  onTap: (){

                    Navigator.push(
                        context,
                        PageRouteBuilder(
                            pageBuilder: (context, animation,
                                secondaryAnimation) =>
                                ProfileActivity(
                                  userId: food.author.id,
                                ),
                            transitionsBuilder: (context,
                                animation,
                                secondaryAnimation,
                                child) {
                              return FadeTransition(opacity: animation, child: child,);
                            }));
                  },
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      CircleAvatar(
                        radius: 17,
                        backgroundColor: Colors.grey,
                        backgroundImage: NetworkImage(food.author.avatar.url),
                      ),

                      SizedBox(
                        width: size.width * 0.04,
                      ),
                      Text(food.author.displayName, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                      SizedBox(width: 3,),
                      food.author.isNutritionist ? Icon(Icons.check_circle, color: Colors.blue, size: 15,) : Container()
                    ],
                  ),
                ),
              ),
              GestureDetector(
                onTap: (){
                  openInstruction(context: context, id: food.id, name: food.name);
                },
                child: Container(
                  margin:
                      EdgeInsets.only(left: 10, top: 15, right: 10, bottom: 15),
                  child: ClipRRect(
                    borderRadius: BorderRadius.all(Radius.circular(15.0)),
                    child: Image.network(
                      food.photos[0].url,
                      //"https://image.cooky.vn/recipe/g6/54859/s1242/cooky-recipe-637387013241463008.jpg",
                      fit: BoxFit.cover,
                      height: size.height * 0.5,
                    ),
                  ),
                ),
              ),
              GestureDetector(
                onTap: (){
                  openInstruction(context: context, id: food.id, name: food.name);
                },
                child: Center(
                  child: Text(
                    food.name,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
              SizedBox(
                height: 10,
              ),
              GestureDetector(
                onTap: (){
                  openInstruction(context: context, id: food.id, name: food.name);
                },
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      FontAwesomeIcons.clock,
                      size: 16,
                    ),
                    Text(
                      " " + food.totalTime.toString() + " minutes ",
                      style: TextStyle(fontSize: 16),
                    ),
                    SizedBox(
                      width: 10,
                    ),
                    Icon(
                      FontAwesomeIcons.user,
                      size: 16,
                    ),
                    food.servings == 1
                        ? Text(
                            " " + food.servings.toString() + " person",
                            style: TextStyle(fontSize: 16),
                          )
                        : Text(
                            " " + food.servings.toString() + " people",
                            style: TextStyle(fontSize: 16),
                          )
                  ],
                ),
              ),
              SizedBox(
                height: 10,
              ),
              GestureDetector(
                onTap: (){
                  openInstruction(context: context, id: food.id, name: food.name);
                },
                child: Container(
                    margin: EdgeInsets.only(left: 10, right: 10, bottom: 10),
                    child: ReadMoreText(food.description,
                        textAlign: TextAlign.justify,
                        trimLines: 3,
                        trimMode: TrimMode.Line,
                        trimCollapsedText: 'Show more',
                        trimExpandedText: 'Show less',

                        style: TextStyle(
                            fontSize: 14, color: Colors.black),
                        lessStyle: TextStyle(
                            fontSize: 14, fontWeight: FontWeight.bold) ,
                        moreStyle: TextStyle(
                            fontSize: 14, fontWeight: FontWeight.bold))),
              ),
              Container(
                margin: EdgeInsets.only(left: 10,right: 10),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    rating > 0 ? GestureDetector(
                      onTap: (){
                        Navigator.push(
                            context,
                            PageRouteBuilder(
                                pageBuilder: (context, animation,
                                    secondaryAnimation) =>
                                    RatingActivity(foodId: widget.food.id, foodUrl: widget.food.photos[0].url,),
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
                                })).then(updateRating);
                      },
                      child:  Row(
                        children: [
                          RatingBarFlutter.readOnly(
                            initialRating: rating - rating.floor() > 0 ? rating.floor() + 0.5 : rating ,
                            isHalfAllowed: true,
                            aligns: Alignment.centerLeft,
                            halfFilledIcon: Icons.star_half,
                            filledIcon: Icons.star,
                            emptyIcon: Icons.star_border,
                            size: 20,
                            filledColor: starColor,
                            halfFilledColor: starColor,
                          ),
                          SizedBox(width: 5,),
                          GestureDetector(child: Text(rating.toStringAsPrecision(2))),
                        ],
                      ),
                    ) : Text("No ratings"),


                    GestureDetector(
                      onTap: (){


                        return showModalBottomSheet(
                            context: context,
                            builder: (context) {
                              return saveType == Config.foodUnsaved ? Container(
                                color: Color(0xFF737373),
                                child: Container(
                                  decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.only(
                                        topLeft: const Radius.circular(29),
                                        topRight: const Radius.circular(29),
                                      )),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    mainAxisSize: MainAxisSize.min,
                                    children: <Widget>[
                                      Icon(Icons.remove, color: Colors.grey),
                                      Text(
                                        "Save",
                                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
                                      ),
                                      Divider(),
                                      ListTile(
                                        leading: Icon(
                                          FontAwesomeIcons.circleCheck,
                                          color: Colors.green,
                                        ),
                                        title: Text(
                                          "Should",
                                          style: TextStyle(fontSize: 16),
                                        ),
                                        onTap: () async{

                                          Navigator.of(context).pop();

                                          APIService.saveFood(SaveFoodRequestModel(type: Config.shouldFoodType, forceUpdate: true), food.id).then((value) {
                                            _showToast(value.meta.messages[0], size);
                                            return updateSave(value);

                                          });



                                        },
                                      ),
                                      Divider(),
                                      ListTile(
                                        leading: Icon(
                                          FontAwesomeIcons.circleXmark,
                                          color: Colors.red,
                                        ),
                                        title: Text(
                                          "Should not",
                                          style: TextStyle(fontSize: 16),
                                        ),
                                        onTap: () {
                                          Navigator.of(context).pop();

                                          APIService.saveFood(SaveFoodRequestModel(type: Config.shouldnotFoodType, forceUpdate: true), food.id).then((value) {
                                            _showToast(value.meta.messages[0], size);
                                            return updateSave(value);

                                          });

                                        },
                                      ),
                                      Divider(),
                                      SizedBox(height: 20,)
                                    ],
                                  ),
                                ),
                              ) : saveType == Config.shouldFoodType ? Container(
                                color: Color(0xFF737373),
                                child: Container(
                                  decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.only(
                                        topLeft: const Radius.circular(29),
                                        topRight: const Radius.circular(29),
                                      )),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    mainAxisSize: MainAxisSize.min,
                                    children: <Widget>[
                                      Icon(Icons.remove, color: Colors.grey),
                                      Text(
                                        "Save",
                                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
                                      ),
                                      Divider(),
                                      ListTile(
                                        leading: Icon(
                                          FontAwesomeIcons.fileCircleXmark,
                                          color: Colors.grey,
                                        ),
                                        title: Text(
                                          "Unsaved",
                                          style: TextStyle(fontSize: 16),
                                        ),
                                        onTap: () {
                                          Navigator.of(context).pop();

                                          APIService.unSaveFood(food.id).then((value) {
                                            _showToast(value.meta.messages[0], size);
                                            return updateSave(value);

                                          });
                                        },
                                      ),
                                      Divider(),
                                      ListTile(
                                        leading: Icon(
                                          FontAwesomeIcons.circleXmark,
                                          color: Colors.red,
                                        ),
                                        title: Text(
                                          "Should not",
                                          style: TextStyle(fontSize: 16),
                                        ),
                                        onTap: () {
                                          Navigator.of(context).pop();

                                          APIService.saveFood(SaveFoodRequestModel(type: Config.shouldnotFoodType, forceUpdate: true), food.id).then((value) {
                                            _showToast(value.meta.messages[0], size);
                                            return updateSave(value);

                                          });

                                        },
                                      ),
                                      Divider(),
                                      SizedBox(height: 20,)
                                    ],
                                  ),
                                ),
                              ): saveType == Config.shouldnotFoodType ? Container(
                                color: Color(0xFF737373),
                                child: Container(
                                  decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.only(
                                        topLeft: const Radius.circular(29),
                                        topRight: const Radius.circular(29),
                                      )),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    mainAxisSize: MainAxisSize.min,
                                    children: <Widget>[
                                      Icon(Icons.remove, color: Colors.grey),
                                      Text(
                                        "Save",
                                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
                                      ),
                                      Divider(),
                                      ListTile(
                                        leading: Icon(
                                          FontAwesomeIcons.fileCircleXmark,
                                          color: Colors.grey,
                                        ),
                                        title: Text(
                                          "Unsaved",
                                          style: TextStyle(fontSize: 16),
                                        ),
                                        onTap: () {
                                          Navigator.of(context).pop();

                                          APIService.unSaveFood(food.id).then((value) {
                                            _showToast(value.meta.messages[0], size);
                                            return updateSave(value);

                                          });
                                        },
                                      ),
                                      Divider(),
                                      ListTile(
                                        leading: Icon(
                                          FontAwesomeIcons.circleCheck,
                                          color: Colors.green,
                                        ),
                                        title: Text(
                                          "Should",
                                          style: TextStyle(fontSize: 16),
                                        ),
                                        onTap: () async{

                                          Navigator.of(context).pop();

                                          APIService.saveFood(SaveFoodRequestModel(type: Config.shouldFoodType, forceUpdate: true), food.id).then((value) {
                                            _showToast(value.meta.messages[0], size);
                                            return updateSave(value);

                                          });
                                        },
                                      ),
                                      Divider(),
                                      SizedBox(height: 20,)
                                    ],
                                  ),
                                ),
                              ):Container();
                            });
                      },
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          Icon(
                            saveType == Config.foodUnsaved ? FontAwesomeIcons.solidFloppyDisk : saveType == Config.shouldFoodType ? FontAwesomeIcons.circleCheck : FontAwesomeIcons.circleXmark,
                            color: saveType == Config.foodUnsaved ? Colors.grey : saveType == Config.shouldFoodType ? Colors.green : Colors.red, size: 20,),
                          SizedBox(width: 5,),
                          Text("Save")
                        ],
                      ),
                    ),
                    GestureDetector(
                      onTap: (){
                        Navigator.push(
                            context,
                            PageRouteBuilder(
                                pageBuilder: (context, animation,
                                    secondaryAnimation) =>
                                    ShareFoodActivity(
                                      food: this.food,

                                    ),
                                transitionsBuilder: (context,
                                    animation,
                                    secondaryAnimation,
                                    child) {
                                  return FadeTransition(opacity: animation, child: child,);
                                }));
                      },
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [

                          Icon(Icons.share_outlined, color: Colors.grey, size: 20,),
                          SizedBox(width: 5,),
                          Text("Share")
                        ],
                      ),
                    ),
                  ],
                ),
              )
            ],
          ),
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
  void openInstruction({BuildContext context, String id, String name}) {
    Navigator.push(
        context,
        PageRouteBuilder(
            pageBuilder: (context, animation,
                secondaryAnimation) =>
                FoodInstructionWidget(
                  id: id,
                  name: name,
                ),
            transitionsBuilder: (context,
                animation,
                secondaryAnimation,
                child) {
              return FadeTransition(opacity: animation, child: child,);
            })).then(updateRating);
  }
}
