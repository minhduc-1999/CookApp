import 'package:flutter/material.dart';

import 'package:flutter_app/constants.dart';

import 'TextFieldContainer.dart';

class RoundedPasswordField extends StatefulWidget{
  final String hintText;
  final TextEditingController controller;
  final ValueChanged<String> onChanged;

  const RoundedPasswordField({
    Key key,
    this.controller,
    this.hintText,
    this.onChanged,
  }): super(key: key);

  //get _hintText => hintText;
  //get _onChanged => onChanged;

  @override 
  RoundedPasswordFieldState createState() => RoundedPasswordFieldState();
}

class RoundedPasswordFieldState extends State<RoundedPasswordField> {
  bool _isHidden = true;
  @override
  Widget build(BuildContext context) {
    
    return TextFieldContainer(
      child: TextField(
        controller: widget.controller,
        onChanged: widget.onChanged,
        obscureText: _isHidden,
        cursorColor: appPrimaryColor,
        decoration: InputDecoration(
          hintText: widget.hintText,
          icon: Icon(
            Icons.lock,
            color: appPrimaryColor,
          ),
          suffixIcon: IconButton(
            onPressed: (){
              setState(() {
                _isHidden = !_isHidden;
              });
            },
            icon: Icon(
              _isHidden 
              ? Icons.visibility 
              : Icons.visibility_off,
              color: Colors.black,
            ),
          ),
          border: InputBorder.none,
        ),
      ),
    );
  }
}