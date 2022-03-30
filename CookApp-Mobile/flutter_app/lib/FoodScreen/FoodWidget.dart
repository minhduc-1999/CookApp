import 'package:flutter/material.dart';
import 'package:readmore/readmore.dart';
import 'package:tastify/FoodScreen/FoodInstructionWidget.dart';
import 'package:tastify/Model/FoodRespondModel.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class FoodWidget extends StatefulWidget {
  final Foods food;

  const FoodWidget({
    this.food,
  });

  @override
  _FoodWidgetState createState() => _FoodWidgetState(this.food);
}

class _FoodWidgetState extends State<FoodWidget> {
  final Foods food;

  _FoodWidgetState(this.food);

  @override
  Widget build(BuildContext context) {
    final double height = MediaQuery.of(context).size.height;
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
    return GestureDetector(
      onTap: () {
        openInstruction(context: context, id: food.id, name: food.name);
      },
      child: Container(
        margin: EdgeInsets.all(8.0),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.all(Radius.circular(20.0)),
        ),
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(
            children: [
              Container(
                margin:
                    EdgeInsets.only(left: 10, top: 15, right: 10, bottom: 15),
                child: ClipRRect(
                  borderRadius: BorderRadius.all(Radius.circular(5.0)),
                  child: Image.network(
                    food.photos[0].url,
                    //"https://image.cooky.vn/recipe/g6/54859/s1242/cooky-recipe-637387013241463008.jpg",
                    fit: BoxFit.cover,
                    height: height * 0.5,
                  ),
                ),
              ),
              Center(
                child: Text(
                  food.name,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              SizedBox(
                height: 10,
              ),
              Row(
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
              SizedBox(
                height: 10,
              ),
              Container(
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
            ],
          ),
        ),
      ),
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
            }));
  }
}
