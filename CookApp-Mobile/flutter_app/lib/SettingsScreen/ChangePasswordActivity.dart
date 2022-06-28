import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:snippet_coder_utils/FormHelper.dart';
import 'package:snippet_coder_utils/ProgressHUD.dart';
import 'package:tastify/Model/ChangePasswordRequestModel.dart';
import 'package:tastify/Services/APIService.dart';
import 'package:tastify/constants.dart';
class ChangePasswordActivity extends StatefulWidget {
  @override
  _ChangePasswordActivityState createState() => _ChangePasswordActivityState();
}

class _ChangePasswordActivityState extends State<ChangePasswordActivity> {
  bool isAPIcallProcess = false;
  GlobalKey<FormState> globalFormKey = GlobalKey<FormState>();
  String currentPassword;
  String newPassword;
  String retypeNewPassword;
  bool hideCurrentPassword = true;
  bool hideNewPassword = true;
  bool hideRetypeNewPassword = true;
  FToast fToast;
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    fToast = FToast();
    fToast.init(context);
  }
  _showToast(String content, Size size) {
    Widget toast = Container(
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(25.0),
        color: customYellowColor,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(
            width: size.width * 0.73,
            child: Text(content,
                textAlign: TextAlign.center,
                maxLines: 100,
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.white,
                )),
          ),
        ],
      ),
    );

    fToast.showToast(
      child: toast,
      gravity: ToastGravity.BOTTOM,
      toastDuration: Duration(seconds: 3),
    );
  }
  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;
    return Scaffold(
      appBar: AppBar(

        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        title: Text(
          "Change Password",

        ),
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: <Color>[appPrimaryColor, appPrimaryColor],
            ),
          ),
        ),

      ),
      body: ProgressHUD(
        child: Form(
          key: globalFormKey,
          child: _changePasswordUI(context, size),
        ),
        inAsyncCall: isAPIcallProcess,
        key: UniqueKey(),
        opacity: 0.1,
      ),
    );
  }
  Widget _changePasswordUI(BuildContext context, Size size){
    return SingleChildScrollView(
      child: Column(
        children: [
          SizedBox(
            height: size.height * 0.02,
          ),
          FormHelper.inputFieldWidget(
              context, "currentPassword", "Current Password",
                  (onValidateVal) {
                if (onValidateVal.isEmpty) {
                  return "Current password can\'t be empty";
                }
                return null;
              }, (onSavedVal) {
            currentPassword = onSavedVal;
          },
              showPrefixIcon: true,
              prefixIcon: const Icon(Icons.security_outlined),
              prefixIconColor: appPrimaryColor,
              borderRadius: 10,
              textColor: Colors.black,
              hintColor: Colors.black.withOpacity(0.5),
              borderFocusColor: appPrimaryColor,
              obscureText: hideCurrentPassword,
              suffixIcon: IconButton(
                onPressed: () {
                  setState(() {
                    hideCurrentPassword = !hideCurrentPassword;
                  });
                },
                icon: Icon(
                  hideCurrentPassword ? Icons.visibility_off : Icons.visibility,
                  color: appPrimaryColor,
                ),
              )

          ),

          SizedBox(
            height: size.height * 0.015,
          ),
          FormHelper.inputFieldWidget(
              context, "newPassword", "New password",
                  (onValidateVal) {
                    newPassword = onValidateVal;
                if (onValidateVal.isEmpty) {
                  return "New password can\'t be empty";
                }
                if (onValidateVal.length < 8){
                  return "New password must have at least 8 characters";
                }
                return null;
              }, (onSavedVal) {
            newPassword = onSavedVal;
          },
              showPrefixIcon: true,
              prefixIcon: const Icon(Icons.vpn_key_rounded),
              prefixIconColor: appPrimaryColor,
              borderRadius: 10,
              textColor: Colors.black,
              hintColor: Colors.black.withOpacity(0.5),
              borderFocusColor: appPrimaryColor,
              obscureText: hideNewPassword,
              suffixIcon: IconButton(
                onPressed: () {
                  setState(() {
                    hideNewPassword = !hideNewPassword;
                  });
                },
                icon: Icon(
                  hideNewPassword ? Icons.visibility_off : Icons.visibility,
                  color: appPrimaryColor,
                ),
              )),
          SizedBox(
            height: size.height * 0.015,
          ),
          FormHelper.inputFieldWidget(
              context, "retypeNewPassword", "Re-type new password",
                  (onValidateVal) {
                if (onValidateVal.isEmpty) {
                  return "Re-type new password can\'t be empty";
                }
                if (onValidateVal != newPassword){
                  return "You must enter the same with new password";
                }
                return null;
              }, (onSavedVal) {
            retypeNewPassword = onSavedVal;
          },
              showPrefixIcon: true,
              prefixIcon: const Icon(Icons.vpn_key_rounded),
              prefixIconColor: appPrimaryColor,
              borderRadius: 10,
              textColor: Colors.black,
              hintColor: Colors.black.withOpacity(0.5),
              borderFocusColor: appPrimaryColor,
              obscureText: hideRetypeNewPassword,
              suffixIcon: IconButton(
                onPressed: () {
                  setState(() {
                    hideRetypeNewPassword = !hideRetypeNewPassword;
                  });
                },
                icon: Icon(
                  hideRetypeNewPassword ? Icons.visibility_off : Icons.visibility,
                  color: appPrimaryColor,
                ),
              )),
          SizedBox(
            height: size.height * 0.015,
          ),
          GestureDetector(
            onTap: () async{
              FocusScope.of(context).unfocus();
              if(validateAndSave()){
                setState(() {
                  isAPIcallProcess = true;
                });
                var res = await APIService.changePassword(ChangePasswordRequestModel(oldPassword: currentPassword,newPassword: newPassword));
                setState(() {
                  isAPIcallProcess = false;
                });
                if(res.meta.ok){
                  Navigator.of(context).pop();
                }
                _showToast(res.meta.messages[0], size);
              }
            },
            child: Container(
              margin: EdgeInsets.all(15.0),
              decoration: BoxDecoration(
                  color: appPrimaryColor,
                  border: Border.all(color: appPrimaryColor),
                  borderRadius: BorderRadius.circular(20.0)),
              alignment: Alignment.center,
              child: Padding(
                padding: const EdgeInsets.only(top: 14.0,bottom: 14.0),
                child: Text( "Update Password", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),),
              ),
            ),
          )
        ],
      ),
    );
  }
  bool validateAndSave() {
    final form = globalFormKey.currentState;
    if (form.validate()) {
      form.save();
      return true;
    } else {
      return false;
    }
  }
}
