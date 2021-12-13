import 'UserRespondModel.dart';

class EditUserRequestModel {
  String displayName;
  String avatar;
  Profile profile;

  EditUserRequestModel({this.displayName, this.avatar, this.profile});

  EditUserRequestModel.fromJson(Map<String, dynamic> json) {
    displayName = json['displayName'];
    avatar = json['avatar'];
    profile =
    json['profile'] != null ? new Profile.fromJson(json['profile']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['displayName'] = this.displayName;
    data['avatar'] = this.avatar;
    if (this.profile != null) {
      data['profile'] = this.profile.toJson();
    }
    return data;
  }
}


