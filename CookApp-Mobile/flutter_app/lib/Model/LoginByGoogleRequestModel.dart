class LoginByGoogleRequestModel {
  String idToken;

  LoginByGoogleRequestModel({this.idToken});

  LoginByGoogleRequestModel.fromJson(Map<String, dynamic> json) {
    idToken = json['idToken'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['idToken'] = this.idToken;
    return data;
  }
}
