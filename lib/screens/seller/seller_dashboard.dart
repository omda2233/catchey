import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';

class SellerDashboard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    return Scaffold(
      appBar: AppBar(title: Text('Seller Dashboard')),
      drawer: Drawer(
        child: ListView(
          children: [
            DrawerHeader(child: Text('Menu')),
            ListTile(
              title: Text('Profile'),
              onTap: () {},
            ),
            ListTile(
              title: Text('Manage Products'),
              onTap: () {},
            ),
            ListTile(
              title: Text('Orders'),
              onTap: () {},
            ),
            ListTile(
              title: Text('Settings'),
              onTap: () {},
            ),
            ListTile(
              title: Text('Logout'),
              onTap: () async {
                await authProvider.logout();
                Navigator.pushReplacementNamed(context, '/login');
              },
            ),
          ],
        ),
      ),
      body: Center(child: Text('Manage your products and orders here.')),
    );
  }
} 