import 'package:flutter/material.dart';
import 'package:flutter_app/Model/FoodRespondModel.dart';
import 'package:flutter_app/Services/APIService.dart';

import 'package:flutter_app/StaticComponent/FoodWidget.dart';

import '../config.dart';
import '../constants.dart';
class FoodActivity extends StatefulWidget {
  @override
  _FoodActivityState createState() => _FoodActivityState();
}

class _FoodActivityState extends State<FoodActivity> {
  FoodRespondModel food;
  List<FoodWidget> foodData = [];
  final double appBarHeight = AppBar().preferredSize.height;
  TextEditingController _foodController;
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    fetchData();
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
            color: Colors.white,
            borderRadius: BorderRadius.circular(30)
          ),
          child: TextField(
            controller: _foodController,
            cursorColor: appPrimaryColor,
            decoration: InputDecoration(
              hintStyle: TextStyle(fontSize: appBarHeight * 0.3),
              hintText: "Search",
              suffixIcon: Icon(Icons.search),
              border: InputBorder.none,
              contentPadding:
              EdgeInsets.only(left: 15, bottom: 5, top: 5, right: 15),
            ),
          )
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

      body: RefreshIndicator(
        child: ListView(children: foodData,),
        onRefresh: _refresh,
      ),
    );;
  }
  Future<void> _refresh() async {
    fetchData();
    return;
  }
  void fetchData() async{
    var temp = await APIService.getFood();
    List<FoodWidget> tempFoodData = [];
    for (var i in temp.data.foods){
      tempFoodData.add(FoodWidget(food: i,));
    }
    setState(() {
      foodData = tempFoodData;
    });
  }
}
