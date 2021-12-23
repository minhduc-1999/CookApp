import 'dart:async';
import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter_app/Model/CommentRequestModel.dart';
import 'package:flutter_app/Model/CommentRespondModel.dart';
import 'package:flutter_app/Model/EditUserRequestModel.dart';
import 'package:flutter_app/Model/FoodRespondModel.dart';
import 'package:flutter_app/Model/LoginRequestModel.dart';
import 'package:flutter_app/Model/LoginRespondModel.dart';
import 'package:flutter_app/Model/MessageRequestModel.dart';
import 'package:flutter_app/Model/MessageRespondModel.dart';
import 'package:flutter_app/Model/NewFeedRespondModel.dart';
import 'package:flutter_app/Model/PostDetailsRespondModel.dart';
import 'package:flutter_app/Model/PostRequestModel.dart';
import 'package:flutter_app/Model/PresignedLinkedRequestModel.dart';
import 'package:flutter_app/Model/PresignedLinkedRespondModel.dart';
import 'package:flutter_app/Model/PresignedLinkedRespondModel.dart';
import 'package:flutter_app/Model/PresignedLinkedRespondModel.dart';
import 'package:flutter_app/Model/ReactRequestModel.dart';
import 'package:flutter_app/Model/RegisterRequestModel.dart';
import 'package:flutter_app/Model/RegisterRespondModel.dart';
import 'package:flutter_app/Model/UserRespondModel.dart';
import 'package:flutter_app/Model/UserWallRespondModel.dart';
import 'package:flutter_app/Model/WallPostRespondModel.dart';
import 'package:flutter_app/NewFeedScreen/UserDelegateModel.dart';

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

  static Future<RegisterRespondModel> register(
      RegisterRequestModel model) async {
    Map<String, String> requestHeader = {'Content-Type': 'application/json'};
    var url = Uri.parse(Config.apiURL + Config.registerAPI);
    var respone = await client.post(url,
        headers: <String, String>{
          'Content-Type': 'application/json',
        },
        body: jsonEncode(model.toJson()));
    return registerRespondModel(respone.body);
  }

  static Future<PresignedLinkedRespondModel> getPresignedLink(
      PresignedLinkedRequestModel model) async {
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

  static Future<bool> uploadImage(File file, String link) async {
    var url = Uri.parse(link);
    var ex = file.path.split(".");
    Map<String, String> requestHeader = {'Content-Type': 'image/jpeg'};
    if (ex.last == "png") {
      requestHeader = {'Content-Type': 'image/png'};
    } else if (ex.last == "jpg" || ex.last == 'jpeg') {
      requestHeader = {'Content-Type': 'image/jpeg'};
    }
    var respone = await client.put(url,
        headers: requestHeader, body: await file.readAsBytes());
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

  static Future<UserWallRespondModel> getUserWall(String userId) async {
    var url =
        Uri.parse(Config.apiURL + Config.preUserWallAPI + userId + "/walls");
    var loginDetails = await SharedService.loginDetails();
    print("url: " + url.toString());
    var respone = await client.get(url, headers: <String, String>{
      'Authorization': 'Bearer ${loginDetails.data.accessToken}',
    });
    return userWallRespondModel(respone.body);
  }

  static Future<UserRespondModel> getUser() async {
    var url = Uri.parse(Config.apiURL + Config.userProfileAPI);
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.get(url, headers: <String, String>{
      'Authorization': 'Bearer ${loginDetails.data.accessToken}',
    });
    return userRespondModel(respone.body);
  }

  static Future<WallPostRespondModel> getUserWallPosts(String userId) async {
    var url = Uri.parse(Config.apiURL +
            Config.preUserWallAPI +
            userId +
            Config.endUserWallPostAPI)
        .replace(
            queryParameters: <String, String>{'offset': '0', 'limit': '40'});
    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.get(url, headers: <String, String>{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${loginDetails.data.accessToken}',
    });
    return wallPostRespondModel(respone.body);
  }

  static Future<PostDetailsRespondModel> getDetailsPost(String postID) async {
    var url = Uri.parse(Config.apiURL + Config.postDetails + postID);
    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.get(url, headers: <String, String>{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${loginDetails.data.accessToken}',
    });
    return postDetailsRespondModel(respone.body);
  }

  static Future<NewFeedRespondModel> getNewFeed(int offset) async {
    var url = Uri.parse(Config.apiURL + Config.userFeedAPI).replace(
        queryParameters: <String, String>{'offset': offset.toString(), 'limit': '10'});
    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.get(url, headers: <String, String>{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${loginDetails.data.accessToken}',
    });
    return newFeedRespondModel(respone.body);
  }

  static Future<bool> react(String postID, ReactRequestModel model) async {
    var url = Uri.parse(Config.apiURL + Config.postDetails + postID + "/react");
    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.post(url,
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${loginDetails.data.accessToken}',
        },
        body: jsonEncode(model.toJson()));
    if (respone.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }

  static Future<bool> comment(String postID, CommentRequestModel model) async {
    var url =
        Uri.parse(Config.apiURL + Config.postDetails + postID + "/comments");
    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.post(url,
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${loginDetails.data.accessToken}',
        },
        body: jsonEncode(model.toJson()));
    if (respone.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }

  static Future<CommentRespondModel> getComment(
      String postID, String parentID) async {
    var url =
        Uri.parse(Config.apiURL + Config.postDetails + postID + "/comments");
    if (parentID != "") {
      url = url.replace(queryParameters: <String, String>{
        'offset': '0',
        'limit': '10',
        'parent': parentID
      });
    } else if (parentID == "" || parentID == null) {
      url = url.replace(
          queryParameters: <String, String>{'offset': '0', 'limit': '10'});
    }

    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.get(url, headers: <String, String>{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${loginDetails.data.accessToken}',
    });
    print("code: " + respone.body);
    var respondModel = commentRespondModel(respone.body);
    print("respond: " + respondModel.data.comments.length.toString());
    return commentRespondModel(respone.body);
  }

  static Future<bool> follow(String userId) async {
    var url = Uri.parse(
        Config.apiURL + Config.preUserWallAPI + userId + Config.followerAPI);
    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.post(
      url,
      headers: <String, String>{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${loginDetails.data.accessToken}',
      },
    );
    if (respone.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }

  static Future<bool> unfollow(String userId) async {
    var url = Uri.parse(
        Config.apiURL + Config.preUserWallAPI + userId + Config.followerAPI);
    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.delete(
      url,
      headers: <String, String>{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${loginDetails.data.accessToken}',
      },
    );
    if (respone.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }

  static Future<bool> editProfile(EditUserRequestModel model) async {
    var url = Uri.parse(Config.apiURL + Config.userProfileAPI);
    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.patch(url,
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${loginDetails.data.accessToken}',
        },
        body: jsonEncode(model.toJson()));
    if (respone.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }

  static Future<FoodRespondModel> getFood(int offset) async {
    var url = Uri.parse(Config.apiURL + Config.foodAPI)
        .replace(queryParameters: <String, String>{
      'offset': offset.toString(),
      'limit': '10',
    });

    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.get(url, headers: <String, String>{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${loginDetails.data.accessToken}',
    });
    return foodRespondModel(respone.body);
  }

  static Future<FoodRespondModel> getFoodByQuery(
      int offset, String query) async {
    var url = Uri.parse(Config.apiURL + Config.foodAPI).replace(
        queryParameters: <String, String>{
          'offset': offset.toString(),
          'limit': '10',
          'q': query
        });
    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.get(url, headers: <String, String>{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${loginDetails.data.accessToken}',
    });
    return foodRespondModel(respone.body);
  }

  static Future<UserDelegateModel> getUserByQuery(int offset, String query) async {
    var url = Uri.parse(Config.apiURL + Config.preUserWallAPI).replace(
        queryParameters: <String, String>{
          'offset': offset.toString(),
          'limit': '10',
          'q': query
        });
    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.get(url, headers: <String, String>{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${loginDetails.data.accessToken}',
    });
    return userDelegateModel(respone.body);
  }

  static Future<MessageRespondModel> sendMessage(MessageRequestModel model) async {
    var url = Uri.parse(Config.apiURLChatBot + Config.sendMessage);
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.post(url,
        headers: <String, String>{
          'Content-Type': 'application/json',
          'x-access-token': Config.tokenChatbot,
        },
        body: jsonEncode(model.toJson()));
    return messageRespondModel(respone.body);
  }
}
