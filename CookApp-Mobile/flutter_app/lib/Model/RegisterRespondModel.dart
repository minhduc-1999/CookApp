import 'dart:convert';
RegisterRespondModel registerRespondModel(String str) =>
    RegisterRespondModel.fromJson(json.decode(str));

class RegisterRespondModel {
  Meta meta;
  Data data;

  RegisterRespondModel({this.meta, this.data});

  RegisterRespondModel.fromJson(Map<String, dynamic> json) {
    meta = json['meta'] != null ? new Meta.fromJson(json['meta']) : null;
    data = json['data'] != null ? new Data.fromJson(json['data']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.meta != null) {
      data['meta'] = this.meta.toJson();
    }
    if (this.data != null) {
      data['data'] = this.data.toJson();
    }
    return data;
  }
}

class Meta {
  bool ok;
  List<String> messages;
  String errorCode;

  Meta({this.ok, this.messages, this.errorCode});

  Meta.fromJson(Map<String, dynamic> json) {
    ok = json['ok'];
    messages = json['messages'].cast<String>();
    errorCode = json['errorCode'] != null ? json['errorCode'] : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['ok'] = this.ok;
    data['messages'] = this.messages;
    data['errorCode'] = this.errorCode;
    return data;
  }
}

class Data {
  String id;

  Data({this.id});

  Data.fromJson(Map<String, dynamic> json) {
    id = json['id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    return data;
  }
}
