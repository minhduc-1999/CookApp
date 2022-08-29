class InterestTopicRequestModel {
  List<String> topicIds;

  InterestTopicRequestModel({this.topicIds});

  InterestTopicRequestModel.fromJson(Map<String, dynamic> json) {
    topicIds = json['topicIds'].cast<String>();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['topicIds'] = this.topicIds;
    return data;
  }
}
