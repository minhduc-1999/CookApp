import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:tastify/Model/NewFeedRespondModel.dart';

class MultiImagesDetailActivity extends StatefulWidget {
  const MultiImagesDetailActivity(
      {Key key,
      this.medias,
      this.id,
      this.userId,
      this.content,
      this.location,
      this.displayName,
      this.avatar,
      this.dateTime})
      : super(key: key);

  @override
  _MultiImagesDetailActivityState createState() =>
      _MultiImagesDetailActivityState(
          id: this.id,
          userId: this.userId,
          content: this.content,
          location: this.location,
          displayName: this.displayName,
          avatar: this.avatar,
          dateTime: this.dateTime,
          medias: this.medias);
  final List<Medias> medias;
  final String id;
  final String userId;
  final String content;
  final String location;
  final String displayName;
  final String avatar;
  final DateTime dateTime;
}

class _MultiImagesDetailActivityState extends State<MultiImagesDetailActivity> {
  _MultiImagesDetailActivityState(
      {this.id,
      this.userId,
      this.content,
      this.location,
      this.displayName,
      this.avatar,
      this.dateTime,
      this.medias});

  final List<Medias> medias;
  final String id;
  final String userId;
  final String content;
  final String location;
  final String displayName;
  final String avatar;
  final DateTime dateTime;


  Widget buildPostHeader() {
    final double width = MediaQuery.of(context).size.width;
    return Padding(
      padding: const EdgeInsets.only(left: 15, right: 0, top: 3, bottom: 3),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          (avatar != null)
              ? CircleAvatar(
            radius: 17,
            backgroundColor: Colors.grey,
            backgroundImage: NetworkImage(avatar),
          )
              : CircleAvatar(
            /*child: Image.asset("assets/images/default_avatar.png",
                                      width: size.width * 0.20,
                                      height: size.width * 0.20,
                                      fit: BoxFit.fill),*/
              radius: 17,
              backgroundColor: Colors.grey,
              backgroundImage:
              AssetImage('assets/images/default_avatar.png')),
          SizedBox(
            width: width * 0.04,
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              GestureDetector(
                child: displayName != null
                    ? Text(displayName, style: TextStyle(
                  color: Colors.black,
                  fontWeight: FontWeight.bold,
                ))
                    : Text("user", style: TextStyle(
                  color: Colors.black,
                  fontWeight: FontWeight.bold,
                )),
                onTap: () {

                },
              ),
              location != null ? Text(location, style: TextStyle(fontSize: 12),) : Container()
            ],
          ),
        ],
      ),
    );
  }
  GestureDetector buildLikeIcon() {
    Color color;
    IconData icon;

    /*if (liked) {
      color = Colors.pink;
      icon = FontAwesomeIcons.solidHeart;
    } else {
      icon = FontAwesomeIcons.heart;
    }*/

    return GestureDetector(
        child: Icon(
          icon,
          size: 25.0,
          color: color,
        ),
        onTap: () {
        });
  }
  @override
  Widget build(BuildContext context) {
    return Text("Hello");
  }
}
