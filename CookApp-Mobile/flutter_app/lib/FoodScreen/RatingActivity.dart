import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:rating_bar_flutter/rating_bar_flutter.dart';
import 'package:snippet_coder_utils/ProgressHUD.dart';
import '../LoginScreen/Components/LoginButton.dart';
import 'package:tastify/Model/RatingFoodRequestModel.dart';
import 'package:tastify/Model/UserVoteRespondModel.dart';
import 'package:tastify/Model/VotesRespondModel.dart';
import 'package:tastify/Services/APIService.dart';

import '../constants.dart';

class RatingActivity extends StatefulWidget {
  final String foodId;
  final String foodUrl;

  const RatingActivity({Key key, this.foodId, this.foodUrl}) : super(key: key);

  @override
  _RatingActivityState createState() => _RatingActivityState();
}

class _RatingActivityState extends State<RatingActivity> {

  List<Votes> votes;
  UserVoteRespondModel userVote;
  bool voted = false;
  double userRating = 0;
  bool isAPIcallProcess = false;
  GlobalKey<FormState> globalFormKey = GlobalKey<FormState>();
  TextEditingController ratingController = TextEditingController();
  bool circular = true;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    fetchData();
  }

  void fetchData() async {
    var userVoteData = await APIService.getUserVote(widget.foodId);
    var votesData = await APIService.getVotes(widget.foodId);
    setState(() {
      if (userVoteData.meta.ok) {
        voted = true;
        userRating = userVoteData.data.star.toDouble();
        ratingController.text = userVoteData.data.comment;
      }
      userVote = userVoteData;

      votes = votesData.data.votes;
      circular = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final double appBarHeight = AppBar().preferredSize.height;
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: appPrimaryColor),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        title: Text(
          "Ratings ",
          style: TextStyle(color: Colors.black),
        ),
        actions: <Widget>[
          Container(
              margin: EdgeInsets.only(
                  top: appBarHeight * 0.15,
                  bottom: appBarHeight * 0.15,
                  right: appBarHeight * 0.15),
              width: appBarHeight * 0.7,
              decoration: BoxDecoration(
                  border: Border.all(color: appPrimaryColor),
                  borderRadius: BorderRadius.all(Radius.circular(5))),
              child: Image.network(
                widget.foodUrl,
                fit: BoxFit.fitHeight,
              )),
        ],
      ),
      body: ProgressHUD(
        child: Form(
          key: globalFormKey,
          child: _ratingUI(context),
        ),
        inAsyncCall: isAPIcallProcess,
        key: UniqueKey(),
        opacity: 0,
      ),
    );
  }

  Widget _ratingUI(BuildContext context) {
    return circular
        ? Center(child: CircularProgressIndicator())
        : Column(
            mainAxisSize: MainAxisSize.min,
            children: [


              votes.length > 0
                  ? Expanded(
                      child: ListView.builder(
                          shrinkWrap: true,
                          itemCount: votes.length,
                          itemBuilder: (context, index) {
                            return Vote(
                              url: votes[index].author.avatar.url,
                              displayName: votes[index].author.displayName,
                              comment: votes[index].comment,
                              rating: votes[index].star.toDouble(),
                            );
                          }),
                    )
                  : Container(),
            ],
          );
  }
}

class Vote extends StatelessWidget {
  final String url;
  final String displayName;
  final double rating;
  final String comment;

  const Vote({Key key, this.url, this.displayName, this.comment, this.rating})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 15, right: 15, top: 5),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CircleAvatar(
                radius: 18,
                backgroundColor: Colors.grey,
                backgroundImage: NetworkImage(url),
              ),
              SizedBox(
                width: 5,
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    displayName,
                    style: TextStyle(color: Colors.black.withOpacity(0.6)),
                  ),
                  RatingBarFlutter.readOnly(
                    initialRating: rating,
                    isHalfAllowed: false,
                    aligns: Alignment.centerLeft,
                    halfFilledIcon: Icons.star_half,
                    filledIcon: Icons.star,
                    emptyIcon: Icons.star_border,
                    size: 18,
                    filledColor: starColor,
                    halfFilledColor: starColor,
                  ),
                  SizedBox(
                    height: 5,
                  ),
                  Text(
                    comment,
                    maxLines: 1000,
                  ),
                ],
              )
            ],
          ),
        ),
        SizedBox(
          height: 5,
        ),
        Divider(
          height: 2,
          thickness: 0.7,
        ),
      ],
    );
  }
}
