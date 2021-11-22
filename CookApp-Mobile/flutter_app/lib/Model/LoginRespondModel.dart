import 'dart:convert';
LoginRespondModel loginRespondJson(String str) =>
    LoginRespondModel.fromJson(json.decode(str));

class LoginRespondModel {
  LoginRespondModel({
    this.meta,
    this.data,
  });
  Meta meta;
  Data data;

  LoginRespondModel.fromJson(Map<String, dynamic> json){
    meta = Meta.fromJson(json['meta']);
    data = Data.fromJson(json['data']);
  }

  Map<String, dynamic> toJson() {
    final _data = <String, dynamic>{};
    _data['meta'] = meta.toJson();
    _data['data'] = data.toJson();
    return _data;
  }
}

class Meta {
  Meta({
    this.messages,
    this.ok,
  });
  List<String> messages;
  bool ok;

  Meta.fromJson(Map<String, dynamic> json){
    messages = List.castFrom<dynamic, String>(json['messages']);
    ok = json['ok'];
  }

  Map<String, dynamic> toJson() {
    final _data = <String, dynamic>{};
    _data['messages'] = messages;
    _data['ok'] = ok;
    return _data;
  }
}

class Data {
  Data({
    this.accessToken,
  });
  String accessToken;

  Data.fromJson(Map<String, dynamic> json){
    accessToken = json['accessToken'];
  }

  Map<String, dynamic> toJson() {
    final _data = <String, dynamic>{};
    _data['accessToken'] = accessToken;
    return _data;
  }
}