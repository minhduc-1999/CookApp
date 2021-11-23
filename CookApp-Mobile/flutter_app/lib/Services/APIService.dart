import 'dart:async';
import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter_app/Model/LoginRequestModel.dart';
import 'package:flutter_app/Model/LoginRespondModel.dart';
import 'package:flutter_app/Model/PostRequestModel.dart';
import 'package:flutter_app/Model/PresignedLinkedRequestModel.dart';
import 'package:flutter_app/Model/PresignedLinkedRespondModel.dart';
import 'package:flutter_app/Model/PresignedLinkedRespondModel.dart';
import 'package:flutter_app/Model/PresignedLinkedRespondModel.dart';
import 'package:flutter_app/Model/RegisterRequestModel.dart';
import 'package:flutter_app/Model/RegisterRespondModel.dart';

import 'package:flutter_app/config.dart';
import 'package:http/http.dart' as http;

import 'SharedService.dart';

class APIService {
  static var client = http.Client();

  static Future<bool> login(LoginRequestModel model) async {
    Map<String, String> requestHeader = {'Content-Type': 'application/json'};
    var url = Uri.parse(Config.apiURL + Config.loginAPI);
    var respone = await client.post(url,
        headers: <String, String>{
          'Content-Type': 'application/json',
        },
        body: jsonEncode(model.toJson()));
    if (respone.statusCode == 200) {
      await SharedService.setLoginDetails(loginRespondJson(respone.body));
      return true;
    } else {
      return false;
    }
  }

  static Future<bool> register(
      RegisterRequestModel model) async {
    Map<String, String> requestHeader = {'Content-Type': 'application/json'};
    var url = Uri.parse(Config.apiURL + Config.registerAPI);
    var respone = await client.post(url,
        headers: <String, String>{
          'Content-Type': 'application/json',
        },
        body: jsonEncode(model.toJson()));
    if(respone.body != null){
      return true;
    }
    return false;
    //return registerRespondModel(respone.body);
  }
  static Future<PresignedLinkedRespondModel> getPresignedLink(PresignedLinkedRequestModel model) async{
    var url = Uri.parse(Config.apiURL + Config.presignedLinkAPI);
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.post(url,
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${loginDetails.data.accessToken}',
        },
        body: jsonEncode(model.toJson()));
    return presignedLinkedRespondModel(respone.body);
  }



  static Future<bool> uploadImage(
      File file, String link) async {
    var url = Uri.parse(link);
    var respone = await client.put(url,
        headers: <String, String>{
          'Content-Type': 'image/png',
        },
        body: await file.readAsBytes());
    return true;
    //return registerRespondModel(respone.body);
  }

  static Future<bool> uploadPost(PostRequestModel model) async {
    var url = Uri.parse(Config.apiURL + Config.uploadPostAPI);
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.post(url,
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${loginDetails.data.accessToken}',
        },
        body: jsonEncode(model.toJson()));
    return true;
  }
}
