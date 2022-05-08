import 'dart:convert';
ChatBotRespondModel chatBotRespondModel(String str) =>
    ChatBotRespondModel.fromJson(json.decode(str));
class ChatBotRespondModel {
  Meta meta;
  Data data;

  ChatBotRespondModel({this.meta, this.data});

  ChatBotRespondModel.fromJson(Map<String, dynamic> json) {
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
  String text;
  Attachment attachment;
  String type;
  String sessionID;
  bool endInteraction;

  Data(
      {this.text,
        this.attachment,
        this.type,
        this.sessionID,
        this.endInteraction});

  Data.fromJson(Map<String, dynamic> json) {
    text = json['text'];
    attachment = json['attachment'] != null
        ? new Attachment.fromJson(json['attachment'])
        : null;
    type = json['type'];
    sessionID = json['sessionID'];
    endInteraction = json['endInteraction'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['text'] = this.text;
    if (this.attachment != null) {
      data['attachment'] = this.attachment.toJson();
    }
    data['type'] = this.type;
    data['sessionID'] = this.sessionID;
    data['endInteraction'] = this.endInteraction;
    return data;
  }
}

class Attachment {
  List<Recipes> recipes;
  List<Ingredients> ingredients;

  Attachment({this.recipes, this.ingredients});

  Attachment.fromJson(Map<String, dynamic> json) {
    if (json['recipes'] != null) {
      recipes = <Recipes>[];
      json['recipes'].forEach((v) {
        recipes.add(new Recipes.fromJson(v));
      });
    }
    if (json['ingredients'] != null) {
      ingredients = <Ingredients>[];
      json['ingredients'].forEach((v) {
        ingredients.add(new Ingredients.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.recipes != null) {
      data['recipes'] = this.recipes.map((v) => v.toJson()).toList();
    }
    if (this.ingredients != null) {
      data['ingredients'] = this.ingredients.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Recipes {
  String content;
  Photos photos;
  String id;
  int numberOfComment;
  int numberOfReaction;
  String reaction;

  Recipes(
      {this.content,
        this.photos,
        this.id,
        this.numberOfComment,
        this.numberOfReaction,
        this.reaction});

  Recipes.fromJson(Map<String, dynamic> json) {
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

class Photos {
  String id;
  String url;
  String type;
  String reaction;

  Photos({this.id, this.url, this.type, this.reaction});

  Photos.fromJson(Map<String, dynamic> json) {
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

class Ingredients {
  String name;
  num quantity;
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
