class CommentRequestModel {
  String targetId;
  String content;
  String replyFor;
  String targetType;
  List<String> images;

  CommentRequestModel(
      {this.targetId,
        this.content,
        this.replyFor,
        this.targetType,
        this.images});

  CommentRequestModel.fromJson(Map<String, dynamic> json) {
    targetId = json['targetId'];
    content = json['content'];
    replyFor = json['replyFor'];
    targetType = json['targetType'];
    images = json['images'].cast<String>();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['targetId'] = this.targetId;
    data['content'] = this.content;
    if (this.replyFor != null && this.replyFor != "") {
      data['replyFor'] = this.replyFor;
    }
    data['targetType'] = this.targetType;
    if (this.images != null && this.images.length > 0) {
      data['images'] = this.images;
    }
    return data;
  }
}
