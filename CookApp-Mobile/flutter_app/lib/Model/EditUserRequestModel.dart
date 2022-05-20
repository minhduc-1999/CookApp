import 'UserRespondModel.dart';

class EditUserRequestModel {
  String displayName;
  String avatar;
  int height;
  int weight;
  int birthDate;
  String firstName;
  String lastName;
  String sex;
  String bio;
  EditUserRequestModel(
      {this.displayName,
        this.avatar,
        this.height,
        this.weight,
        this.birthDate,
        this.firstName,
        this.lastName,
        this.sex,
      this.bio});

  EditUserRequestModel.fromJson(Map<String, dynamic> json) {
    displayName = json['displayName'];
    avatar = json['avatar'];
    height = json['height'];
    weight = json['weight'];
    birthDate = json['birthDate'];
    firstName = json['firstName'];
    lastName = json['lastName'];
    sex = json['sex'];
    bio = json['bio'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.displayName != "") {
      data['displayName'] = this.displayName;
    }

      data['avatar'] = this.avatar;

    if (this.height != "") {
      data['height'] = this.height;
    }
    if (this.weight != "") {
      data['weight'] = this.weight;
    }

      data['birthDate'] = this.birthDate;

    if (this.firstName != "") {
      data['firstName'] = this.firstName;
    }
    if (this.lastName != "") {
      data['lastName'] = this.lastName;
    }
    if (this.sex != "") {
      data['sex'] = this.sex;
    }
    if (this.bio != ""){
      data['bio'] = this.bio;
    }
    return data;
  }
}



