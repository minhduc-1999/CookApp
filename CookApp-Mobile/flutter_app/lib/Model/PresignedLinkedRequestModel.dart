class PresignedLinkedRequestModel {
  List<String> fileNames;

  PresignedLinkedRequestModel({this.fileNames});

  PresignedLinkedRequestModel.fromJson(Map<String, dynamic> json) {
    fileNames = json['fileNames'].cast<String>();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['fileNames'] = this.fileNames;
    return data;
  }
}