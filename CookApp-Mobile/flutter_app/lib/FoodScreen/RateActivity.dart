import 'package:flutter/material.dart';
import 'package:rating_bar_flutter/rating_bar_flutter.dart';
import 'package:snippet_coder_utils/ProgressHUD.dart';
import 'package:tastify/Model/RatingFoodRequestModel.dart';
import 'package:tastify/Model/UserVoteRespondModel.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:tastify/constants.dart';
class RateActivity extends StatefulWidget {
  final String foodId;
  final String foodUrl;
  final bool voted;
  final double userRating;

  final TextEditingController commentController;
  const RateActivity({Key key, this.foodId, this.foodUrl, this.voted, this.userRating, this.commentController}) : super(key: key);
  @override
  State<RateActivity> createState() => _RateActivityState(userRating: this.userRating, voted: this.voted, commentController: this.commentController);
}

class _RateActivityState extends State<RateActivity> {
  bool voted;
  double userRating;
  TextEditingController commentController;
  bool isAPIcallProcess = false;
  GlobalKey<FormState> globalFormKey = GlobalKey<FormState>();

  _RateActivityState({this.userRating, this.voted, this.commentController});
  @override
  void initState() {
    // TODO: implement initState
    super.initState();

  }


  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return  Container(
      padding:
      EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                  padding: EdgeInsets.all(8),
                  child: Center(
                      child: Text(

                        "Rate Food",

                        style: TextStyle(fontSize: 22),
                      ))),
              Container(
                  margin: EdgeInsets.all(8),
                  width: size.width * 0.1,
                  height: size.width * 0.1,
                  decoration: BoxDecoration(
                      border: Border.all(color: appPrimaryColor),
                      borderRadius: BorderRadius.all(Radius.circular(5))),
                  child: Image.network(
                    widget.foodUrl,
                    fit: BoxFit.fitHeight,
                  )),
            ],
          ),
          Divider(
            height: 10.0,
            color: Colors.grey.withOpacity(0.5),
          ),
          RatingBarFlutter(
            initialRating: userRating,
            onRatingChanged: (rating) =>
                setState(() => userRating = rating),
            filledIcon: Icons.star,
            emptyIcon: Icons.star_border,
            isHalfAllowed: false,
            aligns: Alignment.center,
            filledColor: starColor,
            emptyColor: starColor,
            halfFilledColor: starColor,
            size: 36,
          ),
          Padding(
            padding: const EdgeInsets.only(
                left: 15, right: 15, top: 8, bottom: 8),
            child: TextField(
              controller: commentController,
              minLines: 1,
              maxLines: 4,
              cursorColor: Colors.black,
              decoration: InputDecoration(
                labelText: "Comment",
                labelStyle: TextStyle(
                    color: Colors.black.withOpacity(0.7), fontSize: 14),
                floatingLabelBehavior: FloatingLabelBehavior.auto,
                hintStyle: TextStyle(fontSize: 14),
                fillColor: backGroundFoodScreenColor,
                filled: true,
                focusedBorder: OutlineInputBorder(
                  borderSide:
                  const BorderSide(color: Colors.black, width: 0.5),
                  borderRadius: BorderRadius.circular(25.0),
                ),
                border: OutlineInputBorder(
                  borderSide:
                  const BorderSide(color: Colors.black, width: 0.5),
                  borderRadius: BorderRadius.circular(25.0),
                ),
                contentPadding:
                EdgeInsets.only(left: 15, bottom: 5, top: 5, right: 15),
              ),
            ),
          ),
          GestureDetector(
            onTap: () async{

              if (!voted) {
                await APIService.ratingFood(widget.foodId, RatingFoodRequestModel(star: userRating,comment: commentController.text));
              } else {
                await APIService.editRatingFood(widget.foodId, RatingFoodRequestModel(star: userRating,comment: commentController.text));
              }
              Navigator.of(context).pop("Rated");

            },
            child: Center(
              child: Container(
                decoration: BoxDecoration(
                    color: appPrimaryColor,
                    borderRadius: BorderRadius.all(Radius.circular(20))),
                child: Padding(
                  padding: const EdgeInsets.only(
                      top: 10, bottom: 10, left: 25, right: 25),
                  child: Text(
                    "Save",
                    style: TextStyle(color: Colors.white, fontSize: 16),
                  ),
                ),
              ),
            ),
          ),
          SizedBox(height: 20,)
        ],
      ),
    );

  }

}
