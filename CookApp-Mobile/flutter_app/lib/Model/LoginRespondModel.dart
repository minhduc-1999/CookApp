import 'dart:convert';
LoginRespondModel loginRespondJson(String str) =>
    LoginRespondModel.fromJson(json.decode(str));

class LoginRespondModel {
  Meta meta;
  Data data;

  LoginRespondModel({this.meta, this.data});

  LoginRespondModel.fromJson(Map<String, dynamic> json) {
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

  Meta({this.ok, this.messages});

  Meta.fromJson(Map<String, dynamic> json) {
    ok = json['ok'];
    messages = json['messages'].cast<String>();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['ok'] = this.ok;
    data['messages'] = this.messages;
    return data;
  }
}

class Data {
  String accessToken;
  String userId;
  bool emailVerified;
  String email;
  String loginToken;
  String role;
  Data({this.accessToken, this.userId, this.emailVerified, this.email, this.loginToken,this.role});

  Data.fromJson(Map<String, dynamic> json) {
    accessToken = json['accessToken'] != null ? json['accessToken'] : null;
    userId = json['userId'] != null ? json['userId'] : null;
    emailVerified = json['emailVerified'] != null ? json['emailVerified'] : false;
    email = json['email'] != null ? json['email'] : null;
    loginToken = json['loginToken'] != null ? json['loginToken'] : null;
    role = json['role'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['accessToken'] = this.accessToken;
    data['userId'] = this.userId;
    data['emailVerified'] = this.emailVerified;
    data['email'] = this.email;
    data['loginToken'] = this.loginToken;
    data['role'] = this.role;
    return data;
  }
}