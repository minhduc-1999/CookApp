import 'dart:async';
import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:tastify/Model/AlbumDetailsRespondModel.dart';
import 'package:tastify/Model/AlbumRespondModel.dart';
import 'package:tastify/Model/ChatBotRequestModel.dart';
import 'package:tastify/Model/ChatBotRespondModel.dart';
import 'package:tastify/Model/CommentRequestModel.dart';
import 'package:tastify/Model/CommentRespondModel.dart';
import 'package:tastify/Model/ConversationDetailRespondModel.dart';
import 'package:tastify/Model/ConversationsRespondModel.dart';
import 'package:tastify/Model/CreateAlbumRequestModel.dart';
import 'package:tastify/Model/CreateConversationRequestModel.dart';
import 'package:tastify/Model/CreateFoodRequestModel.dart';
import 'package:tastify/Model/CreateFoodRespondModel.dart';
import 'package:tastify/Model/EditPostRequestModel.dart';
import 'package:tastify/Model/EditProfileRespondModel.dart';
import 'package:tastify/Model/EditUserRequestModel.dart';
import 'package:tastify/Model/FoodDetailsRespondModel.dart';
import 'package:tastify/Model/FoodInstructionRespondModel.dart';
import 'package:tastify/Model/FoodRespondModel.dart';
import 'package:tastify/Model/IngredientsRespondModel.dart';
import 'package:tastify/Model/LoginByGoogleRequestModel.dart';
import 'package:tastify/Model/LoginRequestModel.dart';
import 'package:tastify/Model/LoginRespondModel.dart';
import 'package:tastify/Model/MessageRequestModel.dart';
import 'package:tastify/Model/MessageRespondModel.dart';

import 'package:tastify/Model/NewFeedRespondModel.dart';
import 'package:tastify/Model/PostDetailRespondModel.dart';

import 'package:tastify/Model/PostRequestModel.dart';
import 'package:tastify/Model/PresignedLinkedRequestModel.dart';
import 'package:tastify/Model/PresignedLinkedRespondModel.dart';
import 'package:tastify/Model/PresignedLinkedRespondModel.dart';
import 'package:tastify/Model/PresignedLinkedRespondModel.dart';
import 'package:tastify/Model/RatingFoodRequestModel.dart';
import 'package:tastify/Model/ReactRequestModel.dart';
import 'package:tastify/Model/RegisterRequestModel.dart';
import 'package:tastify/Model/RegisterRespondModel.dart';
import 'package:tastify/Model/ResendEmailRequestModel.dart';
import 'package:tastify/Model/SavedPostRespondModel.dart';
import 'package:tastify/Model/TotalNewMessageRespondModel.dart';
import 'package:tastify/Model/UnitsRespondModel.dart';
import 'package:tastify/Model/UserRespondModel.dart';
import 'package:tastify/Model/UserVoteRespondModel.dart';
import 'package:tastify/Model/UserWallRespondModel.dart';
import 'package:tastify/Model/VotesRespondModel.dart';
import 'package:tastify/Model/WallPostRespondModel.dart';
import '../MultiImagesDetailScreen/MultiImagesDetailActivity.dart';
import 'package:tastify/NewFeedScreen/UserDelegateModel.dart';

import 'package:tastify/config.dart';
import 'package:http/http.dart' as http;

import 'SharedService.dart';

class APIService {
  static var client = http.Client();

  static Future<LoginRespondModel> login(LoginRequestModel model) async {
    Map<String, String> requestHeader = {'Content-Type': 'application/json'};
    var url = Uri.parse(Config.apiURL + Config.loginAPI);
    var respone = await client.post(url,
        headers: <String, String>{
          'Content-Type': 'application/json',
        },
        body: jsonEncode(model.toJson()));
    /*  if (respone.statusCode == 200) {
      await SharedService.setLoginDetails(loginRespondJson(respone.body));
      return true;
    } else {
      return false;
    }*/
    return loginRespondJson(respone.body);
  }

