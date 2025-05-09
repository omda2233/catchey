class AppUser {
  final String uid;
  final String email;
  final String role; // buyer, seller, shipper, admin
  final String name;
  final String? location;
  final String? profilePhoto;

  AppUser({
    required this.uid,
    required this.email,
    required this.role,
    required this.name,
    this.location,
    this.profilePhoto,
  });

  factory AppUser.fromMap(String uid, Map<String, dynamic> data) => AppUser(
    uid: uid,
    email: data['email'],
    role: data['role'],
    name: data['name'],
    location: data['location'],
    profilePhoto: data['profilePhoto'],
  );

  Map<String, dynamic> toMap() => {
    'email': email,
    'role': role,
    'name': name,
    'location': location,
    'profilePhoto': profilePhoto,
  };
} 