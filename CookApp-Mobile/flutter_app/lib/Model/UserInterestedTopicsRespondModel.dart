import 'dart:convert';
UserInterestedTopicsRespondModel userInterestedTopicsRespondModel(String str) =>
    UserInterestedTopicsRespondModel.fromJson(json.decode(str));
class UserInterestedTopicsRespondModel {
  Meta meta;
  Data data;

  UserInterestedTopicsRespondModel({this.meta, this.data});

  UserInterestedTopicsRespondModel.fromJson(Map<String, dynamic> json) {
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
  List<Topics> topics;

  Data({this.topics});

  Data.fromJson(Map<String, dynamic> json) {
    if (json['topics'] != null) {
      topics = <Topics>[];
      json['topics'].forEach((v) {
        topics.add(new Topics.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.topics != null) {
      data['topics'] = this.topics.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Topics {
  int createdAt;
  String id;
  int updatedAt;
  String title;
  Cover cover;

  Topics({this.createdAt, this.id, this.updatedAt, this.title, this.cover});

  Topics.fromJson(Map<String, dynamic> json) {
    createdAt = json['createdAt'];
    id = json['id'];
    updatedAt = json['updatedAt'];
    title = json['title'];
    cover = json['cover'] != null ? new Cover.fromJson(json['cover']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['createdAt'] = this.createdAt;
    data['id'] = this.id;
    data['updatedAt'] = this.updatedAt;
    data['title'] = this.title;
    if (this.cover != null) {
      data['cover'] = this.cover.toJson();
    }
    return data;
  }
}

class Cover {
  String type;

  Cover({this.type});

  Cover.fromJson(Map<String, dynamic> json) {
    type = json['type'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['type'] = this.type;
    return data;
  }
}
