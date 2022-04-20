import 'dart:convert';
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
      foods = <Foods>[];
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
  int createdAt;
  String id;
  int servings;
  String name;
  String description;
  List<Photos> photos;
  int totalTime;

  List<Steps> steps;
  List<Ingredients> ingredients;
  String videoUrl;

  Foods(
      {this.createdAt,
        this.id,
        this.servings,
        this.name,
        this.description,
        this.photos,
        this.totalTime,

        this.steps,
        this.ingredients,
        this.videoUrl});

  Foods.fromJson(Map<String, dynamic> json) {
    createdAt = json['createdAt'];
    id = json['id'];
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
  String key;
  String url;
  String id;
  Photos({this.key, this.url, this.id});

  Photos.fromJson(Map<String, dynamic> json) {
    key = json['key'];
    url = json['url'];
    id = json['id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['key'] = this.key;
    data['url'] = this.url;
    data['id'] = this.id;
    return data;
  }
}

class Steps {
  String content;
  List<StepsPhoto> photos;
  String id;

  Steps({this.content, this.photos, this.id});

  Steps.fromJson(Map<String, dynamic> json) {
    content = json['content'];
    if (json['photos'] != null) {
      photos = <StepsPhoto>[];
      json['photos'].forEach((v) {
        photos.add(new StepsPhoto.fromJson(v));
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

class StepsPhoto {
  String key;
  String url;
  String type;

  StepsPhoto({this.key, this.url, this.type});

  StepsPhoto.fromJson(Map<String, dynamic> json) {
    key = json['key'];
    url = json['url'];
    type = json['type'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['key'] = this.key;
    data['url'] = this.url;
    data['type'] = this.type;
    return data;
  }
}

class Ingredients {
  String name;
  String quantity;
  String unit;

  Ingredients({this.name, this.quantity, this.unit});

  Ingredients.fromJson(Map<String, dynamic> json) {
    name = json['name'];
    quantity = json['quantity'].toString();
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
