import 'dart:convert';

import 'MessageRequestModel.dart';

MessageRespondModel messageRespondModel(String str) =>
    MessageRespondModel.fromJson(json.decode(str));

class MessageRespondModel {
  String response;
  Context context;
  Action action;

  MessageRespondModel({this.response, this.context});

  MessageRespondModel.fromJson(Map<String, dynamic> json) {
    response = json['response'];
    context =
        json['context'] != null ? new Context.fromJson(json['context']) : null;
    action =
        json['action'] != null ? new Action.fromJson(json['action']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['response'] = this.response;
    if (this.context != null) {
      data['context'] = this.context.toJson();
    }
    if (this.action != null) {
      data['action'] = this.action.toJson();
    }
    return data;
  }
}

class Action {
  String action;
  Data data;

  Action({this.action, this.data});

  Action.fromJson(Map<String, dynamic> json) {
    action = json['action'];
    data = json['data'] != null ? new Data.fromJson(json['data']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['action'] = this.action;
    if (this.data != null) {
      data['data'] = this.data.toJson();
    }
    return data;
  }
}

class Data {
  String message;
  String time;
  String type;

  Data({this.message, this.time, this.type});

  Data.fromJson(Map<String, dynamic> json) {
    message = json['message'] != null ? json['message'] : null;
    time = json['time'] != null ? json['time'] : null;
    type = json['type'] != null ? json['type'] : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.message != null) {
      data['message'] = this.message;
    }
    if (this.time != null) {
      data['time'] = this.time;
    }
    if (this.type != null) {
      data['type'] = this.type;
    }
    return data;
  }
}
