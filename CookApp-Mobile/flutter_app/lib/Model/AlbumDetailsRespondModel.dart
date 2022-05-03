import 'dart:convert';


AlbumDetailsRespondModel albumDetailsRespondModel(String str) =>
    AlbumDetailsRespondModel.fromJson(json.decode(str));
class AlbumDetailsRespondModel {
  Meta meta;
  Data data;

  AlbumDetailsRespondModel({this.meta, this.data});

  AlbumDetailsRespondModel.fromJson(Map<String, dynamic> json) {
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
  String name;
  List<Medias> medias;
  Owner owner;
  String description;
  int numOfComment;
  int numOfReaction;
  String reaction;
  Data(
      {this.createdAt,
        this.id,
        this.updatedAt,
        this.name,
        this.medias,
        this.owner,
        this.description,
        this.numOfComment,
        this.numOfReaction});

  Data.fromJson(Map<String, dynamic> json) {
    createdAt = json['createdAt'];
    id = json['id'];
    updatedAt = json['updatedAt'];
    name = json['name'];
    if (json['medias'] != null) {
      medias = <Medias>[];
      json['medias'].forEach((v) {
        medias.add(new Medias.fromJson(v));
      });
    }
    owner = json['owner'] != null ? new Owner.fromJson(json['owner']) : null;
    description = json['description'];
    numOfComment = json['numOfComment'];
    numOfReaction = json['numOfReaction'];
    reaction = json['reaction'] != null ? json['reaction'] : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['createdAt'] = this.createdAt;
    data['id'] = this.id;
    data['updatedAt'] = this.updatedAt;
    data['name'] = this.name;
    if (this.medias != null) {
      data['medias'] = this.medias.map((v) => v.toJson()).toList();
    }
    if (this.owner != null) {
      data['owner'] = this.owner.toJson();
    }
    data['description'] = this.description;
    data['numOfComment'] = this.numOfComment;
    data['numOfReaction'] = this.numOfReaction;
    if (this.reaction != null){
      data['reaction'] = this.reaction;
    }
    return data;
  }
}

class Medias {
  String url;
  String type;
  String id;
  int numberOfComment;
  int numberOfReaction;
  String reaction;
  Medias(
      {this.url,
        this.type,
        this.id,
        this.numberOfComment,
        this.numberOfReaction,
      this.reaction});

  Medias.fromJson(Map<String, dynamic> json) {
    url = json['url'];
    type = json['type'];
    id = json['id'];
    numberOfComment = json['numberOfComment'];
    numberOfReaction = json['numberOfReaction'];
    reaction = json['reaction'] != null ? json['reaction'] : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['url'] = this.url;
    data['type'] = this.type;
    data['id'] = this.id;
    data['numberOfComment'] = this.numberOfComment;
    data['numberOfReaction'] = this.numberOfReaction;
    if(this.reaction != null){
      data['reaction'] = this.reaction;
    }
    return data;
  }
}

class Owner {
  String id;
  Avatar avatar;
  String displayName;

  Owner({this.id, this.avatar, this.displayName});

  Owner.fromJson(Map<String, dynamic> json) {
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
