import 'dart:io';

import 'package:accordion/accordion.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:image_picker/image_picker.dart';
import 'package:snippet_coder_utils/ProgressHUD.dart';
import 'package:tastify/Model/CreateFoodRequestModel.dart';
import 'package:tastify/Model/PresignedLinkedRequestModel.dart';
import 'package:tastify/Services/APIService.dart';

import '../constants.dart';

class CreateFoodActivity extends StatefulWidget {
  @override
  _CreateFoodActivityState createState() => _CreateFoodActivityState();
}

class _CreateFoodActivityState extends State<CreateFoodActivity> {
  FocusNode myFocusNode;
  TextEditingController descriptionController = TextEditingController();
  TextEditingController nameController = TextEditingController();
  TextEditingController timeController = TextEditingController();
  TextEditingController servingController = TextEditingController();
  bool isAPIcallProcess = false;
  GlobalKey<FormState> globalFormKey = GlobalKey<FormState>();
  List<File> files = [];
  ImagePicker imagePicker = ImagePicker();
  FToast fToast;
  List<Ingredient> ingredients = [];
  List<Step> steps = [
    Step(
      stepController: TextEditingController(),
      index: 0,
    )
  ];

  @override
  void initState() {
    // TODO: implement initState
    myFocusNode = FocusNode();
    fToast = FToast();
    fToast.init(context);
    ingredients.add(
      Ingredient(
        quantityController: TextEditingController(),
        nameController: TextEditingController(),
        unitController: TextEditingController(),

      ),
    );
    super.initState();
  }

