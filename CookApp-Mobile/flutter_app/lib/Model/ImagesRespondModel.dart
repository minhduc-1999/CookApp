class ImagesRespondModel {
  Meta meta;
  Data data;

  ImagesRespondModel({this.meta, this.data});

  ImagesRespondModel.fromJson(Map<String, dynamic> json) {
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
  String name;
  String createdAt;
  List<Images> images;

  Data({this.id, this.name, this.createdAt, this.images});

  Data.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    name = json['name'];
    createdAt = json['createdAt'];
    if (json['images'] != null) {
      images = <Images>[];
      json['images'].forEach((v) {
        images.add(new Images.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['name'] = this.name;
    data['createdAt'] = this.createdAt;
    if (this.images != null) {
      data['images'] = this.images.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Images {
  String key;
  String url;
  int numOfReaction;
  int numOfComment;
  String reaction;

  Images(
      {this.key,
        this.url,
        this.numOfReaction,
        this.numOfComment,
        this.reaction});

  Images.fromJson(Map<String, dynamic> json) {
    key = json['key'];
    url = json['url'];
    numOfReaction = json['numOfReaction'];
    numOfComment = json['numOfComment'];
    reaction = json['reaction'] != null ? json['reaction'] : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['key'] = this.key;
    data['url'] = this.url;
    data['numOfReaction'] = this.numOfReaction;
    data['numOfComment'] = this.numOfComment;
    data['reaction'] = this.reaction;
    return data;
  }
}
