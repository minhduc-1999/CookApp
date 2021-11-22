import 'dart:convert';
RegisterRespondModel registerRespondModel(String str) =>
    RegisterRespondModel.fromJson(json.decode(str));

class RegisterRespondModel {
  RegisterRespondModel({
    this.meta,
    this.data,
  });
  Meta meta;
  Data data;

  RegisterRespondModel.fromJson(Map<String, dynamic> json){
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
    this.id,
    this.username,
    this.email,
    this.phone,
    this.avatar,
    this.profile,
  });
  String id;
  String username;
  String email;
  String phone;
  String avatar;
  Profile profile;

  Data.fromJson(Map<String, dynamic> json){
    id = json['id'];
    username = json['username'];
    email = json['email'];
    phone = json['phone'];
    avatar = json['avatar'];
    profile = Profile.fromJson(json['profile']);
  }

  Map<String, dynamic> toJson() {
    final _data = <String, dynamic>{};
    _data['id'] = id;
    _data['username'] = username;
    _data['email'] = email;
    _data['phone'] = phone;
    _data['avatar'] = avatar;
    _data['profile'] = profile.toJson();
    return _data;
  }
}

class Profile {
  Profile({
    this.height,
    this.weight,
    this.birthDate,
    this.firstName,
    this.lastName,
    this.sex,
  });
  int height;
  int weight;
  int birthDate;
  String firstName;
  String lastName;
  String sex;

  Profile.fromJson(Map<String, dynamic> json){
    height = json['height'];
    weight = json['weight'];
    birthDate = json['birthDate'];
    firstName = json['firstName'];
    lastName = json['lastName'];
    sex = json['sex'];
  }

  Map<String, dynamic> toJson() {
    final _data = <String, dynamic>{};
    _data['height'] = height;
    _data['weight'] = weight;
    _data['birthDate'] = birthDate;
    _data['firstName'] = firstName;
    _data['lastName'] = lastName;
    _data['sex'] = sex;
    return _data;
  }
}