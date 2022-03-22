class ReactRequestModel {
  String targetKeyOrID;
  String targetType;
  String react;

  ReactRequestModel({this.targetKeyOrID, this.targetType, this.react});

  ReactRequestModel.fromJson(Map<String, dynamic> json) {
    targetKeyOrID = json['targetKeyOrID'];
    targetType = json['targetType'];
    react = json['react'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['targetKeyOrID'] = this.targetKeyOrID;
    data['targetType'] = this.targetType;
    data['react'] = this.react;
    return data;
  }
}
