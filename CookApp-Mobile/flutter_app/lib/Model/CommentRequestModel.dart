class CommentRequestModel {
  String content;
  String parentId;

  CommentRequestModel({this.content, this.parentId});

  CommentRequestModel.fromJson(Map<String, dynamic> json) {
    content = json['content'];
    parentId = json['parentId'] != null ? json['parentId'] : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['content'] = this.content;
    if (parentId != ""){
      data['parentId'] = this.parentId;
    }
    return data;
  }
}
