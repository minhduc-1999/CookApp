import 'dart:async';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_client_sse/flutter_client_sse.dart';
import 'package:tastify/FoodScreen/CreateFoodActivity.dart';
import 'package:tastify/Model/FoodRespondModel.dart';
import 'package:tastify/Services/APIService.dart';

import '../main.dart';
import 'FoodWidget.dart';

import '../config.dart';
import '../constants.dart';

class FoodActivity extends StatefulWidget {
  @override
  _FoodActivityState createState() => _FoodActivityState();
}

class _FoodActivityState extends State<FoodActivity> {
  FoodRespondModel food;
  List<FoodWidget> foodData = [];

  bool circular = true;
  int offset = 0;
  int offsetQuery = 0;
  final double appBarHeight = AppBar().preferredSize.height;
  TextEditingController _foodController = TextEditingController();
  ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    fetchData();
    _scrollController.addListener(() {
      if (_scrollController.position.pixels ==
          _scrollController.position.maxScrollExtent) {
        _getMoreData();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: backGroundFoodScreenColor,
        appBar: AppBar(
          automaticallyImplyLeading: false,
          brightness: Brightness.dark,
          title: Container(
              height: appBarHeight * 0.7,
              margin: EdgeInsets.all(5.0),
              decoration: BoxDecoration(
                  color: Colors.white, borderRadius: BorderRadius.circular(30)),
              child: TextField(
                controller: _foodController,
                cursorColor: appPrimaryColor,
                decoration: InputDecoration(
                  hintStyle: TextStyle(fontSize: appBarHeight * 0.3),
                  hintText: "Search",
                  suffixIcon: IconButton(
                    icon: Icon(Icons.search),
                    onPressed: () {
                      queryData(_foodController.text);
                    },
                  ),
                  border: InputBorder.none,
                  contentPadding:
                      EdgeInsets.only(left: 15, bottom: 5, top: 5, right: 15),
                ),
              )),
          actions: [
            IconButton(
              onPressed: () {
                Navigator.push(
                    context,
                    PageRouteBuilder(
                        pageBuilder: (context, animation, secondaryAnimation) =>
                            CreateFoodActivity(),
                        transitionsBuilder:
                            (context, animation, secondaryAnimation, child) {
                          return FadeTransition(
                            opacity: animation,
                            child: child,
                          );
                        }));

              },
              icon: Icon(Icons.add_circle_rounded),
            )
          ],
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
        body: circular
            ? Center(child: CircularProgressIndicator())
            : ListView.builder(
                controller: _scrollController,
                itemBuilder: (context, i) {
                  if (i == foodData.length) {
                    return CupertinoActivityIndicator();
                  }
                  return foodData[i];
                },
                itemCount: foodData.length + 1,
              ));
  }

  void fetchData() async {
    var temp = await APIService.getFood(offset);
    List<FoodWidget> tempFoodData = [];

    for (var i in temp.data.foods) {
      tempFoodData.add(FoodWidget(
        food: i,
      ));
    }
    setState(() {
      offset++;
      foodData = tempFoodData;
      circular = false;
    });
  }

  void _getMoreData() async {
    List<FoodWidget> tempFoodData = [];
    if (_foodController.text == "" || _foodController.text == null) {
      var temp = await APIService.getFood(offset);
      for (var i in temp.data.foods) {
        tempFoodData.add(FoodWidget(
          food: i,
        ));
      }
      setState(() {
        foodData.addAll(tempFoodData);
        offset++;
      });
    } else {
      var temp =
          await APIService.getFoodByQuery(offsetQuery, _foodController.text);
      for (var i in temp.data.foods) {
        tempFoodData.add(FoodWidget(
          food: i,
        ));
      }
      setState(() {
        foodData.addAll(tempFoodData);
        offsetQuery++;
      });
    }
  }

  void queryData(String text) async {
    setState(() {
      circular = true;
      offsetQuery = 0;
      offset = 0;
    });
    if (_foodController.text != "") {
      var temp = await APIService.getFoodByQuery(offsetQuery, text);
      List<FoodWidget> tempFoodData = [];
      for (var i in temp.data.foods) {
        tempFoodData.add(FoodWidget(
          food: i,
        ));
      }
      setState(() {
        foodData = tempFoodData;
        circular = false;
        offsetQuery++;
      });
    } else {
      var temp = await APIService.getFood(offset);
      List<FoodWidget> tempFoodData = [];
      for (var i in temp.data.foods) {
        tempFoodData.add(FoodWidget(
          food: i,
        ));
      }
      setState(() {
        foodData = tempFoodData;
        circular = false;
        offset++;
      });
    }
  }
}
