class EditPostRequestModel {
  String content;
  List<String> addImages;
  List<String> deleteImages;
  String name;

  EditPostRequestModel(
      {this.content, this.addImages, this.deleteImages, this.name});

  EditPostRequestModel.fromJson(Map<String, dynamic> json) {
    content = json['content'];
    addImages = json['addImages'].cast<String>();
    deleteImages = json['deleteImages'].cast<String>();
    name = json['name'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['content'] = this.content;
    data['addImages'] = this.addImages;
    data['deleteImages'] = this.deleteImages;
    data['name'] = this.name;
    return data;
  }
}
