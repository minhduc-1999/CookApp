class PostRequestModel {
  String content;
  List<String> images;
  List<String> videos;

  PostRequestModel({this.content, this.images, this.videos});

  PostRequestModel.fromJson(Map<String, dynamic> json) {
    content = json['content'];
    images = json['images'].cast<String>();
    videos = json['videos'].cast<String>();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['content'] = this.content;
    data['images'] = this.images;
    data['videos'] = this.videos;
    return data;
  }
}