  @override
  void dispose() {
    // TODO: implement dispose
    myFocusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        brightness: Brightness.dark,
        automaticallyImplyLeading: false,
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: <Color>[appPrimaryColor, appPrimaryColor],
            ),
          ),
        ),
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        title: Text("New Food"),
        actions: <Widget>[
          FlatButton(
              onPressed: () async {
                if (files.length > 0) {
                  setState(() {
                    isAPIcallProcess = true;
                  });
                  List<String> names = [];
                  for (var i in files) {
                    //names.add(i.path.substring(i.path.lastIndexOf("/")+1));
                    names.add(i.path.substring(i.path.lastIndexOf("/") + 1));
                  }
                  List<String> objectName = [];
                  List<String> video = [];
                  var response = await APIService.getPresignedLink(
                      PresignedLinkedRequestModel(fileNames: names));
                  //uploadImage(response, objectName);
                  for (int i = 0; i < response.data.items.length; i++) {
                    await APIService.uploadImage(
                        files[i], response.data.items[i].signedLink);
                    objectName.add(response.data.items[i].objectName);
                  }
                  print("object name " + objectName.length.toString());
                  CreateFoodRequestModel model = CreateFoodRequestModel(
                      servings: int.parse(servingController.text),
                      totalTime: int.parse(timeController.text),
                      name: nameController.text,
                      description: descriptionController.text,
                      photos: objectName,
                      ingredients: [],
                      steps: [],
                      videoUrl: "");
                  for (var i in ingredients) {
                    if (i.quantityController.text != "" &&
                        i.nameController != "" &&
                        i.unitController != "") {
                      model.ingredients.add(Ingredients(
                          name: i.nameController.text,
                          unit: i.unitController.text,
                          quantity: num.parse(i.quantityController.text)));
                    }
                  }
                  for (var i in steps) {
                    if (i.stepController.text != "") {
                      model.steps.add(Steps(content: i.stepController.text));
                    }
                  }
                  var result = await APIService.createFood(model);
                  print("ln");
                  setState(() {
                    isAPIcallProcess = false;
                  });
                  Navigator.of(context).pop();
                } else {
                  //_showToast("You have to add photos first!", size);
                }
              },
              child: IconButton(icon: Icon(Icons.check, color: Colors.white)))
        ],
      ),
      body: ProgressHUD(
        child: Form(
          key: globalFormKey,
          child: _createFoodUI(context),
        ),
        inAsyncCall: isAPIcallProcess,
        key: UniqueKey(),
        opacity: 0.3,
      ),
    );
  }

  Widget _ingredient(
      {BuildContext context,
      TextEditingController quantityController,
      TextEditingController unitController,
      TextEditingController nameController}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Flexible(
          flex: 3,
          child: TextField(
            controller: quantityController,
            keyboardType: TextInputType.number,
            cursorColor: Colors.black,
            decoration: InputDecoration(
              labelText: "Quantity",
              labelStyle:
                  TextStyle(color: Colors.black.withOpacity(0.7), fontSize: 14),
              floatingLabelBehavior: FloatingLabelBehavior.auto,
              fillColor: backGroundFoodScreenColor,
              filled: true,
              focusedBorder: OutlineInputBorder(
                borderSide: const BorderSide(color: Colors.black, width: 0.5),
                borderRadius: BorderRadius.circular(25.0),
              ),
              border: OutlineInputBorder(
                borderSide: const BorderSide(color: Colors.black, width: 0.5),
                borderRadius: BorderRadius.circular(25.0),
              ),
              contentPadding:
                  EdgeInsets.only(left: 15, bottom: 5, top: 5, right: 15),
            ),
          ),
        ),
        SizedBox(
          width: 10,
        ),
        Flexible(
          flex: 2,
          child: TextField(
            onTap: () async {
              FocusScope.of(context).unfocus();

              return showModalBottomSheet(
                context: context,
                builder: (BuildContext context) {
                  return Units();
                },
                isScrollControlled: true,
                backgroundColor: Colors.transparent,
              ).then((value) {
                if (value != null) {
                  setState(() {
                    unitController.text = value;
                  });

                }
              });
            },
            enableInteractiveSelection: false,
            readOnly: true,
            focusNode: new AlwaysDisabledFocusNode(),
            controller: unitController,

            cursorColor: Colors.black,
            decoration: InputDecoration(
              labelText: "Unit",
              labelStyle:
                  TextStyle(color: Colors.black.withOpacity(0.7), fontSize: 14),
              floatingLabelBehavior: FloatingLabelBehavior.auto,
              fillColor: backGroundFoodScreenColor,
              filled: true,
              focusedBorder: OutlineInputBorder(
                borderSide: const BorderSide(color: Colors.black, width: 0.5),
                borderRadius: BorderRadius.circular(25.0),
              ),
              border: OutlineInputBorder(
                borderSide: const BorderSide(color: Colors.black, width: 0.5),
                borderRadius: BorderRadius.circular(25.0),
              ),
              contentPadding:
                  EdgeInsets.only(left: 15, bottom: 5, top: 5, right: 15),
            ),
          ),
        ),
        SizedBox(
          width: 10,
        ),
        Flexible(
          flex: 4,
          child: TextField(
            onTap: () async {
              FocusScope.of(context).unfocus();
              return showModalBottomSheet(
                context: context,
                builder: (BuildContext context) {
                  return IngredientsName();
                },
                isScrollControlled: true,
                backgroundColor: Colors.transparent,
              ).then((value) {
                if (value != null) {
                  setState(() {
                    nameController.text = value;
                  });
                }

              });
            },
            focusNode: new AlwaysDisabledFocusNode(),
            enableInteractiveSelection: false,
            readOnly: true,
            controller: nameController,

            cursorColor: Colors.black,
            decoration: InputDecoration(
              labelText: "Name",
              labelStyle:
                  TextStyle(color: Colors.black.withOpacity(0.7), fontSize: 14),
              floatingLabelBehavior: FloatingLabelBehavior.auto,
              fillColor: backGroundFoodScreenColor,
              filled: true,
              focusedBorder: OutlineInputBorder(
                borderSide: const BorderSide(color: Colors.black, width: 0.5),
                borderRadius: BorderRadius.circular(25.0),
              ),
              border: OutlineInputBorder(
                borderSide: const BorderSide(color: Colors.black, width: 0.5),
                borderRadius: BorderRadius.circular(25.0),
              ),
              contentPadding:
                  EdgeInsets.only(left: 15, bottom: 5, top: 5, right: 15),
            ),
          ),
        ),
      ],
    );
  }

  Widget _createFoodUI(BuildContext context) {
    return GestureDetector(
      onTap: () {
        //FocusScope.of(context).unfocus();
        unfocus("a");
      },
      child: Padding(
        padding: const EdgeInsets.only(left: 16, right: 16),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.only(left: 15, top: 16),
                child: Text(
                  "Create your food instructions",
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(left: 15, top: 10, bottom: 10),
                child: Text(
                  "Let's share us your recipe",
                  style: TextStyle(fontSize: 16, color: Colors.grey),
                ),
              ),
              Divider(
                height: 5,
                thickness: 1,
              ),
              SizedBox(
                height: 15,
              ),
              Text(
                "Informations",
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              SizedBox(
                height: 15,
              ),
              TextField(
                controller: nameController,
                cursorColor: Colors.black,
                decoration: InputDecoration(
                  labelText: "Name",
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
              SizedBox(
                height: 15,
              ),
              TextField(
                maxLines: 4,
                controller: descriptionController,
                cursorColor: Colors.black,
                decoration: InputDecoration(
                  labelText: "Description",
                  labelStyle: TextStyle(
                      color: Colors.black.withOpacity(0.7), fontSize: 14),
                  floatingLabelBehavior: FloatingLabelBehavior.auto,
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
                      EdgeInsets.only(left: 15, bottom: 10, top: 10, right: 15),
                ),
              ),
              SizedBox(
                height: 15,
              ),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: timeController,
                      keyboardType: TextInputType.number,
                      cursorColor: Colors.black,
                      decoration: InputDecoration(
                        labelText: "Time (minutes)",
                        labelStyle: TextStyle(
                            color: Colors.black.withOpacity(0.7), fontSize: 14),
                        floatingLabelBehavior: FloatingLabelBehavior.auto,
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
                        contentPadding: EdgeInsets.only(
                            left: 15, bottom: 5, top: 5, right: 15),
                      ),
                    ),
                  ),
                  SizedBox(
                    width: 15,
                  ),
                  Expanded(
                    child: TextField(
                      controller: servingController,
                      keyboardType: TextInputType.number,
                      cursorColor: Colors.black,
                      decoration: InputDecoration(
                        labelText: "Servings (people)",
                        labelStyle: TextStyle(
                            color: Colors.black.withOpacity(0.7), fontSize: 14),
                        floatingLabelBehavior: FloatingLabelBehavior.auto,
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
                        contentPadding: EdgeInsets.only(
                            left: 15, bottom: 5, top: 5, right: 15),
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(
                height: 15,
              ),
              Text(
                "Ingredients",
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              SizedBox(
                height: 15,
              ),
              Flexible(
                  child: ListView.separated(
                      physics: const NeverScrollableScrollPhysics(),
                      shrinkWrap: true,
                      itemBuilder: (context, index) => _ingredient(
                          context: this.context,
                          quantityController: ingredients[index].quantityController,
                          unitController: ingredients[index].unitController,
                          nameController: ingredients[index].nameController),
                      separatorBuilder: (context, index) => SizedBox(
                            height: 15,
                          ),
                      itemCount: ingredients.length)),
              GestureDetector(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    IconButton(
                      onPressed: () {
                        setState(() {
                          ingredients.add(
                            Ingredient(
                              quantityController: TextEditingController(),
                              nameController: TextEditingController(),
                              unitController: TextEditingController(),
                            ),
                          );
                        });
                      },
                      icon: Icon(Icons.add_circle),
                      color: Colors.black,
                      iconSize: 26,
                    ),
                    Text(
                      "Add Ingredient",
                      style: TextStyle(
                          fontSize: 14,
                          color: Colors.black,
                          fontWeight: FontWeight.bold),
                    )
                  ],
                ),
                onTap: () {
                  setState(() {
                    ingredients.add(
                      Ingredient(
                        quantityController: TextEditingController(),
                        nameController: TextEditingController(),
                        unitController: TextEditingController(),
                      ),
                    );
                  });
                },
              ),
              Text(
                "Steps",
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              SizedBox(
                height: 15,
              ),
              Flexible(
                  child: ListView.separated(
                      physics: const NeverScrollableScrollPhysics(),
                      shrinkWrap: true,
                      itemBuilder: (context, index) => steps[index],
                      separatorBuilder: (context, index) => SizedBox(
                            height: 15,
                          ),
                      itemCount: steps.length)),
              GestureDetector(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    IconButton(
                      onPressed: () {
                        setState(() {
                          steps.add(Step(
                            stepController: TextEditingController(),
                            index: steps.length,
                          ));
                        });
                      },
                      icon: Icon(Icons.add_circle),
                      color: Colors.black,
                      iconSize: 26,
                    ),
                    Text(
                      "Add Step",
                      style: TextStyle(
                          fontSize: 14,
                          color: Colors.black,
                          fontWeight: FontWeight.bold),
                    )
                  ],
                ),
                onTap: () {
                  setState(() {
                    steps.add(Step(
                      stepController: TextEditingController(),
                      index: steps.length,
                    ));
                  });
                },
              ),
              Text(
                "Photos",
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              SizedBox(
                height: 15,
              ),
              files.length > 0
                  ? Container(
                      child: CarouselSlider(
                      options: CarouselOptions(),
                      items: files
                          .map((item) => Container(
                                child: Container(
                                  margin: EdgeInsets.all(5.0),
                                  child: ClipRRect(
                                      borderRadius: BorderRadius.all(
                                          Radius.circular(5.0)),
                                      child: Stack(
                                        children: <Widget>[
                                          Image.file(item,
                                              fit: BoxFit.cover, width: 1000.0),
                                          Positioned(
                                              top: 0,
                                              right: 0,
                                              child: GestureDetector(
                                                onTap: () {
                                                  setState(() {
                                                    files.remove(item);
                                                  });
                                                },
                                                child: Container(
                                                  height: 35,
                                                  width: 35,
                                                  child: Icon(
                                                    Icons.clear,
                                                    color: Colors.white
                                                        .withOpacity(0.8),
                                                  ),
                                                ),
                                              )),
                                        ],
                                      )),
                                ),
                              ))
                          .toList(),
                    ))
                  : Container(),
              GestureDetector(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    IconButton(
                      onPressed: () async {
                        List<XFile> imageFiles =
                            await imagePicker.pickMultiImage();
                        if (imageFiles.isNotEmpty) {
                          List<File> temp = [];
                          for (var image in imageFiles) {
                            temp.add(File(image.path));
                          }
                          setState(() {
                            files.addAll(temp);
                          });
                        }
                      },
                      icon: Icon(Icons.add_to_photos),
                      color: Colors.black,
                      iconSize: 26,
                    ),
                    Text(
                      "Add Photos",
                      style: TextStyle(
                          fontSize: 14,
                          color: Colors.black,
                          fontWeight: FontWeight.bold),
                    )
                  ],
                ),
                onTap: () async {
                  List<XFile> imageFiles = await imagePicker.pickMultiImage();
                  if (imageFiles.isNotEmpty) {
                    List<File> temp = [];
                    for (var image in imageFiles) {
                      temp.add(File(image.path));
                    }
                    setState(() {
                      files.addAll(temp);
                    });
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  unfocus(String abc) {
    print("callback unfocus");
    return FocusScope.of(context).unfocus();
  }
}

class Ingredient {
  TextEditingController quantityController;
  TextEditingController unitController;
  TextEditingController nameController;

  Ingredient(
      {this.quantityController, this.unitController, this.nameController});
}

/*class Ingredient extends StatefulWidget {
  final TextEditingController quantityController;
  final TextEditingController unitController;
  final TextEditingController nameController;
  final Function unfocus;
  const Ingredient(
      {Key key,
      this.quantityController,
      this.unitController,
      this.nameController,
      this.unfocus})
      : super(key: key);

  @override
  _IngredientState createState() => _IngredientState();
}

class _IngredientState extends State<Ingredient> {
  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Flexible(
          flex: 3,
          child: TextField(
            controller: widget.quantityController,
            keyboardType: TextInputType.number,
            cursorColor: Colors.black,
            decoration: InputDecoration(

              labelText: "Quantity",
              labelStyle:
                  TextStyle(color: Colors.black.withOpacity(0.7), fontSize: 14),
              floatingLabelBehavior: FloatingLabelBehavior.auto,
              fillColor: backGroundFoodScreenColor,
              filled: true,
              focusedBorder: OutlineInputBorder(
                borderSide: const BorderSide(color: Colors.black, width: 0.5),
                borderRadius: BorderRadius.circular(25.0),
              ),
              border: OutlineInputBorder(
                borderSide: const BorderSide(color: Colors.black, width: 0.5),
                borderRadius: BorderRadius.circular(25.0),
              ),
              contentPadding:
                  EdgeInsets.only(left: 15, bottom: 5, top: 5, right: 15),
            ),
          ),
        ),
        SizedBox(
          width: 10,
        ),
        Flexible(
          flex: 2,
          child: TextField(
            onTap: () async {
              return showModalBottomSheet(
                context: context,
                builder: (BuildContext context) {
                  return Units();
                },
                isScrollControlled: true,
                backgroundColor: Colors.transparent,
              ).then((value){
                if (value != null){
                  setState(() {
                    widget.unitController.text = value;
                  });
                }
                return FocusScope.of(context).unfocus();
              });


            },
            focusNode: new AlwaysDisabledFocusNode(),
            controller: widget.unitController,
            keyboardType: TextInputType.number,
            cursorColor: Colors.black,
            decoration: InputDecoration(
              labelText: "Unit",
              labelStyle:
              TextStyle(color: Colors.black.withOpacity(0.7), fontSize: 14),
              floatingLabelBehavior: FloatingLabelBehavior.auto,
              fillColor: backGroundFoodScreenColor,
              filled: true,
              focusedBorder: OutlineInputBorder(
                borderSide: const BorderSide(color: Colors.black, width: 0.5),
                borderRadius: BorderRadius.circular(25.0),
              ),
              border: OutlineInputBorder(
                borderSide: const BorderSide(color: Colors.black, width: 0.5),
                borderRadius: BorderRadius.circular(25.0),
              ),
              contentPadding:
              EdgeInsets.only(left: 15, bottom: 5, top: 5, right: 15),
            ),
          ),
        ),
        SizedBox(
          width: 10,
        ),
        Flexible(
          flex: 4,
          child: TextField(
            onTap: () async {
              return showModalBottomSheet(
                context: context,
                builder: (BuildContext context) {
                  return IngredientsName();
                },
                isScrollControlled: true,
                backgroundColor: Colors.transparent,
              ).then((value){
                if (value != null){
                  setState(() {
                    widget.nameController.text = value;
                  });
                }
                return FocusScope.of(context).unfocus();
              });
            },
            focusNode: new AlwaysDisabledFocusNode(),
            controller: widget.nameController,
            keyboardType: TextInputType.number,
            cursorColor: Colors.black,

            decoration: InputDecoration(

              labelText: "Name",
              labelStyle:
                  TextStyle(color: Colors.black.withOpacity(0.7), fontSize: 14),
              floatingLabelBehavior: FloatingLabelBehavior.auto,
              fillColor: backGroundFoodScreenColor,
              filled: true,
              focusedBorder: OutlineInputBorder(
                borderSide: const BorderSide(color: Colors.black, width: 0.5),
                borderRadius: BorderRadius.circular(25.0),
              ),
              border: OutlineInputBorder(
                borderSide: const BorderSide(color: Colors.black, width: 0.5),
                borderRadius: BorderRadius.circular(25.0),
              ),
              contentPadding:
                  EdgeInsets.only(left: 15, bottom: 5, top: 5, right: 15),
            ),
          ),
        ),

      ],
    );
  }
}*/
class IngredientsName extends StatefulWidget {
  @override
  _IngredientsNameState createState() => _IngredientsNameState();
}

class _IngredientsNameState extends State<IngredientsName> {
  List<String> names = [];
  TextEditingController searchController = TextEditingController();
  bool circular = true;

  @override
  void initState() {
    // TODO: implement initState
    fetchData();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final double appBarHeight = AppBar().preferredSize.height;
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
                          focusedBorder: OutlineInputBorder(
                            borderSide: const BorderSide(
                                color: Colors.black, width: 0.5),
                            borderRadius: BorderRadius.circular(25.0),
                          ),
                          suffixIcon: IconButton(
                            icon: Icon(
                              Icons.search,
                              color: appPrimaryColor,
                            ),
                            onPressed: () {},
                          ),
                          border: OutlineInputBorder(
                            borderSide: const BorderSide(
                                color: Colors.black, width: 0.5),
                            borderRadius: BorderRadius.circular(25.0),
                          ),
                          contentPadding: EdgeInsets.only(
                              left: 15, bottom: 5, top: 5, right: 15),
                        ),
                      ))),
                  Divider(
                    height: 10.0,
                    color: Colors.grey.withOpacity(0.5),
                  ),
                  circular
                      ? Expanded(
                          child: Center(child: CircularProgressIndicator()))
                      : Expanded(
                          child: ListView.builder(
                            shrinkWrap: true,
                            itemCount: names.length,
                            itemBuilder: (context, index) {
                              return ListTile(
                                title: Text(names[index]),
                                onTap: () {
                                  Navigator.of(context).pop(names[index]);
                                },
                              );
                            },
                          ),
                        ),
                ],
              ),
            ));
  }

  void fetchData() async {
    var data = await APIService.getIngredients(0);
    setState(() {
      for (var i in data.data.ingredients) {
        names.add(i.name);
      }
      circular = false;
    });
  }
}

