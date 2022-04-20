class PostRequestModel {
  String content;
  List<String> images;
  List<String> videos;
  String kind;
  String name;
  String location;
  PostRequestModel({this.content, this.images, this.videos, this.kind, this.name, this.location});


  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['content'] = this.content;
    data['images'] = this.images;
    data['videos'] = this.videos;
    data['kind'] = this.kind;
    data['name'] = this.name;
    data['location'] = this.location;
    return data;
  }
}
