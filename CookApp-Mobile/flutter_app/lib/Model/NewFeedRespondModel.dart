import 'dart:convert';
NewFeedRespondModel newFeedRespondModel(String str) =>
    NewFeedRespondModel.fromJson(json.decode(str));
class NewFeedRespondModel {
  Meta meta;
  Data data;

  NewFeedRespondModel({this.meta, this.data});

  NewFeedRespondModel.fromJson(Map<String, dynamic> json) {
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
  String id;
  int createdAt;
  int updatedAt;
  String content;
  List<String> images;
  List<String> videos;
  Author author;
  int numOfReaction;
  int numOfComment;
  String reaction;
  Posts(
      {this.id,
        this.createdAt,
        this.updatedAt,
        this.content,
        this.images,
        this.videos,
        this.author,
        this.numOfReaction,
        this.numOfComment,
      this.reaction});

  Posts.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    content = json['content'];
    images = json['images'].cast<String>();
    videos = json['videos'].cast<String>();
    author =
    json['author'] != null ? new Author.fromJson(json['author']) : null;
    numOfReaction = json['numOfReaction'];
    numOfComment = json['numOfComment'];
    reaction = json['reaction'] != null ? json['reaction'] : null;
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
    if (this.reaction != null){
      data['reaction'] = this.reaction;
    }
    return data;
  }
}

class Author {
  String id;
  String displayName;
  String avatar;

  Author({this.id, this.displayName, this.avatar});

  Author.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    displayName = json['displayName'] != null ? json['displayName'] : null;
    avatar = json['avatar'] != null ? json['avatar'] : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['displayName'] = this.displayName;
    data['avatar'] = this.avatar;
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
    page = json['page'] != null ? json['page'] : null;
    pageSize = json['pageSize'] != null ? json['pageSize'] : null;
    totalPage = json['totalPage'] != null ? json['totalPage'] : null;
    totalCount = json['totalCount'] != null ? json['totalCount'] : null;
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
