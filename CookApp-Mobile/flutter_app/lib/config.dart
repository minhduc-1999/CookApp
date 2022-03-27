class Config {
  //string
  static const String appName = "Tastify";
  static const String settings = "Settings";
  static const String food = "Food Instructions";
  static const String chatbot = "Chatbot";
  static const String notifications = "Notifications";
  //url
  //static const String apiURL = "http://192.168.1.11:3000";
  static const String apiURL = "https://tastify-be.herokuapp.com";
  static const String loginAPI = "/api/login";
  static const String loginByGoogleAPI = "/api/google/redirect";
  static const String registerAPI = "/api/register";
  static const String presignedLinkAPI = "/api/storage/uploadSignedUrl";
  static const String uploadPostAPI = "/api/users/posts";
  static const String userProfileAPI = "/api/users/profile";
  static const String preUserWallAPI = "/api/users/";
  static const String followerAPI = "/walls/followers";
  static const String endUserWallFollowAPI = "/walls/followers";
  static const String endUserWallPostAPI = "/walls/posts";
  static const String postDetails = "/api/users/posts/";
  static const String commentAPI = "/api/users/comments";

  static const String reactAPI = "/api/users/reaction";
  static const String userFeedAPI = "/api/users/feeds/posts";
  static const String foodAPI = "/api/foods";
  static const String resendEmailAPI = "/api/resend-email-verification";
  //urlChatbot
  static const String apiURLChatBot = "http://yourchatstarter.xyz";
  static const String sendMessage = "/api/send_message";
  static const String tokenChatbot = "9bdf793944b54a2f49f67113de076366";
  //string
  static const String postCommentsType = "Post";
  static const String stepCommentsType = "RecipeStep";
  static const String postReactType = "POST";
  static const String imageReactType = "MEDIA";

}