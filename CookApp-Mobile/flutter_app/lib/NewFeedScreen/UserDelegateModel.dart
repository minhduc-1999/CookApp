import 'dart:convert';
UserDelegateModel userDelegateModel(String str) =>
    UserDelegateModel.fromJson(json.decode(str));
class UserDelegateModel {
  Meta meta;
  Data data;

  UserDelegateModel({this.meta, this.data});

  UserDelegateModel.fromJson(Map<String, dynamic> json) {
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
  List<Users> users;
  Metadata metadata;

  Data({this.users, this.metadata});

  Data.fromJson(Map<String, dynamic> json) {
    if (json['users'] != null) {
      users = new List<Users>();
      json['users'].forEach((v) {
        users.add(new Users.fromJson(v));
      });
    }
    metadata = json['metadata'] != null
        ? new Metadata.fromJson(json['metadata'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.users != null) {
      data['users'] = this.users.map((v) => v.toJson()).toList();
    }
    if (this.metadata != null) {
      data['metadata'] = this.metadata.toJson();
    }
    return data;
  }
}

class Users {
  String id;
  String avatar;
  String displayName;

  Users({this.id, this.avatar, this.displayName});

  Users.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    avatar = json['avatar'];
    displayName = json['displayName'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['avatar'] = this.avatar;
    data['displayName'] = this.displayName;
    return data;
  }
}

class Metadata {
  int page;
  int pageSize;
  int totalPage;
  int totalCount;

  Metadata({this.page, this.pageSize, this.totalPage, this.totalCount});

  Metadata.fromJson(Map<String, dynamic> json) {
    page = json['page'];
    pageSize = json['pageSize'];
    totalPage = json['totalPage'];
    totalCount = json['totalCount'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['page'] = this.page;
    data['pageSize'] = this.pageSize;
    data['totalPage'] = this.totalPage;
    data['totalCount'] = this.totalCount;
    return data;
  }
}
