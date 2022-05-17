import 'package:flutter/material.dart';

import '../constants.dart';
class TagsActivity extends StatefulWidget {
  final List<String> tags;

  const TagsActivity({Key key, this.tags}) : super(key: key);
  @override
  _TagsActivityState createState() => _TagsActivityState(tags: this.tags );
}

class _TagsActivityState extends State<TagsActivity> {
  TextEditingController searchController = TextEditingController();
  List<String> tags;

  _TagsActivityState({this.tags});
  @override
  Widget build(BuildContext context) {
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
              Expanded(
                child: ListView.builder(

                  shrinkWrap: true,
                  itemCount: tags.length,
                  itemBuilder: (context, index) {

                    return ListTile(title: Text(tags[index]), onTap: (){
                    Navigator.of(context).pop(tags[index]);
                    });

                  },
                ),
              ),

            ],
          ),
        ));
  }
}
