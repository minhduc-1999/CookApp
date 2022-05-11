import 'MessageRequestModel.dart';

class Message{
  String content;
  String avatar;
  DateTime createdAt;
  bool isUser;
  Message({this.content,this.avatar,this.createdAt,this.isUser});
}
