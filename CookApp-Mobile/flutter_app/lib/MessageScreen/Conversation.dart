import 'package:tastify/Model/ConversationsRespondModel.dart';

class Conversation{
  String id;
  String name;
  String type;
  String cover;
  LastMessage lastMessage;
  bool readAll;
  Conversation({this.id,this.name,this.type,this.cover,this.lastMessage,this.readAll});
}
