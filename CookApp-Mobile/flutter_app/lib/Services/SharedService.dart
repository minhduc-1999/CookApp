import 'dart:convert';

import 'package:api_cache_manager/api_cache_manager.dart';
import 'package:api_cache_manager/models/cache_db_model.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_client_sse/flutter_client_sse.dart';
import 'package:flutter_observer/Observable.dart';
import 'package:onesignal_flutter/onesignal_flutter.dart';
import 'package:tastify/Model/LoginRespondModel.dart';
import 'package:tastify/config.dart';
import 'package:tastify/keyAbly.dart';
import 'package:tastify/main.dart';
import 'package:ably_flutter/ably_flutter.dart' as ably;
class SharedService {
  static Future<bool> isLoggedIn() async {
    var isKeyExist = await APICacheManager().isAPICacheKeyExist("login");
    return isKeyExist;
  }
  static Future<LoginRespondModel> loginDetails() async {
    var isKeyExist = await APICacheManager().isAPICacheKeyExist("login");
    if (isKeyExist){
      var cacheData = await APICacheManager().getCacheData("login");
      return loginRespondJson(cacheData.syncData);
    }
  }

  static Future<void> setLoginDetails(LoginRespondModel model) async {
    APICacheDBModel cacheDBModel =  APICacheDBModel(key: "login", syncData: jsonEncode(model.toJson()));
    currentUserId = model.data.userId;
    role = model.data.role;
    await APICacheManager().addCacheData(cacheDBModel);
  }

  static Future<String> getCurrentUserId() async{
    var data = await APICacheManager().getCacheData("userId");
    return data.syncData;
  }

  static Future<void> chatService() async{

    final clientOptions = ably.ClientOptions(key : keyAbly);
    final realtime = ably.Realtime(options: clientOptions);
    realtime.connection
        .on(ably.ConnectionEvent.connected)
        .listen((ably.ConnectionStateChange stateChange) async {
      print('New state is: ${stateChange.current}');
      switch (stateChange.current) {
        case ably.ConnectionState.connected:
        // Successful connection
          print('Connected to Ably!');
          break;
        case ably.ConnectionState.failed:
        // Failed connection
          break;
      }
    });
    final channel = realtime.channels.get('communication');
    channel.subscribe().listen((message) {
      print('Received a greeting message in realtime: ${message.data}');
      Observable.instance.notifyObservers(["_MessageActivityState","HomeActivityState","_ConversationsActivityState"], notifyName: "new_message",map: message.data);
    }
    );

  }


  static Future<void> logout(BuildContext context) async {
    await APICacheManager().deleteCache("login");
    await OneSignal.shared.removeExternalUserId();
    final clientOptions = ably.ClientOptions(key : keyAbly);
    final realtime = ably.Realtime(options: clientOptions);
    realtime.connection.close();
    realtime.connection
        .on(ably.ConnectionEvent.closed)
        .listen((ably.ConnectionStateChange stateChange) async {
      print('New state is: ${stateChange.current}');
      switch (stateChange.current) {
        case ably.ConnectionState.closed:
        // Connection closed
          print('Closed the connection to Ably.');
          break;
        case ably.ConnectionState.failed:
        // Failed to close connection
          break;
      }
    });
    print("ln");
    Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
  }
}