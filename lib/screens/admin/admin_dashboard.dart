import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';

class AdminDashboard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    return Scaffold(
      appBar: AppBar(title: Text('Admin Dashboard')),
      drawer: Drawer(
        child: ListView(
          children: [
            DrawerHeader(child: Text('Menu')),
            ListTile(
              title: Text('Manage Users'),
              onTap: () {},
            ),
            ListTile(
              title: Text('Manage Orders'),
              onTap: () {},
            ),
            ListTile(
              title: Text('Manage Roles'),
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
      body: ListView(
        children: [
          ListTile(title: Text('Manage Users'), onTap: () {}),
          ListTile(title: Text('Manage Orders'), onTap: () {}),
          ListTile(title: Text('Manage Roles'), onTap: () {}),
        ],
      ),
    );
  }
} 