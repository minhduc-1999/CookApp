import 'dart:convert';
UserRespondModel userRespondModel(String str) =>
    UserRespondModel.fromJson(json.decode(str));

class UserRespondModel {
  Meta meta;
  Data data;

  UserRespondModel({this.meta, this.data});

  UserRespondModel.fromJson(Map<String, dynamic> json) {
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
  List<String> messages;
  bool ok;

  Meta({this.messages, this.ok});

  Meta.fromJson(Map<String, dynamic> json) {
    messages = json['messages'].cast<String>();
    ok = json['ok'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['messages'] = this.messages;
    data['ok'] = this.ok;
    return data;
  }
}

class Data {
  String id;
  int createdAt;
  int updatedAt;
  String avatar;
  Profile profile;
  String displayName;

  Data(
      {this.id,
        this.createdAt,
        this.updatedAt,
        this.avatar,
        this.profile,
        this.displayName});

  Data.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    avatar = json['avatar'] != null ? json['avatar'] : null;
    profile =
    json['profile'] != null ? new Profile.fromJson(json['profile']) : null;
    displayName = json['displayName'] != null ? json['displayName'] : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['avatar'] = this.avatar;
    if (this.profile != null) {
      data['profile'] = this.profile.toJson();
    }
    data['displayName'] = this.displayName;
    return data;
  }
}

class Profile {
  int height;
  int weight;
  int birthDate;
  String firstName;
  String lastName;
  String sex;

  Profile(
      {this.height,
        this.weight,
        this.birthDate,
        this.firstName,
        this.lastName,
        this.sex});

  Profile.fromJson(Map<String, dynamic> json) {
    height = json['height'] != null ? json['height'] : null;
    weight = json['weight'] != null ? json['weight'] : null;
    birthDate = json['birthDate'] != null ? json['birthDate'] : null;
    firstName = json['firstName'] != null ? json['firstName'] : null;
    lastName = json['lastName'] != null ? json['lastName'] : null;
    sex = json['sex'] != null ? json['sex'] : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['height'] = this.height;
    data['weight'] = this.weight;
    data['birthDate'] = this.birthDate;
    data['firstName'] = this.firstName;
    data['lastName'] = this.lastName;
    data['sex'] = this.sex;
    return data;
  }
}
