import 'dart:convert';



MultiImagesRespondModel multiImageRespondModel(String str) =>
    MultiImagesRespondModel.fromJson(json.decode(str));

class MultiImagesRespondModel {
  Meta meta;
  Data data;

  MultiImagesRespondModel({this.meta, this.data});

  MultiImagesRespondModel.fromJson(Map<String, dynamic> json) {
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
  int createdAt;
  String id;
  int updatedAt;
  Author author;
  int numOfComment;
  int numOfReaction;
  String kind;
  String location;
  List<Medias> medias;
  bool saved;
  String content;
  String reaction;
  Data(
      {this.createdAt,
        this.id,
        this.updatedAt,
        this.author,
        this.numOfComment,
        this.numOfReaction,
        this.kind,
        this.location,
        this.medias,
        this.saved,
        this.content,
      this.reaction});

  Data.fromJson(Map<String, dynamic> json) {
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
    saved = json['saved'];
    content = json['content'];
    reaction = json['reaction'];
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
    data['saved'] = this.saved;
    data['content'] = this.content;
    data['reaction'] = this.reaction;
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
    numberOfComment = json['numberOfComment'];
    numberOfReaction = json['numberOfReaction'];
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
