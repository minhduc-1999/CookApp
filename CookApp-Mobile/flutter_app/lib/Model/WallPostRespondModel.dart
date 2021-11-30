import 'dart:convert';
WallPostRespondModel wallPostRespondModel(String str) =>
    WallPostRespondModel.fromJson(json.decode(str));
class WallPostRespondModel {
  Meta meta;
  Data data;

  WallPostRespondModel({this.meta, this.data});

  WallPostRespondModel.fromJson(Map<String, dynamic> json) {
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
  List<Posts> posts;
  Metadata metadata;

  Data({this.posts, this.metadata});

  Data.fromJson(Map<String, dynamic> json) {
    if (json['posts'] != null) {
      posts = new List<Posts>();
      json['posts'].forEach((v) {
        posts.add(new Posts.fromJson(v));
      });
    }
    metadata = json['metadata'] != null
        ? new Metadata.fromJson(json['metadata'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.posts != null) {
      data['posts'] = this.posts.map((v) => v.toJson()).toList();
    }
    if (this.metadata != null) {
      data['metadata'] = this.metadata.toJson();
    }
    return data;
  }
}

class Posts {
  int updatedAt;
  int createdAt;
  String id;
  String content;
  List<String> images;
  List<String> videos;

  Posts(
      {this.updatedAt,
        this.createdAt,
        this.id,
        this.content,
        this.images,
        this.videos});

  Posts.fromJson(Map<String, dynamic> json) {
    updatedAt = json['updatedAt'];
    createdAt = json['createdAt'];
    id = json['id'];
    content = json['content'];
    images = json['images'].cast<String>();
    videos = json['videos'].cast<String>();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['updatedAt'] = this.updatedAt;
    data['createdAt'] = this.createdAt;
    data['id'] = this.id;
    data['content'] = this.content;
    data['images'] = this.images;
    data['videos'] = this.videos;
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
