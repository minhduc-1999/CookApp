import 'dart:convert';
class MessageRequestModel {
  String to;
  String message;
  String type;

  MessageRequestModel({this.to, this.message, this.type});

  MessageRequestModel.fromJson(Map<String, dynamic> json) {
    to = json['to'];
    message = json['message'];
    type = json['type'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['to'] = this.to;
    data['message'] = this.message;
    data['type'] = this.type;
    return data;
  }
}
