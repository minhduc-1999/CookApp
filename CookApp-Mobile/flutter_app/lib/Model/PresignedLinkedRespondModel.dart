import 'dart:convert';
PresignedLinkedRespondModel presignedLinkedRespondModel(String str) =>
    PresignedLinkedRespondModel.fromJson(json.decode(str));
class PresignedLinkedRespondModel {
  Meta meta;
  Data data;

  PresignedLinkedRespondModel({this.meta, this.data});

  PresignedLinkedRespondModel.fromJson(Map<String, dynamic> json) {
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
  List<Items> items;

  Data({this.items});

  Data.fromJson(Map<String, dynamic> json) {
    if (json['items'] != null) {
      items = new List<Items>();
      json['items'].forEach((v) {
        items.add(new Items.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.items != null) {
      data['items'] = this.items.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Items {
  String objectName;
  String signedLink;

  Items({this.objectName, this.signedLink});

  Items.fromJson(Map<String, dynamic> json) {
    objectName = json['objectName'];
    signedLink = json['signedLink'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['objectName'] = this.objectName;
    data['signedLink'] = this.signedLink;
    return data;
  }
}
