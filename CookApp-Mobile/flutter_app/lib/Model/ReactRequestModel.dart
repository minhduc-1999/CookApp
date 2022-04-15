class ReactRequestModel {
  String targetId;
  String targetType;
  String react;

  ReactRequestModel({this.targetId, this.targetType, this.react});

  ReactRequestModel.fromJson(Map<String, dynamic> json) {
    targetId = json['targetId'];
    targetType = json['targetType'];
    react = json['react'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['targetId'] = this.targetId;
    data['targetType'] = this.targetType;
    data['react'] = this.react;
    return data;
  }
}
