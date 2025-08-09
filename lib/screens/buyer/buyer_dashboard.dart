import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../services/product_service.dart';
import '../../models/product.dart';
import '../../widgets/product_card.dart';
import '../../widgets/search_bar.dart';
import '../../widgets/filter_drawer.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class BuyerDashboard extends StatefulWidget {
  @override
  _BuyerDashboardState createState() => _BuyerDashboardState();
}

class _BuyerDashboardState extends State<BuyerDashboard> {
  final ProductService _productService = ProductService();
  String _searchQuery = '';
  Map<String, dynamic> _filters = {};
  
  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final l10n = AppLocalizations.of(context)!;
    
    return Scaffold(
      appBar: AppBar(
        title: Text('Catchy'),
        actions: [
          IconButton(
            icon: Icon(Icons.shopping_cart),
            onPressed: () => Navigator.pushNamed(context, '/cart'),
          ),
        ],
      ),
      drawer: FilterDrawer(
        onFilterChanged: (filters) {
          setState(() {
            _filters = filters;
          });
        },
      ),
      endDrawer: Drawer(
        child: ListView(
          children: [
            UserAccountsDrawerHeader(
              accountName: Text(authProvider.currentUser?.displayName ?? ''),
              accountEmail: Text(authProvider.currentUser?.email ?? ''),
              currentAccountPicture: CircleAvatar(
                child: Text(
                  authProvider.currentUser?.displayName?[0].toUpperCase() ?? 'U',
                ),
              ),
            ),
            ListTile(
              leading: Icon(Icons.person),
              title: Text(l10n.profile),
              onTap: () => Navigator.pushNamed(context, '/profile'),
            ),
            ListTile(
              leading: Icon(Icons.shopping_bag),
              title: Text(l10n.orders),
              onTap: () => Navigator.pushNamed(context, '/orders'),
            ),
            ListTile(
              leading: Icon(Icons.settings),
              title: Text(l10n.settings),
              onTap: () => Navigator.pushNamed(context, '/settings'),
            ),
            ListTile(
              leading: Icon(Icons.exit_to_app),
              title: Text(l10n.logout),
              onTap: () async {
                await authProvider.logout();
                Navigator.pushReplacementNamed(context, '/login');
              },
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          SearchBar(
            onChanged: (query) {
              setState(() {
                _searchQuery = query;
              });
            },
          ),
          Expanded(
            child: StreamBuilder<List<Product>>(
              stream: _productService.getProducts(_filters),
              builder: (context, snapshot) {
                if (snapshot.hasError) {
                  return Center(child: Text(l10n.errorLoadingProducts));
                }
                
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return Center(child: CircularProgressIndicator());
                }
                
                final products = snapshot.data!
                    .where((product) => product.name
                        .toLowerCase()
                        .contains(_searchQuery.toLowerCase()))
                    .toList();
                
                return GridView.builder(
                  padding: EdgeInsets.all(16),
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 0.75,
                    mainAxisSpacing: 16,
                    crossAxisSpacing: 16,
                  ),
                  itemCount: products.length,
                  itemBuilder: (context, index) {
                    return ProductCard(
                      product: products[index],
                      onTap: () => Navigator.pushNamed(
                        context,
                        '/product_details',
                        arguments: products[index],
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => Navigator.pushNamed(context, '/cart'),
        child: Icon(Icons.shopping_cart),
        tooltip: l10n.viewCart,
      ),
    );
  }
} 