import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';

class ShipperDashboard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    return Scaffold(
      appBar: AppBar(title: Text('Shipper Dashboard')),
      drawer: Drawer(
        child: ListView(
          children: [
            DrawerHeader(child: Text('Menu')),
            ListTile(
              title: Text('Assigned Orders'),
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
      body: Center(child: Text('View and update assigned orders here.')),
    );
  }
} 