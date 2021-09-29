import 'package:flutter/cupertino.dart';
import 'package:flutter_app/constants.dart';

class TextFieldContainer extends StatelessWidget {
  final Widget child;
  const TextFieldContainer({
    Key key,
    this.child,
  }) : super(key: key);
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Container(
      margin: EdgeInsets.symmetric(vertical: 7),
      padding:
      EdgeInsets.symmetric(horizontal: size.height * 0.02, vertical: 0),
      width: size.width * 0.8,
      height: 60,
      decoration: BoxDecoration(
        color: lightPink,
        borderRadius: BorderRadius.circular(29),
      ),
      child: child,

    );
  }
}
