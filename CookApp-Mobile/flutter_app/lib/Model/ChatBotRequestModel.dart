class ChatBotRequestModel {
  String botSessionID;
  String message;
  String type;

  ChatBotRequestModel({this.botSessionID, this.message, this.type});
  
  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.botSessionID != "" && this.botSessionID != null) {
      data['botSessionID'] = this.botSessionID;
    }
    data['message'] = this.message;
    data['type'] = this.type;
    return data;
  }
}
