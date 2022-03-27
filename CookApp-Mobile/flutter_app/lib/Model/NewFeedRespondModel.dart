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
  String name;
  String updatedBy;
  List<Images> images;
  List<Videos> videos;
  Author author;
  int numOfReaction;
  int numOfComment;
  String kind;
  String reaction;
  Posts(
      {this.id,
        this.createdAt,
        this.updatedAt,
        this.updatedBy,
        this.content,
        this.name,
        this.images,
        this.videos,
        this.author,
        this.numOfReaction,
        this.numOfComment,
        this.reaction,
        this.kind});


  Posts.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    updatedBy = json['updatedBy'];
    content = json['content'];
    name = json['name'];
    if (json['images'] != null) {
      images = <Images>[];
      json['images'].forEach((v) {
        images.add(new Images.fromJson(v));
      });
    }
    if (json['videos'] != null) {
      videos = <Videos>[];
      json['videos'].forEach((v) {
        videos.add(new Videos.fromJson(v));
      });
    }
    author =
    json['author'] != null ? new Author.fromJson(json['author']) : null;
    numOfReaction = json['numOfReaction'];
    numOfComment = json['numOfComment'];
    reaction = json['reaction'];
    kind = json['kind'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['updatedBy'] = this.updatedBy;
    data['content'] = this.content;
    data['name'] = this.name;
    if (this.images != null) {
      data['images'] = this.images.map((v) => v.toJson()).toList();
    }
    if (this.videos != null) {
      data['videos'] = this.videos.map((v) => v.toJson()).toList();
    }
    if (this.author != null) {
      data['author'] = this.author.toJson();
    }
    data['numOfReaction'] = this.numOfReaction;
    data['numOfComment'] = this.numOfComment;
    data['reaction'] = this.reaction;
    data['kind'] = this.kind;
    return data;
  }
}

class Author {
  String id;
  String displayName;
  Avatar avatar;

  Author({this.id, this.displayName, this.avatar});

  Author.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    displayName = json['displayName'] != null ? json['displayName'] : null;
    avatar = json['avatar'] != null ? new Avatar.fromJson(json['avatar']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['displayName'] = this.displayName;
    data['avatar'] = this.avatar.toJson();
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
class Images {
  String key;
  String url;

  Images({this.key, this.url});

  Images.fromJson(Map<String, dynamic> json) {
    key = json['key'] != null ? json['key'] : null;
    url = json['url'] != null ? json['url'] : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['key'] = this.key;
    data['url'] = this.url;
    return data;
  }
}
class Videos {
  String key;
  String url;

  Videos({this.key, this.url});

  Videos.fromJson(Map<String, dynamic> json) {
    key = json['key'] != null ? json['key'] : null;
    url = json['url'] != null ? json['url'] : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['key'] = this.key;
    data['url'] = this.url;
    return data;
  }
}
class Avatar {
  String key;
  String url;

  Avatar({this.key, this.url});

  Avatar.fromJson(Map<String, dynamic> json) {
    key = json['key'] != null ? json['key'] : null;
    url = json['url'] != null ? json['url'] : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['key'] = this.key;
    data['url'] = this.url;
    return data;
  }
}
