import 'dart:convert';

import 'package:tastify/Model/ConversationsRespondModel.dart';



MessageRespondModel messageRespondModel(String str) =>
    MessageRespondModel.fromJson(json.decode(str));

class MessageRespondModel {
  Meta meta;
  Data data;

  MessageRespondModel({this.meta, this.data});

  MessageRespondModel.fromJson(Map<String, dynamic> json) {
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
  List<Messages> messages;
  Metadata metadata;

  Data({this.messages, this.metadata});

  Data.fromJson(Map<String, dynamic> json) {
    if (json['messages'] != null) {
      messages = <Messages>[];
      json['messages'].forEach((v) {
        messages.add(new Messages.fromJson(v));
      });
    }
    metadata = json['metadata'] != null
        ? new Metadata.fromJson(json['metadata'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.messages != null) {
      data['messages'] = this.messages.map((v) => v.toJson()).toList();
    }
    if (this.metadata != null) {
      data['metadata'] = this.metadata.toJson();
    }
    return data;
  }
}

class Messages {
  String id;
  int createdAt;
  int updatedAt;
  String content;
  String type;
  Sender sender;
  String to;
  ConfigImage config;
  Messages(
      {this.id,
        this.createdAt,
        this.updatedAt,
        this.content,
        this.type,
        this.sender,
        this.to,
      this.config});

  Messages.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    content = json['content'];
    type = json['type'];
    sender =
    json['sender'] != null ? new Sender.fromJson(json['sender']) : null;
    to = json['to'];
    config =
    json['config'] != null ? new ConfigImage.fromJson(json['config']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['content'] = this.content;
    data['type'] = this.type;
    if (this.sender != null) {
      data['sender'] = this.sender.toJson();
    }
    data['to'] = this.to;
    if (this.config != null) {
      data['config'] = this.config.toJson();
    }
    return data;
  }
}

class Sender {
  String id;
  Avatar avatar;
  String displayName;

  Sender({this.id, this.avatar, this.displayName});

  Sender.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    avatar =
    json['avatar'] != null ? new Avatar.fromJson(json['avatar']) : null;
    displayName = json['displayName'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    if (this.avatar != null) {
      data['avatar'] = this.avatar.toJson();
    }
    data['displayName'] = this.displayName;
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
    id = json['id'];
    url = json['url'];
    type = json['type'];
    reaction = json['reaction'];
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

class Metadata {
  int totalPage;
  int page;
  int pageSize;
  int totalCount;

  Metadata({this.totalPage, this.page, this.pageSize, this.totalCount});

  Metadata.fromJson(Map<String, dynamic> json) {
    totalPage = json['totalPage'];
    page = json['page'];
    pageSize = json['pageSize'];
    totalCount = json['totalCount'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['totalPage'] = this.totalPage;
    data['page'] = this.page;
    data['pageSize'] = this.pageSize;
    data['totalCount'] = this.totalCount;
    return data;
  }
}