  static Future<bool> loginByGoogle(LoginByGoogleRequestModel model) async {
    var url = Uri.parse(Config.apiURL + Config.loginByGoogleAPI);
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
    print('ln');
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

  static Future<WallPostRespondModel> getUserWallPosts(String userId, int offset) async {
    var url = Uri.parse(Config.apiURL +
            Config.preUserWallAPI +
            userId +
            Config.endUserWallPostAPI)
        .replace(
            queryParameters: <String, String>{'offset': offset.toString(), 'limit': '48', 'kind' : 'MOMENT'});
    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.get(url, headers: <String, String>{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${loginDetails.data.accessToken}',
    });
    return wallPostRespondModel(respone.body);
  }
  static Future<AlbumRespondModel> getAlbum(String userId,int offset) async {
    var url = Uri.parse(Config.apiURL +
        Config.preUserWallAPI +
        userId +
        Config.endUserWallAlbumAPI)
        .replace(
        queryParameters: <String, String>{'offset': offset.toString(), 'limit': '40'});
    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.get(url, headers: <String, String>{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${loginDetails.data.accessToken}',
    });
    return albumRespondModel(respone.body);
  }
  static Future<AlbumDetailsRespondModel> getAlbumDetails(String albumId) async {
    var url = Uri.parse(Config.apiURL +
        Config.albumAPI +
        "/" +
    albumId)
        .replace(
        queryParameters: <String, String>{'offset': '0', 'limit': '40'});
    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.get(url, headers: <String, String>{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${loginDetails.data.accessToken}',
    });
    return albumDetailsRespondModel(respone.body);
  }


  static Future<NewFeedRespondModel> getNewFeed(int offset) async {
    var url = Uri.parse(Config.apiURL + Config.userFeedAPI).replace(
        queryParameters: <String, String>{
          'offset': offset.toString(),
          'limit': '10'
        });
    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.get(url, headers: <String, String>{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${loginDetails.data.accessToken}',
    });
    return newFeedRespondModel(respone.body);
  }

  static Future<bool> react(ReactRequestModel model) async {
    var url = Uri.parse(Config.apiURL + Config.reactAPI);
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

  static Future<bool> comment(CommentRequestModel model) async {
    var url =
        Uri.parse(Config.apiURL + Config.commentAPI);
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
      String targetId, String targetType, String replyOf) async {
    var url =
        Uri.parse(Config.apiURL + Config.commentAPI);
    if (replyOf != "" && replyOf != null) {
      url = url.replace(queryParameters: <String, String>{
        'offset': '0',
        'limit': '50',
        'targetId': targetId,
        'targetType': targetType,
        'replyOf': replyOf
      });
    } else{
      url = url.replace(queryParameters: <String, String>{
        'offset': '0',
        'limit': '50',
        'targetId': targetId,
        'targetType': targetType,
      });
    }

    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.get(url, headers: <String, String>{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${loginDetails.data.accessToken}',
    });


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

  static Future<EditProfileRespondModel> editProfile(EditUserRequestModel model) async {
    var url = Uri.parse(Config.apiURL + Config.userProfileAPI);
    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.patch(url,
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${loginDetails.data.accessToken}',
        },
        body: jsonEncode(model.toJson()));
    return editProfileRespondJson(respone.body);
  }

  static Future<bool> editPost(EditPostRequestModel model, String postId) async {
    var url = Uri.parse(Config.apiURL + Config.uploadPostAPI + "/" + postId);
    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.patch(url,
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${loginDetails.data.accessToken}',
        },
        body: jsonEncode(model.toJson()));
    return respone.statusCode == 200;
  }
  static Future<FoodInstructionRespondModel> getFoodInstruction(String id) async {
    var url = Uri.parse(Config.apiURL + Config.foodAPI + "/" + id);

    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.get(url, headers: <String, String>{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${loginDetails.data.accessToken}',
    });
    return foodInstructionRespondModel(respone.body);
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
  static Future<FoodDetailsRespondModel> getFoodById(String foodId) async {
    var url = Uri.parse(Config.apiURL + Config.foodAPI + "/" +foodId);

    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.get(url, headers: <String, String>{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${loginDetails.data.accessToken}',
    });
    return foodDetailsRespondModel(respone.body);
  }

  static Future<UserDelegateModel> getUserByQuery(
      int offset, String query) async {
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

  static Future<MessageRespondModel> sendMessage(
      MessageRequestModel model) async {
    var url = Uri.parse(Config.apiURL + Config.sendMessage);
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.post(url,
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${loginDetails.data.accessToken}',
        },
        body: jsonEncode(model.toJson()));
    return messageRespondModel(respone.body);
  }

  static Future<bool> resendEmail(
      ResendEmailRequestModel model, String token) async {
    var url = Uri.parse(Config.apiURL + Config.resendEmailAPI);
    print("url: " + url.toString());
    var respone = await client.post(url,
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${token}',
        },
        body: jsonEncode(model.toJson()));

    if (respone.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }

  static Future<PostDetailRespondModel> getPostDetail(String postId) async {
    var url = Uri.parse(Config.apiURL + Config.uploadPostAPI + "/" + postId + "/detail");
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.get(url, headers: <String, String>{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${loginDetails.data.accessToken}',
    });
    return postDetailRespondModel(respone.body);
  }

  static Future<bool> savePost(String postId) async {
    var url = Uri.parse(Config.apiURL + Config.uploadPostAPI + "/" + postId + "/save");
    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.post(url,
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${loginDetails.data.accessToken}',
        },
        );
    return respone.statusCode == 200;
  }
  static Future<bool> deleteSavedPost(String postId) async {
    var url = Uri.parse(Config.apiURL + Config.uploadPostAPI + "/" + postId + "/save");
    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.delete(url,
      headers: <String, String>{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${loginDetails.data.accessToken}',
      },
    );
    return respone.statusCode == 200;
  }

  static Future<SavedPostRespondModel> getSavedPosts() async {
    var url = Uri.parse(Config.apiURL + Config.savedPostsAPI).replace(
        queryParameters: <String, String>{
          'offset': '0',
          'limit': '30',

        });
    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.get(url, headers: <String, String>{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${loginDetails.data.accessToken}',
    });
    return savedPostRespondModel(respone.body);
  }

  static Future<TotalNewMessageRespondModel> getTotalNewMessage() async {
    var url = Uri.parse(Config.apiURL + Config.statusMessagesAPI);
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.get(url, headers: <String, String>{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${loginDetails.data.accessToken}',
    });
    return totalNewMessageRespondModel(respone.body);
  }
  static Future<ConversationsRespondModel> getConversations() async {
    var url = Uri.parse(Config.apiURL + Config.conversationsAPI);
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.get(url, headers: <String, String>{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${loginDetails.data.accessToken}',
    });
    return conversationsRespondModel(respone.body);
  }
  static Future<ConversationDetailRespondModel> getConversationsById(String conversationId) async {
    var url = Uri.parse(Config.apiURL + Config.conversationsAPI + "/" + conversationId);
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.get(url, headers: <String, String>{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${loginDetails.data.accessToken}',
    });
    return conversationDetailRespondModel(respone.body);
  }
  static Future<MessageRespondModel> getMessages(String conversationId) async {
    var url = Uri.parse(Config.apiURL + Config.conversationsAPI + "/" +conversationId + "/messages").replace(
        queryParameters: <String, String>{
          'offset': '0',
          'limit': '50',

        });
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.get(url,
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${loginDetails.data.accessToken}',
        },);
    return messageRespondModel(respone.body);
  }
  static Future<bool> seen(String conversationId, messageId) async {
    var url = Uri.parse(
        Config.apiURL + Config.conversationsAPI + "/" + conversationId + "/messages/" + messageId + "/seen");
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
  static Future<bool> createConversation(CreateConversationRequestModel model) async {
    var url = Uri.parse(
        Config.apiURL + Config.conversationsAPI);
    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.post(
      url,
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
  static Future<bool> createAlbum(CreateAlbumRequestModel model) async {
    var url = Uri.parse(
        Config.apiURL + Config.albumAPI);
    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.post(
        url,
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
  static Future<IngredientsRespondModel> getIngredients(int offset) async {
    var url = Uri.parse(Config.apiURL +
        Config.ingredientsAPI)
        .replace(
        queryParameters: <String, String>{'offset': '0', 'limit': '40'});
    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.get(url, headers: <String, String>{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${loginDetails.data.accessToken}',
    });
    return ingredientsRespondModel(respone.body);
  }
  static Future<UnitsRespondModel> getUnits(int offset) async {
    var url = Uri.parse(Config.apiURL +
        Config.unitsAPI)
        .replace(
        queryParameters: <String, String>{'offset': '0', 'limit': '40'});
    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.get(url, headers: <String, String>{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${loginDetails.data.accessToken}',
    });
    return unitsRespondModel(respone.body);
  }
  static Future<CreateFoodRespondModel> createFood(CreateFoodRequestModel model) async {
    var url = Uri.parse(Config.apiURL + Config.foodAPI);
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.post(url,
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${loginDetails.data.accessToken}',
        },
        body: jsonEncode(model.toJson()));


    return createFoodRespondModel(respone.body);

  }
  static Future<VotesRespondModel> getVotes(String foodId) async {
    var url = Uri.parse(Config.apiURL +
        Config.foodAPI + "/" + foodId + "/votes")
        .replace(
        queryParameters: <String, String>{'offset': '0', 'limit': '40'});
    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.get(url, headers: <String, String>{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${loginDetails.data.accessToken}',
    });
    return votesRespondModel(respone.body);
  }
  static Future<UserVoteRespondModel> getUserVote(String foodId) async {
    var url = Uri.parse(Config.apiURL +
        Config.foodAPI + "/" + foodId + "/vote")
        .replace(
        queryParameters: <String, String>{'offset': '0', 'limit': '40'});
    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.get(url, headers: <String, String>{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${loginDetails.data.accessToken}',
    });
    return userVoteRespondModel(respone.body);
  }
  static Future<bool> ratingFood(String foodId, RatingFoodRequestModel model) async {
    var url = Uri.parse(
        Config.apiURL + Config.foodAPI + "/" + foodId + "/ratings");
    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.post(
        url,
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
  static Future<bool> editRatingFood(String foodId, RatingFoodRequestModel model) async {
    var url = Uri.parse(
        Config.apiURL + Config.foodAPI + "/" + foodId + "/ratings");
    print("url: " + url.toString());
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.patch(
        url,
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

  static Future<ChatBotRespondModel> chatWithBot(ChatBotRequestModel model) async {
    var url = Uri.parse(Config.apiURL + Config.botAPI);
    var loginDetails = await SharedService.loginDetails();
    var respone = await client.post(url,
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${loginDetails.data.accessToken}',
        },
        body: jsonEncode(model.toJson()));
    var data = chatBotRespondModel(respone.body);
    print('ln');
    return chatBotRespondModel(respone.body);

  }
}
