import 'dart:convert';

import 'NewFeedRespondModel.dart';



PostDetailRespondModel postDetailRespondModel(String str) =>
    PostDetailRespondModel.fromJson(json.decode(str));

class PostDetailRespondModel {
  Meta meta;
  Data data;

  PostDetailRespondModel({this.meta, this.data});

  PostDetailRespondModel.fromJson(Map<String, dynamic> json) {
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
  String id;
  int createdAt;
  int updatedAt;
  Recomendation recomendation;
  String content;
  String name;
  List<Medias> medias;
  Author author;
  int numOfReaction;
  int numOfComment;
  String reaction;
  String kind;
  bool saved;
  Foods ref;
  List<String> tags;
  String location;

  Data(
      {this.id,
        this.createdAt,
        this.updatedAt,
        this.recomendation,
        this.content,
        this.name,
        this.medias,
        this.author,
        this.numOfReaction,
        this.numOfComment,
        this.reaction,
        this.kind,
        this.saved,
        this.ref,
        this.tags,
        this.location});

  Data.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    recomendation = json['recomendation'] != null
        ? new Recomendation.fromJson(json['recomendation'])
        : null;
    content = json['content'];
    name = json['name'];
    if (json['medias'] != null) {
      medias = <Medias>[];
      json['medias'].forEach((v) {
        medias.add(new Medias.fromJson(v));
      });
    }
    author =
    json['author'] != null ? new Author.fromJson(json['author']) : null;
    numOfReaction = json['numOfReaction'];
    numOfComment = json['numOfComment'];
    reaction = json['reaction'];
    kind = json['kind'];
    saved = json['saved'];
    ref = json['ref'] != null ? new Foods.fromJson(json['ref']) : null;
    tags = json['tags'].cast<String>();
    location = json['location'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    if (this.recomendation != null) {
      data['recomendation'] = this.recomendation.toJson();
    }
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
    data['reaction'] = this.reaction;
    data['kind'] = this.kind;
    data['saved'] = this.saved;
    if (this.ref != null) {
      data['ref'] = this.ref.toJson();
    }
    data['tags'] = this.tags;
    data['location'] = this.location;
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




class Steps {
  String content;
  Photos photos;
  String id;
  int numberOfComment;
  int numberOfReaction;
  String reaction;

  Steps(
      {this.content,
        this.photos,
        this.id,
        this.numberOfComment,
        this.numberOfReaction,
        this.reaction});

  Steps.fromJson(Map<String, dynamic> json) {
    content = json['content'];
    photos =
    json['photos'] != null ? new Photos.fromJson(json['photos']) : null;
    id = json['id'];
    numberOfComment = json['numberOfComment'];
    numberOfReaction = json['numberOfReaction'];
    reaction = json['reaction'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['content'] = this.content;
    if (this.photos != null) {
      data['photos'] = this.photos.toJson();
    }
    data['id'] = this.id;
    data['numberOfComment'] = this.numberOfComment;
    data['numberOfReaction'] = this.numberOfReaction;
    data['reaction'] = this.reaction;
    return data;
  }
}

class Ingredients {
  String name;
  int quantity;
  String unit;

  Ingredients({this.name, this.quantity, this.unit});

  Ingredients.fromJson(Map<String, dynamic> json) {
    name = json['name'];
    quantity = json['quantity'];
    unit = json['unit'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['name'] = this.name;
    data['quantity'] = this.quantity;
    data['unit'] = this.unit;
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

class Medias {
  String url;
  String type;
  String id;
  String reaction;
  int numberOfComment;
  int numberOfReaction;

  Medias(
      {this.url,
        this.type,
        this.id,
        this.reaction,
        this.numberOfComment,
        this.numberOfReaction});

  Medias.fromJson(Map<String, dynamic> json) {
    url = json['url'];
    type = json['type'];
    id = json['id'];
    reaction = json['reaction'];
    numberOfComment = json['numberOfComment'] != null ? json['numberOfComment'] : 0;
    numberOfReaction = json['numberOfReaction'] != null ? json['numberOfReaction'] : 0;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['url'] = this.url;
    data['type'] = this.type;
    data['id'] = this.id;
    data['reaction'] = this.reaction;
    data['numberOfComment'] = this.numberOfComment;
    data['numberOfReaction'] = this.numberOfReaction;
    return data;
  }
}
