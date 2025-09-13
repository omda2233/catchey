import 'package:cloud_firestore/cloud_firestore.dart';

enum UserRole {
  buyer,
  seller,
  delivery,
  shipper,
  admin,
}

class UserModel {
  final String id;
  final String email;
  final UserRole role;
  final String name;
  final String? phone;
  final String? address;
  final String? companyName; // For sellers/delivery companies
  final String? profileImage;
  final DateTime createdAt;
  final DateTime? updatedAt;

  UserModel({
    required this.id,
    required this.email,
    required this.role,
    required this.name,
    this.phone,
    this.address,
    this.companyName,
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
        (role) => role.toString().split('.').last == data['role'],
        orElse: () => UserRole.buyer,
      ),
      name: data['name'] ?? '',
      phone: data['phone'],
      address: data['address'],
      companyName: data['companyName'],
      profileImage: data['profileImage'],
      createdAt: (data['created_at'] as Timestamp).toDate(),
      updatedAt: data['updated_at'] != null
          ? (data['updated_at'] as Timestamp).toDate()
          : null,
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'email': email,
      'role': role.toString().split('.').last,
      'name': name,
      'phone': phone,
      'address': address,
      'companyName': companyName,
      'profileImage': profileImage,
      'created_at': Timestamp.fromDate(createdAt),
      'updated_at': updatedAt != null ? Timestamp.fromDate(updatedAt!) : null,
    };
  }

  UserModel copyWith({
    String? id,
    String? email,
    UserRole? role,
    String? name,
    String? phone,
    String? address,
    String? companyName,
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
      companyName: companyName ?? this.companyName,
      profileImage: profileImage ?? this.profileImage,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
