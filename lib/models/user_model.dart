import 'package:cloud_firestore/cloud_firestore.dart';

enum UserRole {
  customer,
  seller,
  delivery,
  admin,
}

class UserModel {
  final String id;
  final String email;
  final UserRole role;
  final String? name;
  final String? phone;
  final String? address;
  final GeoPoint? location;
  final String? bio;
  final String? storeName;
  final String? storeAddress;
  final GeoPoint? storeLocation;
  final String? profileImage;
  final DateTime createdAt;
  final DateTime? updatedAt;

  UserModel({
    required this.id,
    required this.email,
    required this.role,
    this.name,
    this.phone,
    this.address,
    this.location,
    this.bio,
    this.storeName,
    this.storeAddress,
    this.storeLocation,
    this.profileImage,
    required this.createdAt,
    this.updatedAt,
  });

  factory UserModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return UserModel(
      id: doc.id,
      email: data['email'] ?? '',
      role: UserRole.values.firstWhere(
        (role) => role.toString() == data['role'],
        orElse: () => UserRole.customer,
      ),
      name: data['name'],
      phone: data['phone'],
      address: data['address'],
      location: data['location'],
      bio: data['bio'],
      storeName: data['storeName'],
      storeAddress: data['storeAddress'],
      storeLocation: data['storeLocation'],
      profileImage: data['profileImage'],
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      updatedAt: data['updatedAt'] != null
          ? (data['updatedAt'] as Timestamp).toDate()
          : null,
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'email': email,
      'role': role.toString(),
      'name': name,
      'phone': phone,
      'address': address,
      'location': location,
      'bio': bio,
      'storeName': storeName,
      'storeAddress': storeAddress,
      'storeLocation': storeLocation,
      'profileImage': profileImage,
      'createdAt': Timestamp.fromDate(createdAt),
      'updatedAt': updatedAt != null ? Timestamp.fromDate(updatedAt!) : null,
    };
  }

  UserModel copyWith({
    String? id,
    String? email,
    UserRole? role,
    String? name,
    String? phone,
    String? address,
    GeoPoint? location,
    String? bio,
    String? storeName,
    String? storeAddress,
    GeoPoint? storeLocation,
    String? profileImage,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return UserModel(
      id: id ?? this.id,
      email: email ?? this.email,
      role: role ?? this.role,
      name: name ?? this.name,
      phone: phone ?? this.phone,
      address: address ?? this.address,
      location: location ?? this.location,
      bio: bio ?? this.bio,
      storeName: storeName ?? this.storeName,
      storeAddress: storeAddress ?? this.storeAddress,
      storeLocation: storeLocation ?? this.storeLocation,
      profileImage: profileImage ?? this.profileImage,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
} 