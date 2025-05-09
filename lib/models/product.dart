class Product {
  final String id;
  final String name;
  final String category;
  final String description;
  final double price;
  final List<String> photos;
  final String sellerId;
  final String sellerName;

  Product({
    required this.id,
    required this.name,
    required this.category,
    required this.description,
    required this.price,
    required this.photos,
    required this.sellerId,
    required this.sellerName,
  });

  factory Product.fromMap(String id, Map<String, dynamic> data) => Product(
    id: id,
    name: data['name'],
    category: data['category'],
    description: data['description'],
    price: (data['price'] as num).toDouble(),
    photos: List<String>.from(data['photos'] ?? []),
    sellerId: data['sellerId'],
    sellerName: data['sellerName'],
  );

  Map<String, dynamic> toMap() => {
    'name': name,
    'category': category,
    'description': description,
    'price': price,
    'photos': photos,
    'sellerId': sellerId,
    'sellerName': sellerName,
  };
} 