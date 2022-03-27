import 'dart:convert';
CommentRespondModel commentRespondModel(String str) =>
    CommentRespondModel.fromJson(json.decode(str));
class CommentRespondModel {
  Meta meta;
  Data data;

  CommentRespondModel({this.meta, this.data});

  CommentRespondModel.fromJson(Map<String, dynamic> json) {
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
  List<Comments> comments;
  Metadata metadata;

  Data({this.comments, this.metadata});

  Data.fromJson(Map<String, dynamic> json) {
    if (json['comments'] != null) {
      comments = <Comments>[];
      json['comments'].forEach((v) {
        comments.add(new Comments.fromJson(v));
      });
    }
    metadata = json['metadata'] != null
        ? new Metadata.fromJson(json['metadata'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.comments != null) {
      data['comments'] = this.comments.map((v) => v.toJson()).toList();
    }
    if (this.metadata != null) {
      data['metadata'] = this.metadata.toJson();
    }
    return data;
  }
}

class Comments {
  String id;
  int createdAt;
  int updatedAt;
  String updatedBy;
  User user;
  String content;
  int numberOfReply;

  Comments(
      {this.id,
        this.createdAt,
        this.updatedAt,
        this.updatedBy,
        this.user,
        this.content,
        this.numberOfReply});

  Comments.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    updatedBy = json['updatedBy'];
    user = json['user'] != null ? new User.fromJson(json['user']) : null;
    content = json['content'];
    numberOfReply = json['numberOfReply'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['updatedBy'] = this.updatedBy;
    if (this.user != null) {
      data['user'] = this.user.toJson();
    }
    data['content'] = this.content;
    data['numberOfReply'] = this.numberOfReply;
    return data;
  }
}

class User {
  String id;
  Avatar avatar;
  String displayName;

  User({this.id, this.avatar, this.displayName});

  User.fromJson(Map<String, dynamic> json) {
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
  String key;
  String url;

  Avatar({this.key, this.url});

  Avatar.fromJson(Map<String, dynamic> json) {
    key = json['key'];
    url = json['url'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['key'] = this.key;
    data['url'] = this.url;
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

