class Config {
  //string
  static const String appName = "Tastify";
  static const String settings = "Settings";
  static const String food = "Food Instructions";
  static const String chatbot = "Chatbot";
  static const String notifications = "Notifications";
  //url

  static const String apiURL = "https://tastify-be.herokuapp.com";
  static const String chatURL = "https://tastify-be.herokuapp.com/chat";
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
  static const String endUserWallAlbumAPI = "/walls/albums";
  static const String postDetails = "/api/users/posts/";
  static const String commentAPI = "/api/users/comments";

  static const String sseAPI = apiURL + "/api/messages/sse";

  static const String reactAPI = "/api/users/reaction";
  static const String userFeedAPI = "/api/users/feeds/posts";
  static const String foodAPI = "/api/foods";
  static const String foodCensoredAPI = "/api/foods/censored";
  static const String foodSaveAPI = "/api/foods/save";
  static const String resendEmailAPI = "/api/resend-email-verification";
  static const String topicsAPI = "/api/topics";
  static const String interestsTopicAPI = "/api/topics/interests";
  static const String interestedTopicAPI = "/api/topics/interested";
  static const String ingredientsAPI = "/api/ingredients";
  static const String unitsAPI = "/api/units";
  static const String statusMessagesAPI = "/api/messages/status";
  static const String conversationsAPI = "/api/conversations";
  static const String savedPostsAPI = "/api/users/posts/save";
  static const String changePasswordAPI = "/api/password/change";
  static const String albumAPI = "/api/users/albums";
  static const String verifyEmailAPI = "/api/email-verification/callback";
  static const String resetPasswordAPI = "/api/password/reset";
  static const String sendMessage = "/api/messages";
  static const String botAPI = "/api/messages/bot";

  //string
  static const String postCommentsType = "POST";
  static const String stepCommentsType = "RECIPE_STEP";
  static const String postReactType = "POST";
  static const String imageReactType = "POST_MEDIA";
  static const String albumReactType = "ALBUM";
  static const String postRecommendType = "RECOMMENDATION";
  static const String postMomentType = "MOMENT";
  static const String postFoodShareType = "FOOD_SHARE";
  static const String textType = "TEXT";
  static const String nutritionistRole = "nutritionist";
  static const String shouldFoodType = "should";
  static const String shouldnotFoodType = "should_not";
  static const String foodUnsaved = "unsaved";
  static const String messageTextType = "TEXT";
  static const String messageImageType = "IMAGE";
}