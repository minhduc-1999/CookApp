import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:tastify/Model/FoodRespondModel.dart';
import 'package:youtube_player_flutter/youtube_player_flutter.dart';

import '../constants.dart';

class FoodInstructionWidget extends StatefulWidget {
  final Foods food;

  const FoodInstructionWidget({
    this.food,
  });

  @override
  _FoodInstructionWidgetState createState() =>
      _FoodInstructionWidgetState(this.food);
}

class _FoodInstructionWidgetState extends State<FoodInstructionWidget> {
  final Foods food;

  _FoodInstructionWidgetState(this.food);

  List<String> ingredients = [];
  List<Steps> steps = [];
  @override
  Widget build(BuildContext context) {
    final double height = MediaQuery.of(context).size.height;
    ingredients.clear();
    steps.clear();
    for (var i in food.ingredients) {
      if (i.unit != null) {
        ingredients.add(i.unit.value.toString() + " " + i.unit.unit + " " + i.name);
      } else if (i.name != null) {
        ingredients.add(i.name);
      }
    }
    for (var i in food.steps){
      steps.add(i);
    }
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: true,
        brightness: Brightness.dark,
        title: Text(
          food.name,
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
      body: Container(
        margin: EdgeInsets.all(8),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.all(Radius.circular(5.0)),
                child: Image.network(
                  food.photos[0],
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
                  return Ingredient(info: item,);
                }).toList(),
              ),
              SizedBox(height: 20,),
              Text(
                "Instructions",
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              Column(
                children: steps.map((item) {
                  return Step(step: item,index: steps.indexOf(item) + 1, height: height,);
                }).toList(),
              ),
              SizedBox(height: 20,),
              Text(
                "Video",
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 10,),
              Container(
                child: YoutubePlayerBuilder(
                  player: YoutubePlayer(
                    controller: YoutubePlayerController(
                      initialVideoId: YoutubePlayer.convertUrlToId("https://www.youtube.com/watch?v=cLeFx__w0lg"),
                      flags: YoutubePlayerFlags(
                          autoPlay: false
                      ),

                    ),
                    showVideoProgressIndicator: true,
                    progressIndicatorColor: Colors.blue,
                    progressColors: ProgressBarColors(
                        playedColor: Colors.blue,
                        handleColor: Colors.blueAccent
                    ),
                  ),
                  builder: (context, player){
                    return Column(
                      children: [
                        player
                      ],
                    );
                  },
                ),
              ),

            ],
          ),
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
            style: TextStyle(
              fontSize: 14
            ),
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
class Step extends StatelessWidget {
  final Steps step;
  final int index;
  final double height;

  const Step({this.step, this.index, this.height});
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(top: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            index.toString() + ". " + step.content,
            style: TextStyle(
                fontSize: 14
            ),
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
    );;
  }

}


