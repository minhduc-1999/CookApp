class CommentRequestModel {
  String targetKeyOrID;
  String content;
  String replyFor;
  String targetType;

  CommentRequestModel(
      {this.targetKeyOrID, this.content, this.replyFor, this.targetType});

  CommentRequestModel.fromJson(Map<String, dynamic> json) {
    targetKeyOrID = json['targetKeyOrID'];
    content = json['content'];
    replyFor = json['replyFor'];
    targetType = json['targetType'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['targetKeyOrID'] = this.targetKeyOrID;
    data['content'] = this.content;
    if(this.replyFor != "") {
      data['replyFor'] = this.replyFor;
    }
    data['targetType'] = this.targetType;
    return data;
  }
}
