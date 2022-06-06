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
  Profile profile;
  String displayName;
  Avatar avatar;

  Data({this.profile, this.displayName, this.avatar});

  Data.fromJson(Map<String, dynamic> json) {
    profile =
    json['profile'] != null ? new Profile.fromJson(json['profile']) : null;
    displayName = json['displayName'];
    avatar =
    json['avatar'] != null ? new Avatar.fromJson(json['avatar']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.profile != null) {
      data['profile'] = this.profile.toJson();
    }
    data['displayName'] = this.displayName;
    if (this.avatar != null) {
      data['avatar'] = this.avatar.toJson();
    }
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
  String bio;
  Profile(
      {this.height,
        this.weight,
        this.birthDate,
        this.firstName,
        this.lastName,
        this.sex,
      this.bio});

  Profile.fromJson(Map<String, dynamic> json) {
    height = json['height'] != null ? json['height'] : null;
    weight = json['weight'] != null ? json['weight'] : null;
    birthDate = json['birthDate'] != null ? json['birthDate'] : null;
    firstName = json['firstName'] != null ? json['firstName'] : null;
    lastName = json['lastName'] != null ? json['lastName'] : null;
    sex = json['sex'] != null ? json['sex'] : null;
    bio = json['bio'] != null ? json['bio'] : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['height'] = this.height;
    data['weight'] = this.weight;
    data['birthDate'] = this.birthDate;
    data['firstName'] = this.firstName;
    data['lastName'] = this.lastName;
    data['sex'] = this.sex;
    data['bio'] = this.bio;
    return data;
  }
}

class Avatar {
  String id;
  String url;
  String type;
  String reaction;

  Avatar({this.id, this.url, this.type, this.reaction});

  Avatar.fromJson(Map<String, dynamic> json) {
    id = json['id'] != null ? json['id'] : null;
    url = json['url'];
    type = json['type'];
    reaction = json['reaction'] != null ? json['url'] : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['url'] = this.url;
    data['type'] = this.type;
    data['reaction'] = this.reaction;
    return data;
  }
}

