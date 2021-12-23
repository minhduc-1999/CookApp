import 'package:flutter/material.dart';
import 'package:flutter_app/NewFeedScreen/UserDelegateModel.dart';
import 'package:flutter_app/ProfileScreen/ProfileActivity.dart';
import 'package:flutter_app/Services/APIService.dart';

class SearchUserDelegate extends SearchDelegate<UserDelegateModel>{
  @override
  List<Widget> buildActions(BuildContext context) {
    return [
      IconButton(
          icon: Icon(Icons.clear),
          onPressed: () {
            query = "";
          })
    ];
  }

  @override
  Widget buildLeading(BuildContext context) {
    return IconButton(
        icon: AnimatedIcon(
          icon: AnimatedIcons.menu_arrow,
          progress: transitionAnimation,
        ),
        onPressed: () {
          close(context, null);
        });
  }

  @override
  Widget buildResults(BuildContext context) {
    return Container();
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    final Size size = MediaQuery.of(context).size;
    return StreamBuilder<UserDelegateModel>(
        stream: userStream(),
        builder: (context, snapshot){
            switch (snapshot.connectionState){
              case ConnectionState.waiting:
                return Center(child: CircularProgressIndicator(),);
              default:
                if (snapshot.hasError){
                  return Center(child: Text("There're some error"),);
                } else {
                  return ListView.builder(
                    itemCount: snapshot.data.data.users.length,
                      itemBuilder: (context, index){
                          return GestureDetector(
                              onTap: (){
                                Navigator.push(context,
                                    MaterialPageRoute(builder: (context) {
                                      return ProfileActivity(userId: snapshot.data.data.users[index].id,);
                                    }));
                              },

                              child: userWidget(snapshot.data.data.users[index],size));
                      }

                  );
                }
            }
        }
    );
  }
  Future<UserDelegateModel> getUserByQuery () async {
    var data = APIService.getUserByQuery(0, query);
    return data;
  }
  Stream<UserDelegateModel> userStream() => Stream.periodic(Duration(seconds: 1)).asyncMap((event) => getUserByQuery());
  Widget userWidget(Users user, Size size){
    return Container(
        margin: EdgeInsets.all(10),
        child: Row(
          children: <Widget>[
            SizedBox(
              width: (user.avatar != null) ? 25 : 20,
            ),
            (user.avatar != null)
                ? CircleAvatar(
              radius: size.width * 0.06,
              backgroundImage:
              NetworkImage(user.avatar),
            )
                : Image.asset(
                "assets/images/default_avatar.png",
                width: size.width * 0.14,
                height: size.width * 0.14,
                fit: BoxFit.fitHeight),
            SizedBox(
              width: (user.avatar != null) ? 25 : 20,
            ),
            Text(
              user.displayName,
              style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.normal),
            ),
          ],
        ),
      );

  }
}