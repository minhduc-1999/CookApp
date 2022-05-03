class CreateAlbumRequestModel {
  String name;
  String description;
  List<String> images;
  List<String> videos;

  CreateAlbumRequestModel(
      {this.name, this.description, this.images, this.videos});

  CreateAlbumRequestModel.fromJson(Map<String, dynamic> json) {
    name = json['name'];
    description = json['description'];
    images = json['images'].cast<String>();
    videos = json['videos'].cast<String>();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['name'] = this.name;
    data['description'] = this.description;
    data['images'] = this.images;
    data['videos'] = this.videos;
    return data;
  }
}
