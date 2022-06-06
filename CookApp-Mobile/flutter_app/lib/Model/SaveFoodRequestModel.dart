class SaveFoodRequestModel {
  String type;
  bool forceUpdate;

  SaveFoodRequestModel({this.type, this.forceUpdate});

  SaveFoodRequestModel.fromJson(Map<String, dynamic> json) {
    type = json['type'];
    forceUpdate = json['forceUpdate'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['type'] = this.type;
    data['forceUpdate'] = this.forceUpdate;
    return data;
  }
}
