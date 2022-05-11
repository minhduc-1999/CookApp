class CreateConversationRequestModel {
  List<String> members;
  String type;

  CreateConversationRequestModel({this.members, this.type});

  CreateConversationRequestModel.fromJson(Map<String, dynamic> json) {
    members = json['members'].cast<String>();
    type = json['type'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['members'] = this.members;
    data['type'] = this.type;
    return data;
  }
}
