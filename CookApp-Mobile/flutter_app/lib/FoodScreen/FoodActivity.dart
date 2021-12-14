import 'package:flutter/material.dart';
import 'package:flutter_app/Model/FoodRespondModel.dart';
import 'package:flutter_app/Services/APIService.dart';
class FoodActivity extends StatefulWidget {
  @override
  _FoodActivityState createState() => _FoodActivityState();
}

class _FoodActivityState extends State<FoodActivity> {
  FoodRespondModel food;
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    fetchData();
  }
  @override
  Widget build(BuildContext context) {
    return Container();
  }

  void fetchData() async{
    var temp = await APIService.getFood();
    setState(() {
      food = temp;
    });
  }
}
