import 'dart:convert';
class MessageRequestModel {
  String to;
  String message;
  String type;
  ImageContent imageContent;
  MessageRequestModel({this.to, this.message, this.type, this.imageContent});

  MessageRequestModel.fromJson(Map<String, dynamic> json) {
    to = json['to'];
    message = json['message'];
    type = json['type'];
    imageContent = json['imageContent'] != null
        ? new ImageContent.fromJson(json['imageContent'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['to'] = this.to;
    if (message != "" && message != null) {
      data['message'] = this.message;
    }
    data['type'] = this.type;
    if (this.imageContent != null) {
      data['imageContent'] = this.imageContent.toJson();
    }
    return data;
  }
}
class ImageContent {
  String image;
  int width;
  int height;

  ImageContent({this.image, this.width, this.height});

  ImageContent.fromJson(Map<String, dynamic> json) {
    image = json['image'];
    width = json['width'];
    height = json['height'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['image'] = this.image;
    data['width'] = this.width;
    data['height'] = this.height;
    return data;
  }
}
