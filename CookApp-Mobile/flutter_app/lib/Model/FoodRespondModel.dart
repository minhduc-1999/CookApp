import 'dart:convert';

import 'dart:ffi';
FoodRespondModel foodRespondModel(String str) =>
    FoodRespondModel.fromJson(json.decode(str));
class FoodRespondModel {
  Meta meta;
  Data data;

  FoodRespondModel({this.meta, this.data});

  FoodRespondModel.fromJson(Map<String, dynamic> json) {
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
  List<Foods> foods;
  Metadata metadata;

  Data({this.foods, this.metadata});

  Data.fromJson(Map<String, dynamic> json) {
    if (json['foods'] != null) {
      foods = new List<Foods>();
      json['foods'].forEach((v) {
        foods.add(new Foods.fromJson(v));
      });
    }
    metadata = json['metadata'] != null
        ? new Metadata.fromJson(json['metadata'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.foods != null) {
      data['foods'] = this.foods.map((v) => v.toJson()).toList();
    }
    if (this.metadata != null) {
      data['metadata'] = this.metadata.toJson();
    }
    return data;
  }
}

class Foods {
  String id;
  int servings;
  String name;
  String description;
  List<String> photos;
  int totalTime;
  List<String> cookingMethod;
  List<Steps> steps;
  List<Ingredients> ingredients;

  Foods(
      {this.id,
        this.servings,
        this.name,
        this.description,
        this.photos,
        this.totalTime,
        this.cookingMethod,
        this.steps,
        this.ingredients});

  Foods.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    servings = json['servings'];
    name = json['name'];
    description = json['description'];
    photos = json['photos'].cast<String>();
    totalTime = json['totalTime'];
    cookingMethod = json['cookingMethod'].cast<String>();
    if (json['steps'] != null) {
      steps = new List<Steps>();
      json['steps'].forEach((v) {
        steps.add(new Steps.fromJson(v));
      });
    }
    if (json['ingredients'] != null) {
      ingredients = new List<Ingredients>();
      json['ingredients'].forEach((v) {
        ingredients.add(new Ingredients.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['servings'] = this.servings;
    data['name'] = this.name;
    data['description'] = this.description;
    data['photos'] = this.photos;
    data['totalTime'] = this.totalTime;
    data['cookingMethod'] = this.cookingMethod;
    if (this.steps != null) {
      data['steps'] = this.steps.map((v) => v.toJson()).toList();
    }
    if (this.ingredients != null) {
      data['ingredients'] = this.ingredients.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Steps {
  String content;
  List<String> photos;

  Steps({this.content, this.photos});

  Steps.fromJson(Map<String, dynamic> json) {
    content = json['content'];
    photos = json['photos'].cast<String>();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['content'] = this.content;
    data['photos'] = this.photos;
    return data;
  }
}

class Ingredients {
  Unit unit;
  String name;
  int quantity;

  Ingredients({this.unit, this.name, this.quantity});

  Ingredients.fromJson(Map<String, dynamic> json) {
    unit = json['unit'] != null ? new Unit.fromJson(json['unit']) : null;
    name = json['name'] != null ? json['name'] : null;
    quantity = json['quantity'] != null ? json['quantity'].toInt() : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.unit != null) {
      data['unit'] = this.unit.toJson();
    }
    data['name'] = this.name;
    data['quantity'] = this.quantity;
    return data;
  }
}

class Unit {
  String unit;
  int value;

  Unit({this.unit, this.value});

  Unit.fromJson(Map<String, dynamic> json) {
    unit = json['unit'] != null ? json['unit'] : null;
    value = json['value'] != null ? json['value'] : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['unit'] = this.unit;
    data['value'] = this.value;
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
