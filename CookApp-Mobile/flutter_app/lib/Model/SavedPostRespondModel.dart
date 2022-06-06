import 'dart:convert';

import 'NewFeedRespondModel.dart';
import 'PostDetailRespondModel.dart';
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
  List<String> tags;
  String content;
  String location;
  List<Medias> medias;
  String reaction;
  Ref ref;
  Recomendation recomendation;

  Post(
      {this.createdAt,
        this.id,
        this.updatedAt,
        this.author,
        this.numOfComment,
        this.numOfReaction,
        this.kind,
        this.tags,
        this.content,
        this.location,
        this.medias,
        this.reaction,
        this.ref,
        this.recomendation});

  Post.fromJson(Map<String, dynamic> json) {
    createdAt = json['createdAt'];
    id = json['id'];
    updatedAt = json['updatedAt'];
    author =
    json['author'] != null ? new Author.fromJson(json['author']) : null;
    numOfComment = json['numOfComment'];
    numOfReaction = json['numOfReaction'];
    kind = json['kind'];
    tags = json['tags'].cast<String>();
    content = json['content'];
    location = json['location'];
    if (json['medias'] != null) {
      medias = <Medias>[];
      json['medias'].forEach((v) {
        medias.add(new Medias.fromJson(v));
      });
    }
    reaction = json['reaction'];
    ref = json['ref'] != null ? new Ref.fromJson(json['ref']) : null;
    recomendation = json['recomendation'] != null
        ? new Recomendation.fromJson(json['recomendation'])
        : null;
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
    data['tags'] = this.tags;
    data['content'] = this.content;
    data['location'] = this.location;
    if (this.medias != null) {
      data['medias'] = this.medias.map((v) => v.toJson()).toList();
    }
    data['reaction'] = this.reaction;
    if (this.ref != null) {
      data['ref'] = this.ref.toJson();
    }
    if (this.recomendation != null) {
      data['recomendation'] = this.recomendation.toJson();
    }
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

class Ref {
  int createdAt;
  String id;
  int updatedAt;
  int servings;
  String name;
  String description;
  List<Photos> photos;
  int totalTime;
  int rating;

  Ref(
      {this.createdAt,
        this.id,
        this.updatedAt,
        this.servings,
        this.name,
        this.description,
        this.photos,
        this.totalTime,

        this.rating});

  Ref.fromJson(Map<String, dynamic> json) {
    createdAt = json['createdAt'];
    id = json['id'];
    updatedAt = json['updatedAt'];
    servings = json['servings'];
    name = json['name'];
    description = json['description'];
    if (json['photos'] != null) {
      photos = <Photos>[];
      json['photos'].forEach((v) {
        photos.add(new Photos.fromJson(v));
      });
    }
    totalTime = json['totalTime'];

    rating = json['rating'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['createdAt'] = this.createdAt;
    data['id'] = this.id;
    data['updatedAt'] = this.updatedAt;
    data['servings'] = this.servings;
    data['name'] = this.name;
    data['description'] = this.description;
    if (this.photos != null) {
      data['photos'] = this.photos.map((v) => v.toJson()).toList();
    }
    data['totalTime'] = this.totalTime;

    data['rating'] = this.rating;
    return data;
  }
}

class Photos {
  String url;
  String type;
  String id;

  Photos({this.url, this.type, this.id});

  Photos.fromJson(Map<String, dynamic> json) {
    url = json['url'];
    type = json['type'];
    id = json['id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['url'] = this.url;
    data['type'] = this.type;
    data['id'] = this.id;
    return data;
  }
}

class Recomendation {
  Should should;
  Should shouldNot;

  Recomendation({this.should, this.shouldNot});

  Recomendation.fromJson(Map<String, dynamic> json) {
    should =
    json['should'] != null ? new Should.fromJson(json['should']) : null;
    shouldNot = json['shouldNot'] != null
        ? new Should.fromJson(json['shouldNot'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.should != null) {
      data['should'] = this.should.toJson();
    }
    if (this.shouldNot != null) {
      data['shouldNot'] = this.shouldNot.toJson();
    }
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
