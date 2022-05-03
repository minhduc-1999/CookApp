import 'dart:convert';


AlbumRespondModel albumRespondModel(String str) =>
    AlbumRespondModel.fromJson(json.decode(str));
class AlbumRespondModel {
  Meta meta;
  Data data;

  AlbumRespondModel({this.meta, this.data});

  AlbumRespondModel.fromJson(Map<String, dynamic> json) {
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
  List<Albums> albums;
  Metadata metadata;
  Data({this.albums,this.metadata});

  Data.fromJson(Map<String, dynamic> json) {
    if (json['albums'] != null) {
      albums = <Albums>[];
      json['albums'].forEach((v) {
        albums.add(new Albums.fromJson(v));
      });
    }
    metadata = json['metadata'] != null
        ? new Metadata.fromJson(json['metadata'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.albums != null) {
      data['albums'] = this.albums.map((v) => v.toJson()).toList();
    }
    if (this.metadata != null) {
      data['metadata'] = this.metadata.toJson();
    }
    return data;
  }
}

class Albums {
  String id;
  int createdAt;
  int updatedAt;
  String name;
  String description;
  List<Medias> medias;
  Owner owner;
  int numOfComment;
  int numOfReaction;
  Albums(
      {this.id,
        this.createdAt,
        this.updatedAt,
        this.name,
        this.description,
        this.medias,
        this.owner});

  Albums.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    name = json['name'];
    description = json['description'];
    if (json['medias'] != null) {
      medias = <Medias>[];
      json['medias'].forEach((v) {
        medias.add(new Medias.fromJson(v));
      });
    }
    owner = json['owner'] != null ? new Owner.fromJson(json['owner']) : null;
    numOfComment = json['numOfComment'];
    numOfReaction = json['numOfReaction'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['name'] = this.name;
    data['description'] = this.description;
    if (this.medias != null) {
      data['medias'] = this.medias.map((v) => v.toJson()).toList();
    }
    if (this.owner != null) {
      data['owner'] = this.owner.toJson();
    }
    data['numOfComment'] = this.numOfComment;
    data['numOfReaction'] = this.numOfReaction;
    return data;
  }
}

class Medias {
  String id;
  String url;
  String type;
  String reaction;

  Medias({this.id, this.url, this.type, this.reaction});

  Medias.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    url = json['url'];
    type = json['type'];
    reaction = json['reaction'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['url'] = this.url;
    data['type'] = this.type;
    data['reaction'] = this.reaction;
    return data;
  }
}

class Owner {
  String id;
  Medias avatar;
  String displayName;

  Owner({this.id, this.avatar, this.displayName});

  Owner.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    avatar =
    json['avatar'] != null ? new Medias.fromJson(json['avatar']) : null;
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
