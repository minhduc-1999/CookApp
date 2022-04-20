import 'dart:convert';
FoodInstructionRespondModel foodInstructionRespondModel(String str) =>
    FoodInstructionRespondModel.fromJson(json.decode(str));
class FoodInstructionRespondModel {
  Meta meta;
  Data data;

  FoodInstructionRespondModel({this.meta, this.data});

  FoodInstructionRespondModel.fromJson(Map<String, dynamic> json) {
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
  int servings;
  String name;
  String description;
  List<Photos> photos;
  int totalTime;
  List<Steps> steps;
  List<Ingredients> ingredients;
  String videoUrl;

  Data(
      {this.createdAt,
        this.id,
        this.updatedAt,
        this.servings,
        this.name,
        this.description,
        this.photos,
        this.totalTime,
        this.steps,
        this.ingredients,
        this.videoUrl});

  Data.fromJson(Map<String, dynamic> json) {
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
    if (json['steps'] != null) {
      steps = <Steps>[];
      json['steps'].forEach((v) {
        steps.add(new Steps.fromJson(v));
      });
    }
    if (json['ingredients'] != null) {
      ingredients = <Ingredients>[];
      json['ingredients'].forEach((v) {
        ingredients.add(new Ingredients.fromJson(v));
      });
    }
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
    if (this.steps != null) {
      data['steps'] = this.steps.map((v) => v.toJson()).toList();
    }
    if (this.ingredients != null) {
      data['ingredients'] = this.ingredients.map((v) => v.toJson()).toList();
    }
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

class Steps {
  String content;
  List<Photos> photos;
  String id;

  Steps({this.content, this.photos, this.id});

  Steps.fromJson(Map<String, dynamic> json) {
    content = json['content'];
    if (json['photos'] != null) {
      photos = <Photos>[];
      json['photos'].forEach((v) {
        photos.add(new Photos.fromJson(v));
      });
    }
    id = json['id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['content'] = this.content;
    if (this.photos != null) {
      data['photos'] = this.photos.map((v) => v.toJson()).toList();
    }
    data['id'] = this.id;
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
