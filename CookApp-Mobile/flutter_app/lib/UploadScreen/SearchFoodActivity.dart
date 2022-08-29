import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:tastify/Model/Food.dart';
import 'package:tastify/Services/APIService.dart';

import '../constants.dart';
class SearchFoodActivity extends StatefulWidget {
  @override
  _SearchFoodActivityState createState() => _SearchFoodActivityState();
}

class _SearchFoodActivityState extends State<SearchFoodActivity> {
  TextEditingController searchController = TextEditingController();
  bool circular = true;
  int offset = 0;
  int offsetQuery = 0;
  List<Food> foodData = [];
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
  void fetchData() async{
    var temp = await APIService.getFood(offset);
    List<Food> tempFoodData = [];
    for (var i in temp.data.foods) {
      tempFoodData.add(Food(
        id: i.id,
        photo: i.photos[0].url,
        description: i.description,
        name: i.name
      ));
    }
    setState(() {
      offset++;
      foodData = tempFoodData;
      circular = false;
    });
  }
  void _getMoreData() async {
    List<Food> tempFoodData = [];
    if (searchController.text == "" || searchController.text == null) {
      var temp = await APIService.getFood(offset);
      for (var i in temp.data.foods) {
        tempFoodData.add(Food(
            id: i.id,
            photo: i.photos[0].url,
            description: i.description,
            name: i.name
        ));
      }
      setState(() {
        foodData.addAll(tempFoodData);
        offset++;
      });
    } else {
      var temp = await APIService.getFoodByQuery(offsetQuery, searchController.text);
      for (var i in temp.data.foods) {
        tempFoodData.add(Food(
            id: i.id,
            photo: i.photos[0].url,
            description: i.description,
            name: i.name
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
    if (searchController.text != "") {
      var temp = await APIService.getFoodByQuery(offsetQuery, text);
      List<Food> tempFoodData = [];
      for (var i in temp.data.foods) {
        tempFoodData.add(Food(
            id: i.id,
            photo: i.photos[0].url,
            description: i.description,
            name: i.name
        ));
      }
      setState(() {
        foodData = tempFoodData;
        circular = false;
        offsetQuery++;
      });
    } else {
      var temp = await APIService.getFood(offset);
      List<Food> tempFoodData = [];
      for (var i in temp.data.foods) {
        tempFoodData.add(Food(
            id: i.id,
            photo: i.photos[0].url,
            description: i.description,
            name: i.name
        ));
      }
      setState(() {
        foodData = tempFoodData;
        circular = false;
        offset++;
      });
    }
  }
  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;
    return DraggableScrollableSheet(
        minChildSize: 0.5,
        maxChildSize: 0.9,
        initialChildSize: 0.9,
        builder: (_, controller) => Container(
          decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(
                top: Radius.circular(15),
              )),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                  padding: EdgeInsets.all(8),
                  child: Center(
                      child: TextField(
                        controller: searchController,
                        cursorColor: Colors.black,
                        decoration: InputDecoration(

                          hintText: "Search",
                          fillColor: backGroundFoodScreenColor,
                          filled: true,
                          focusedBorder:OutlineInputBorder(
                            borderSide: const BorderSide(color: Colors.black, width: 0.5),
                            borderRadius: BorderRadius.circular(25.0),
                          ),

                          suffixIcon: IconButton(
                            icon: Icon(Icons.search,color: appPrimaryColor,),
                            onPressed: () {
                              queryData(searchController.text);
                            },
                          ),
                          border: OutlineInputBorder(
                            borderSide: const BorderSide(color: Colors.black, width: 0.5),
                            borderRadius: BorderRadius.circular(25.0),
                          ),
                          contentPadding:
                          EdgeInsets.only(left: 15, bottom: 5, top: 5, right: 15),
                        ),
                      ))),
              Divider(
                height: 10.0,
                color: Colors.grey.withOpacity(0.5),
              ),
              circular ? Expanded(child: Center(child: CircularProgressIndicator())) :Expanded(
                child: ListView.builder(
                  controller: _scrollController,
                  shrinkWrap: true,
                  itemCount: foodData.length + 1,
                  itemBuilder: (context, index) {
                    if (index == foodData.length) {
                      return CupertinoActivityIndicator();
                    }
                    return GestureDetector(
                      onTap: (){
                        Navigator.of(context).pop(foodData[index]);
                      },
                      child: Column(
                        children: [
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                margin: EdgeInsets.all(8),
                                decoration: BoxDecoration(shape: BoxShape.circle),
                                child: Image.network(
                                  foodData[index].photo,
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
                                        foodData[index].name,
                                        style:
                                        TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      Text(
                                      foodData[index].description,
                                        style: TextStyle(color: Colors.grey, fontSize: 14),
                                        softWrap: false,
                                        maxLines: 3,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ],
                                  ),
                                ),
                              )
                            ],
                          ),
                          Divider(),
                        ],
                      ),
                    );

                  },
                ),
              ),

            ],
          ),
        ));
  }

}
