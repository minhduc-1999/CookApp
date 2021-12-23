import 'dart:convert';
class MessageRequestModel {
  String post;
  Context context;
  bool isLocal;

  MessageRequestModel({this.post, this.context, this.isLocal});

  MessageRequestModel.fromJson(Map<String, dynamic> json) {
    post = json['post'];
    context =
    json['context'] != null ? new Context.fromJson(json['context']) : null;
    isLocal = json['is_local'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['post'] = this.post;
    if (this.context != null) {
      data['context'] = this.context.toJson();
    }
    data['is_local'] = this.isLocal;
    return data;
  }
}

class Context {
  List<InformationKey> informationKey;
  List<IntentStack> intentStack;
  List<String> suggestionList;

  Context({this.informationKey, this.intentStack, this.suggestionList});

  Context.fromJson(Map<String, dynamic> json) {
    if (json['information_key'] != null) {
      informationKey = new List<InformationKey>();
      json['information_key'].forEach((v) {
        informationKey.add(new InformationKey.fromJson(v));
      });
    }
    if (json['intent_stack'] != null) {
      intentStack = new List<IntentStack>();
      json['intent_stack'].forEach((v) {
        intentStack.add(new IntentStack.fromJson(v));
      });
    }
    suggestionList = json['suggestion_list'].cast<String>();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.informationKey != null) {
      data['information_key'] =
          this.informationKey.map((v) => v.toJson()).toList();
    }
    if (this.intentStack != null) {
      data['intent_stack'] = this.intentStack.map((v) => v.toJson()).toList();
    }
    data['suggestion_list'] = this.suggestionList;
    return data;
  }
}

class InformationKey {
  String key;
  String value;

  InformationKey({this.key, this.value});

  InformationKey.fromJson(Map<String, dynamic> json) {
    key = json['key'];
    value = json['value'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['key'] = this.key;
    data['value'] = this.value;
    return data;
  }
}

class IntentStack {
  String intent;
  List<String> additionEntities;
  List<dynamic> confirmedEntities;
  List<String> missingEntities;

  IntentStack(
      {this.intent,
        this.additionEntities,
        this.confirmedEntities,
        this.missingEntities});

  IntentStack.fromJson(Map<String, dynamic> map) {
    intent = map['intent'];
    additionEntities = map['addition_entities'].cast<String>();
    if (map['confirmed_entities'] != null) {
      confirmedEntities = map['confirmed_entities'];
    }
    missingEntities = map['missing_entities'].cast<String>();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['intent'] = this.intent;
    data['addition_entities'] = this.additionEntities;
    if (this.confirmedEntities != null) {
      data['confirmed_entities'] = this.confirmedEntities;
    }
    data['missing_entities'] = this.missingEntities;
    return data;
  }
}