class Units extends StatefulWidget {
  @override
  _UnitsState createState() => _UnitsState();
}

class _UnitsState extends State<Units> {
  List<String> units = [];
  TextEditingController searchController = TextEditingController();
  bool circular = true;

  @override
  void initState() {
    // TODO: implement initState
    fetchData();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final double appBarHeight = AppBar().preferredSize.height;
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
                          focusedBorder: OutlineInputBorder(
                            borderSide: const BorderSide(
                                color: Colors.black, width: 0.5),
                            borderRadius: BorderRadius.circular(25.0),
                          ),
                          suffixIcon: IconButton(
                            icon: Icon(
                              Icons.search,
                              color: appPrimaryColor,
                            ),
                            onPressed: () {},
                          ),
                          border: OutlineInputBorder(
                            borderSide: const BorderSide(
                                color: Colors.black, width: 0.5),
                            borderRadius: BorderRadius.circular(25.0),
                          ),
                          contentPadding: EdgeInsets.only(
                              left: 15, bottom: 5, top: 5, right: 15),
                        ),
                      ))),
                  Divider(
                    height: 10.0,
                    color: Colors.grey.withOpacity(0.5),
                  ),
                  circular
                      ? Expanded(
                          child: Center(child: CircularProgressIndicator()))
                      : Expanded(
                          child: ListView.builder(
                            shrinkWrap: true,
                            itemCount: units.length,
                            itemBuilder: (context, index) {
                              return ListTile(
                                title: Text(units[index]),
                                onTap: () {
                                  Navigator.of(context).pop(units[index]);
                                },
                              );
                            },
                          ),
                        ),
                ],
              ),
            ));
  }

  void fetchData() async {
    var data = await APIService.getUnits(0);
    setState(() {
      for (var i in data.data.units) {
        units.add(i.name);
      }
      circular = false;
    });
  }
}

class Step extends StatelessWidget {
  final TextEditingController stepController;
  final int index;

  const Step({Key key, this.stepController, this.index}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return TextField(
      minLines: 1,
      maxLines: 4,
      controller: stepController,
      cursorColor: Colors.black,
      decoration: InputDecoration(
        labelText: "Step " + (index + 1).toString(),
        labelStyle:
            TextStyle(color: Colors.black.withOpacity(0.7), fontSize: 14),
        floatingLabelBehavior: FloatingLabelBehavior.auto,
        fillColor: backGroundFoodScreenColor,
        filled: true,
        focusedBorder: OutlineInputBorder(
          borderSide: const BorderSide(color: Colors.black, width: 0.5),
          borderRadius: BorderRadius.circular(25.0),
        ),
        border: OutlineInputBorder(
          borderSide: const BorderSide(color: Colors.black, width: 0.5),
          borderRadius: BorderRadius.circular(25.0),
        ),
        contentPadding: EdgeInsets.only(left: 15, bottom: 5, top: 5, right: 15),
      ),
    );
  }
}

class AlwaysDisabledFocusNode extends FocusNode {
  @override
  bool get hasFocus => false;
}
