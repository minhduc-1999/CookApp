import 'dart:convert';

import 'PostDetailRespondModel.dart';
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
  String id;
  int createdAt;
  int updatedAt;
  String content;
  String name;
  List<Medias> medias;
  Author author;
  int numOfReaction;
  int numOfComment;
  String reaction;
  String kind;
  String location;
  List<String> tags;
  Recomendation recomendation;
  bool saved;
  Ref ref;
  Posts(
      {this.id,
        this.createdAt,
        this.updatedAt,
        this.content,
        this.name,
        this.medias,
        this.author,
        this.numOfReaction,
        this.numOfComment,
        this.reaction,
        this.kind,
        this.location,
        this.saved,
      this.tags});

  Posts.fromJson(Map<String, dynamic> json) {
    List <String> temp = [];
    id = json['id'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    content = json['content'];
    name = json['name'];
    if (json['medias'] != null) {
      medias = <Medias>[];
      json['medias'].forEach((v) {
        medias.add(new Medias.fromJson(v));
      });
    }
    recomendation = json['recomendation'] != null
        ? new Recomendation.fromJson(json['recomendation'])
        : null;
    author =
    json['author'] != null ? new Author.fromJson(json['author']) : null;
    numOfReaction = json['numOfReaction'];
    numOfComment = json['numOfComment'];
    reaction = json['reaction'];
    kind = json['kind'];
    location = json['location'];
    saved = json['saved'];
    ref = json['ref'] != null ? new Ref.fromJson(json['ref']) : null;
    tags = json['tags'].cast<String>();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['content'] = this.content;
    data['name'] = this.name;
    if (this.medias != null) {
      data['medias'] = this.medias.map((v) => v.toJson()).toList();
    }
    if (this.author != null) {
      data['author'] = this.author.toJson();
    }
    data['numOfReaction'] = this.numOfReaction;
    data['numOfComment'] = this.numOfComment;
    if (this.recomendation != null) {
      data['recomendation'] = this.recomendation.toJson();
    }
    data['reaction'] = this.reaction;
    data['kind'] = this.kind;
    data['location'] = this.location;
    data['saved'] = this.saved;
    if (this.ref != null) {
      data['ref'] = this.ref.toJson();
    }
    data['tags'] = this.tags;
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

class Should {
  String advice;
  List<Foods> foods;

  Should({this.advice, this.foods});

  Should.fromJson(Map<String, dynamic> json) {
    advice = json['advice'];
    if (json['foods'] != null) {
      foods = <Foods>[];
      json['foods'].forEach((v) {
        foods.add(new Foods.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['advice'] = this.advice;
    if (this.foods != null) {
      data['foods'] = this.foods.map((v) => v.toJson()).toList();
    }
    return data;
  }
}
class Foods {
  int createdAt;
  String id;
  int updatedAt;
  int servings;
  String name;
  String description;
  List<Photos> photos;
  int totalTime;
/*  List<Null>? steps;
  List<Null>? ingredients;*/
  String videoUrl;
  Author author;
  num rating;

  Foods(
      {this.createdAt,
        this.id,
        this.updatedAt,
        this.servings,
        this.name,
        this.description,
        this.photos,
        this.totalTime,

        this.videoUrl,
        this.author,
        this.rating});

  Foods.fromJson(Map<String, dynamic> json) {
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
    videoUrl = json['videoUrl'];
    author =
    json['author'] != null ? new Author.fromJson(json['author']) : null;
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

    data['videoUrl'] = this.videoUrl;
    if (this.author != null) {
      data['author'] = this.author.toJson();
    }
    data['rating'] = this.rating;
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
class Ref {
  int createdAt;
  String id;
  int updatedAt;
  int servings;
  String name;
  String description;
  List<Photos> photos;
  int totalTime;

  String videoUrl;

  Ref(
      {this.createdAt,
        this.id,
        this.updatedAt,
        this.servings,
        this.name,
        this.description,
        this.photos,
        this.totalTime,

        this.videoUrl});

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

    videoUrl = json['videoUrl'];
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

    data['videoUrl'] = this.videoUrl;
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
