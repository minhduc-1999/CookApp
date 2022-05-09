class RatingFoodRequestModel {
  double star;
  String comment;

  RatingFoodRequestModel({this.star, this.comment});

  RatingFoodRequestModel.fromJson(Map<String, dynamic> json) {
    star = json['star'];
    comment = json['comment'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['star'] = this.star;
    data['comment'] = this.comment;
    return data;
  }
}
