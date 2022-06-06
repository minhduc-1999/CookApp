import 'dart:convert';



InterestTopicRespondModel interestTopicRespondModel(String str) =>
    InterestTopicRespondModel.fromJson(json.decode(str));
class InterestTopicRespondModel {
  Meta meta;
  Data data;

  InterestTopicRespondModel({this.meta, this.data});

  InterestTopicRespondModel.fromJson(Map<String, dynamic> json) {
    meta = json['meta'] != null ? new Meta.fromJson(json['meta']) : null;
    data = json['data'] != null ? new Data.fromJson(json['data']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.meta != null) {
      data['meta'] = this.meta.toJson();
    }
    if (this.data != null) {
      data['data'] = this.data.toJson();
    }
    return data;
  }
}

class Meta {
  List<String> messages;
  bool ok;

  Meta({this.messages, this.ok});

  Meta.fromJson(Map<String, dynamic> json) {
    messages = json['messages'].cast<String>();
    ok = json['ok'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['messages'] = this.messages;
    data['ok'] = this.ok;
    return data;
  }
}

class Data {
  List<String> wrongTopicIds;

  Data({this.wrongTopicIds});

  Data.fromJson(Map<String, dynamic> json) {
    wrongTopicIds = json['wrongTopicIds'].cast<String>();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['wrongTopicIds'] = this.wrongTopicIds;
    return data;
  }
}
