import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';

abstract class AuthBase {
  User get currentUser;
  Future<void> signOut();
  Future<String> signInWithGoogle();
  Stream<User> authStateChanges();
}

class Auth implements AuthBase {
  final _firebaseAuth = FirebaseAuth.instance;

  @override
  Future<String> signInWithGoogle() async {
    final googleSignIn = GoogleSignIn(
      scopes: <String>[
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'openid'
      ],
    );
    final googleUser = await googleSignIn.signIn();
    if (googleUser != null) {
      final googleAuth = await googleUser.authentication;
      if (googleAuth.idToken != null) {
        print("idToken: " + googleAuth.idToken);
        print("accessToken: " + googleAuth.accessToken);
        return googleAuth.idToken.toString();
      } else {
        throw FirebaseAuthException(message: 'Missing Google ID Token');
      }
    } else {
      throw FirebaseAuthException(message: 'Sign in aborted by user');
    }
  }

  @override
  Stream<User> authStateChanges() => _firebaseAuth.authStateChanges();

  @override
  User get currentUser => _firebaseAuth.currentUser;

  @override
  Future<User> signInAnonymously() async {
    final userCredential = await _firebaseAuth.signInAnonymously();
    return userCredential.user;
  }
  @override
  @override
  Future<void> signOut() async {
    final googleSignIn = GoogleSignIn();
    await googleSignIn.signOut();
  }
}
