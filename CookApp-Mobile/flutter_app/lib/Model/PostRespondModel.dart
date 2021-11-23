class PostRespondModel {
  Meta meta;
  Data data;

  PostRespondModel({this.meta, this.data});

  PostRespondModel.fromJson(Map<String, dynamic> json) {
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
  String content;
  List<String> images;
  List<String> videos;
  Author author;

  Data(
      {this.id,
        this.createdAt,
        this.updatedAt,
        this.content,
        this.images,
        this.videos,
        this.author});

  Data.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    content = json['content'];
    images = json['images'].cast<String>();
    videos = json['videos'].cast<String>();
    author =
    json['author'] != null ? new Author.fromJson(json['author']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['content'] = this.content;
    data['images'] = this.images;
    data['videos'] = this.videos;
    if (this.author != null) {
      data['author'] = this.author.toJson();
    }
    return data;
  }
}

class Author {
  String id;
  String avatar;
  String displayName;

  Author({this.id, this.avatar, this.displayName});

  Author.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    avatar = json['avatar'];
    displayName = json['displayName'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['avatar'] = this.avatar;
    data['displayName'] = this.displayName;
    return data;
  }
}
