import 'dart:convert';
UserWallRespondModel userWallRespondModel(String str) =>
    UserWallRespondModel.fromJson(json.decode(str));
class UserWallRespondModel {
  Meta meta;
  Data data;

  UserWallRespondModel({this.meta, this.data});

  UserWallRespondModel.fromJson(Map<String, dynamic> json) {
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
  User user;
  int numberOfPost;
  int numberOfFollower;
  int numberOfFollowing;
  bool isFollowed;

  Data(
      {this.user,
        this.numberOfPost,
        this.numberOfFollower,
        this.numberOfFollowing,
        this.isFollowed});

  Data.fromJson(Map<String, dynamic> json) {
    user = json['user'] != null ? new User.fromJson(json['user']) : null;
    numberOfPost = json['numberOfPost'];
    numberOfFollower = json['numberOfFollower'];
    numberOfFollowing = json['numberOfFollowing'];
    isFollowed = json['isFollowed'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.user != null) {
      data['user'] = this.user.toJson();
    }
    data['numberOfPost'] = this.numberOfPost;
    data['numberOfFollower'] = this.numberOfFollower;
    data['numberOfFollowing'] = this.numberOfFollowing;
    data['isFollowed'] = this.isFollowed;
    return data;
  }
}

class User {
  String avatar;
  String displayName;
  String id;

  User({this.avatar, this.displayName, this.id});

  User.fromJson(Map<String, dynamic> json) {
    avatar = json['avatar'] != null ? json['avatar'] : null;
    displayName = json['displayName'];
    id = json['id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['avatar'] = this.avatar;
    data['displayName'] = this.displayName;
    data['id'] = this.id;
    return data;
  }
}
