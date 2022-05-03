import 'dart:convert';
SavedPostRespondModel savedPostRespondModel(String str) =>
    SavedPostRespondModel.fromJson(json.decode(str));
class SavedPostRespondModel {
  Meta meta;
  Data data;

  SavedPostRespondModel({this.meta, this.data});

  SavedPostRespondModel.fromJson(Map<String, dynamic> json) {
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
      posts = <Posts>[];
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
  int savedAt;
  Post post;

  Posts({this.savedAt, this.post});

  Posts.fromJson(Map<String, dynamic> json) {
    savedAt = json['savedAt'];
    post = json['post'] != null ? new Post.fromJson(json['post']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['savedAt'] = this.savedAt;
    if (this.post != null) {
      data['post'] = this.post.toJson();
    }
    return data;
  }
}

class Post {
  int createdAt;
  String id;
  int updatedAt;
  Author author;
  int numOfComment;
  int numOfReaction;
  String kind;
  String location;
  List<Medias> medias;
  String reaction;
  String content;

  Post(
      {this.createdAt,
        this.id,
        this.updatedAt,
        this.author,
        this.numOfComment,
        this.numOfReaction,
        this.kind,
        this.location,
        this.medias,
        this.reaction,
        this.content});

  Post.fromJson(Map<String, dynamic> json) {
    createdAt = json['createdAt'];
    id = json['id'];
    updatedAt = json['updatedAt'];
    author =
    json['author'] != null ? new Author.fromJson(json['author']) : null;
    numOfComment = json['numOfComment'];
    numOfReaction = json['numOfReaction'];
    kind = json['kind'];
    location = json['location'];
    if (json['medias'] != null) {
      medias = <Medias>[];
      json['medias'].forEach((v) {
        medias.add(new Medias.fromJson(v));
      });
    }
    reaction = json['reaction'];
    content = json['content'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['createdAt'] = this.createdAt;
    data['id'] = this.id;
    data['updatedAt'] = this.updatedAt;
    if (this.author != null) {
      data['author'] = this.author.toJson();
    }
    data['numOfComment'] = this.numOfComment;
    data['numOfReaction'] = this.numOfReaction;
    data['kind'] = this.kind;
    data['location'] = this.location;
    if (this.medias != null) {
      data['medias'] = this.medias.map((v) => v.toJson()).toList();
    }
    data['reaction'] = this.reaction;
    data['content'] = this.content;
    return data;
  }
}

class Author {
  String id;
  Avatar avatar;
  String displayName;

  Author({this.id, this.avatar, this.displayName});

  Author.fromJson(Map<String, dynamic> json) {
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
  String url;
  String type;

  Avatar({this.url, this.type});

  Avatar.fromJson(Map<String, dynamic> json) {
    url = json['url'];
    type = json['type'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['url'] = this.url;
    data['type'] = this.type;
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
class Medias {
  String url;
  String type;

  Medias(
      {this.url,
        this.type,
        });
  Medias.fromJson(Map<String, dynamic> json) {
    url = json['url'];
    type = json['type'];
  }
  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['url'] = this.url;
    data['type'] = this.type;
    return data;
  }
}
