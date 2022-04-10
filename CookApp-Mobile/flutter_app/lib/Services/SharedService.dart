import 'dart:convert';

import 'package:api_cache_manager/api_cache_manager.dart';
import 'package:api_cache_manager/models/cache_db_model.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_client_sse/flutter_client_sse.dart';
import 'package:onesignal_flutter/onesignal_flutter.dart';
import 'package:tastify/Model/LoginRespondModel.dart';
import 'package:tastify/config.dart';
import 'package:tastify/main.dart';

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
    await APICacheManager().addCacheData(cacheDBModel);
  }

  static Future<String> getCurrentUserId() async{
    var data = await APICacheManager().getCacheData("userId");
    return data.syncData;
  }

  static Future<void> chatSSEService() async{
    var loginDetails = await SharedService.loginDetails();
    sseModel = SSEClient.subscribeToSSE(url: Config.sseAPI,
        header: {
          "Accept": "text/event-stream",
          'Authorization': 'Bearer ${loginDetails.data.accessToken}',
        });

  }


  static Future<void> logout(BuildContext context) async {
    await APICacheManager().deleteCache("login");
    await OneSignal.shared.removeExternalUserId();
    Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
  }
}