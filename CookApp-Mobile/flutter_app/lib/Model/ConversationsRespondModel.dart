import 'dart:convert';

import 'AlbumDetailsRespondModel.dart';
ConversationsRespondModel conversationsRespondModel(String str) =>
    ConversationsRespondModel.fromJson(json.decode(str));
class ConversationsRespondModel {
  Meta meta;
  Data data;

  ConversationsRespondModel({this.meta, this.data});

  ConversationsRespondModel.fromJson(Map<String, dynamic> json) {
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
  List<Conversations> conversations;
  Metadata metadata;

  Data({this.conversations, this.metadata});

  Data.fromJson(Map<String, dynamic> json) {
    if (json['conversations'] != null) {
      conversations = <Conversations>[];
      json['conversations'].forEach((v) {
        conversations.add(new Conversations.fromJson(v));
      });
    }
    metadata = json['metadata'] != null
        ? new Metadata.fromJson(json['metadata'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.conversations != null) {
      data['conversations'] =
          this.conversations.map((v) => v.toJson()).toList();
    }
    if (this.metadata != null) {
      data['metadata'] = this.metadata.toJson();
    }
    return data;
  }
}

class Conversations {
  int createdAt;
  String id;
  int updatedAt;
  String type;
  LastMessage lastMessage;
  bool readAll;
  String cover;
  String name;

  Conversations(
      {this.createdAt,
        this.id,
        this.updatedAt,
        this.type,
        this.lastMessage,
        this.readAll,
        this.cover,
        this.name});

  Conversations.fromJson(Map<String, dynamic> json) {
    createdAt = json['createdAt'];
    id = json['id'];
    updatedAt = json['updatedAt'];
    type = json['type'];
    lastMessage = json['lastMessage'] != null
        ? new LastMessage.fromJson(json['lastMessage'])
        : null;
    readAll = json['readAll'];
    cover = json['cover'];
    name = json['name'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['createdAt'] = this.createdAt;
    data['id'] = this.id;
    data['updatedAt'] = this.updatedAt;
    data['type'] = this.type;
    if (this.lastMessage != null) {
      data['lastMessage'] = this.lastMessage.toJson();
    }
    data['readAll'] = this.readAll;
    data['cover'] = this.cover;
    data['name'] = this.name;
    return data;
  }
}

class LastMessage {
  int createdAt;
  String id;
  int updatedAt;
  String content;
  String type;
  ConfigImage config;
  Sender sender;

  LastMessage(
      {this.createdAt, this.id, this.updatedAt, this.content, this.type, this.config, this.sender});

  LastMessage.fromJson(Map<String, dynamic> json) {
    createdAt = json['createdAt'];
    id = json['id'];
    updatedAt = json['updatedAt'];
    content = json['content'];
    type = json['type'];
    sender =
    json['sender'] != null ? new Sender.fromJson(json['sender']) : null;
    config =
    json['config'] != null ? new ConfigImage.fromJson(json['config']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['createdAt'] = this.createdAt;
    data['id'] = this.id;
    data['updatedAt'] = this.updatedAt;
    data['content'] = this.content;
    data['type'] = this.type;
    if (this.config != null) {
      data['config'] = this.config.toJson();
    }
    if (this.sender != null) {
      data['sender'] = this.sender.toJson();
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
class ConfigImage {
  int width;
  int height;

  ConfigImage({this.width, this.height});

  ConfigImage.fromJson(Map<String, dynamic> json) {
    width = json['width'];
    height = json['height'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['width'] = this.width;
    data['height'] = this.height;
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
