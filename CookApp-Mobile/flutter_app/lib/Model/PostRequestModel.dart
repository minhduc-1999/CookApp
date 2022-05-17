class PostRequestModel {
  String content;
  List<String> images;
  List<String> videos;
  List<String> tags;
  String kind;
  String name;
  String title;
  String location;
  String foodRefId;
  Should should;
  Should shouldNot;
  PostRequestModel({this.content, this.images, this.videos, this.tags, this.kind, this.name, this.location, this.title,this.foodRefId, this.should, this.shouldNot});


  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['content'] = this.content;
    if (images.length > 0) {
      data['images'] = this.images;
    }
    data['tags'] = this.tags;
    if (videos.length > 0) {
      data['videos'] = this.videos;
    }
    data['kind'] = this.kind;

    if (title != null){
      data['title'] = this.title;
    }
    if (location != null) {
      data['location'] = this.location;
    }
    if(foodRefId != null ){
      data['foodRefId'] = this.foodRefId;
    }
    if (this.should != null) {
      data['should'] = this.should.toJson();
    }
    if (this.shouldNot != null) {
      data['shouldNot'] = this.shouldNot.toJson();
    }
    return data;
  }
}
class Should {
  String advice;
  List<String> foodIds;

  Should({this.advice, this.foodIds});

  Should.fromJson(Map<String, dynamic> json) {
    advice = json['advice'];
    foodIds = json['foodIds'].cast<String>();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['advice'] = this.advice;
    data['foodIds'] = this.foodIds;
    return data;
  }
}
