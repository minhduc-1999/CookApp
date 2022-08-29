class EditPostRequestModel {
  String content;
  List<String> addImages;
  List<String> deleteImages;

  String location;
  String shouldAdvice;
  String shouldNotAdvice;
  List<String> tags;
  List<String> shouldFoodIds;
  List<String> shouldNotFoodIds;
  EditPostRequestModel(
      {this.content, this.addImages, this.deleteImages, this.location,this.shouldAdvice,this.shouldNotAdvice,this.shouldFoodIds,this.shouldNotFoodIds, this.tags});


  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.content != null && this.content != "") {
      data['content'] = this.content;
    }
    if (this.addImages != null && this.addImages.length > 0) {
      data['addImages'] = this.addImages;
    }
    if (this.deleteImages != null && this.deleteImages.length > 0) {
      data['deleteImages'] = this.deleteImages;
    }

    if (this.location != null && this.location != "") {
      data['location'] = this.location;
    }
    data['tags'] = this.tags;
    if (this.shouldAdvice != null && this.shouldAdvice != ""){
      data['shouldAdvice'] = this.shouldAdvice;
    }
    if (this.shouldNotAdvice != null && this.shouldNotAdvice != ""){
      data['shouldNotAdvice'] = this.shouldNotAdvice;
    }
    if (this.shouldFoodIds != null && this.shouldFoodIds.length > 0){
      data['shouldFoodIds'] = this.shouldFoodIds;
    }

    if (this.shouldNotFoodIds != null && this.shouldNotFoodIds.length > 0){
      data['shouldNotFoodIds'] = this.shouldNotFoodIds;
    }
    return data;
  }
}
