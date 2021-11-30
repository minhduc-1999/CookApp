class ReactRequestModel {
  String react;

  ReactRequestModel({this.react});

  ReactRequestModel.fromJson(Map<String, dynamic> json) {
    react = json['react'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['react'] = this.react;
    return data;
  }
}
