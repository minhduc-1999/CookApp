class CreateFoodRequestModel {
  int servings;
  int totalTime;
  List<Steps> steps;
  List<Ingredients> ingredients;
  String videoUrl;
  String name;
  String description;
  List<String> photos;


  CreateFoodRequestModel(
      {this.servings,
        this.totalTime,
        this.steps,
        this.ingredients,
        this.videoUrl,
        this.name,
        this.description,
        this.photos,
        });

  CreateFoodRequestModel.fromJson(Map<String, dynamic> json) {
    servings = json['servings'];
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
    name = json['name'];
    description = json['description'];
    photos = json['photos'].cast<String>();

  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['servings'] = this.servings;
    data['totalTime'] = this.totalTime;
    if (this.steps != null) {
      data['steps'] = this.steps.map((v) => v.toJson()).toList();
    }
    if (this.ingredients != null) {
      data['ingredients'] = this.ingredients.map((v) => v.toJson()).toList();
    }
    if (videoUrl != "") {
      data['videoUrl'] = this.videoUrl;
    }
    data['name'] = this.name;
    data['description'] = this.description;
    data['photos'] = this.photos;

    return data;
  }
}

class Steps {
  String content;


  Steps({this.content});

  Steps.fromJson(Map<String, dynamic> json) {
    content = json['content'];

  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['content'] = this.content;

    return data;
  }
}

class Ingredients {
  String name;
  String unit;
  num quantity;

  Ingredients({this.name, this.unit, this.quantity});

  Ingredients.fromJson(Map<String, dynamic> json) {
    name = json['name'];
    unit = json['unit'];
    quantity = json['quantity'];

  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['name'] = this.name;
    data['unit'] = this.unit;
    data['quantity'] = this.quantity;
    return data;
  }
}
