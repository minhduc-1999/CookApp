import 'dart:convert';
PostDetailsRespondModel postDetailsRespondModel(String str) =>
    PostDetailsRespondModel.fromJson(json.decode(str));
class PostDetailsRespondModel {
  Meta meta;
  Data data;

  PostDetailsRespondModel({this.meta, this.data});

  PostDetailsRespondModel.fromJson(Map<String, dynamic> json) {
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
  String id;
  int createdAt;
  int updatedAt;
  String content;
  List<String> images;
  List<String> videos;
  Author author;
  int numOfReaction;
  int numOfComment;

  Data(
      {this.id,
        this.createdAt,
        this.updatedAt,
        this.content,
        this.images,
        this.videos,
        this.author,
        this.numOfReaction,
        this.numOfComment});

  Data.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    content = json['content'];
    images = json['images'] != null ? json['images'].cast<String>() : null;
    videos = json['videos'] != null ? json['videos'].cast<String>() : null;
    author = json['author'] != null ? new Author.fromJson(json['author']) : null;
    numOfReaction = json['numOfReaction'];
    numOfComment = json['numOfComment'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['content'] = this.content;
    data['images'] = this.images;
    data['videos'] = this.videos;
    if (this.author != null) {
      data['author'] = this.author.toJson();
    }
    data['numOfReaction'] = this.numOfReaction;
    data['numOfComment'] = this.numOfComment;
    return data;
  }
}

class Author {
  String id;
  String avatar;
  String displayName;

  Author({this.id, this.avatar, this.displayName});

  Author.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    avatar = json['avatar'] != null ? json['avatar'] : null;
    displayName = json['displayName'] != null ? json['displayName'] : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['avatar'] = this.avatar;
    data['displayName'] = this.displayName;
    return data;
  }
}
