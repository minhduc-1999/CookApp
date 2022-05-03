import 'dart:convert';
UserWallRespondModel userWallRespondModel(String str) =>
    UserWallRespondModel.fromJson(json.decode(str));
class UserWallRespondModel {
  Meta meta;
  Data data;

  UserWallRespondModel({this.meta, this.data});

  UserWallRespondModel.fromJson(Map<String, dynamic> json) {
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
  Avatar avatar;
  String displayName;
  int numberOfPost;
  int numberOfFollower;
  int numberOfFollowing;
  bool isFollowed;
  Conversation conversation;

  Data(
      {this.id,
        this.avatar,
        this.displayName,
        this.numberOfPost,
        this.numberOfFollower,
        this.numberOfFollowing,
        this.isFollowed,
        this.conversation});

  Data.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    avatar =
    json['avatar'] != null ? new Avatar.fromJson(json['avatar']) : null;
    displayName = json['displayName'];
    numberOfPost = json['numberOfPost'];
    numberOfFollower = json['numberOfFollower'];
    numberOfFollowing = json['numberOfFollowing'];
    isFollowed = json['isFollowed'];
    conversation = json['conversation'] != null
        ? new Conversation.fromJson(json['conversation'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    if (this.avatar != null) {
      data['avatar'] = this.avatar.toJson();
    }
    data['displayName'] = this.displayName;
    data['numberOfPost'] = this.numberOfPost;
    data['numberOfFollower'] = this.numberOfFollower;
    data['numberOfFollowing'] = this.numberOfFollowing;
    data['isFollowed'] = this.isFollowed;
    if (this.conversation != null) {
      data['conversation'] = this.conversation.toJson();
    }
    return data;
  }
}

class Avatar {
  String id;
  String url;
  String type;
  String reaction;

  Avatar({this.id, this.url, this.type, this.reaction});

  Avatar.fromJson(Map<String, dynamic> json) {
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

class Conversation {
  String id;
  int createdAt;
  int updatedAt;
  String type;
  LastMessage lastMessage;
  bool readAll;

  Conversation(
      {this.id,
        this.createdAt,
        this.updatedAt,
        this.type,
        this.lastMessage,
        this.readAll});

  Conversation.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    createdAt = json['createdAt'] != null ? json['createdAt'] : null ;
    updatedAt = json['updatedAt'] != null ? json['updatedAt'] : null;
    type = json['type'];
    lastMessage = json['lastMessage'] != null
        ? new LastMessage.fromJson(json['lastMessage'])
        : null;
    readAll = json['readAll'] != null ? json['readAll'] : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['type'] = this.type;
    if (this.lastMessage != null) {
      data['lastMessage'] = this.lastMessage.toJson();
    }
    data['readAll'] = this.readAll;
    return data;
  }
}

class LastMessage {
  String id;
  int createdAt;
  int updatedAt;
  String content;
  String type;
  Sender sender;
  String to;

  LastMessage(
      {this.id,
        this.createdAt,
        this.updatedAt,
        this.content,
        this.type,
        this.sender,
        this.to});

  LastMessage.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    content = json['content'];
    type = json['type'];
    sender =
    json['sender'] != null ? new Sender.fromJson(json['sender']) : null;
    to = json['to'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['content'] = this.content;
    data['type'] = this.type;
    if (this.sender != null) {
      data['sender'] = this.sender.toJson();
    }
    data['to'] = this.to;
    return data;
  }
}

class Sender {
  String id;
  Avatar avatar;
  String displayName;

  Sender({this.id, this.avatar, this.displayName});

  Sender.fromJson(Map<String, dynamic> json) {
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

