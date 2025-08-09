import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class FilterDrawer extends StatefulWidget {
  final void Function(Map<String, dynamic>) onFilterChanged;

  const FilterDrawer({
    Key? key,
    required this.onFilterChanged,
  }) : super(key: key);

  @override
  _FilterDrawerState createState() => _FilterDrawerState();
}

class _FilterDrawerState extends State<FilterDrawer> {
  final Map<String, dynamic> _filters = {
    'category': 'all',
    'minPrice': 0.0,
    'maxPrice': double.infinity,
    'inStock': false,
    'sortBy': 'name',
  };

  void _updateFilters() {
    widget.onFilterChanged(_filters);
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final theme = Theme.of(context);

    return Drawer(
      child: ListView(
        children: [
          DrawerHeader(
            decoration: BoxDecoration(
              color: theme.colorScheme.primary,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  l10n.filters,
                  style: theme.textTheme.headlineSmall?.copyWith(
                    color: theme.colorScheme.onPrimary,
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  l10n.filterDescription,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: theme.colorScheme.onPrimary,
                  ),
                ),
              ],
            ),
          ),
          ListTile(
            title: Text(l10n.category),
            subtitle: DropdownButton<String>(
              value: _filters['category'],
              isExpanded: true,
              items: [
                'all',
                'fabrics',
                'accessories',
                'tools',
              ].map((category) {
                return DropdownMenuItem(
                  value: category,
                  child: Text(l10n.categoryName(category)),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _filters['category'] = value;
                  _updateFilters();
                });
              },
            ),
          ),
          ListTile(
            title: Text(l10n.priceRange),
            subtitle: RangeSlider(
              values: RangeValues(
                _filters['minPrice'],
                _filters['maxPrice'] == double.infinity
                    ? 1000.0
                    : _filters['maxPrice'],
              ),
              min: 0.0,
              max: 1000.0,
              divisions: 100,
              labels: RangeLabels(
                '\$${_filters['minPrice'].toStringAsFixed(2)}',
                _filters['maxPrice'] == double.infinity
                    ? '∞'
                    : '\$${_filters['maxPrice'].toStringAsFixed(2)}',
              ),
              onChanged: (values) {
                setState(() {
                  _filters['minPrice'] = values.start;
                  _filters['maxPrice'] =
                      values.end >= 1000.0 ? double.infinity : values.end;
                  _updateFilters();
                });
              },
            ),
          ),
          SwitchListTile(
            title: Text(l10n.inStockOnly),
            value: _filters['inStock'],
            onChanged: (value) {
              setState(() {
                _filters['inStock'] = value;
                _updateFilters();
              });
            },
          ),
          ListTile(
            title: Text(l10n.sortBy),
            subtitle: DropdownButton<String>(
              value: _filters['sortBy'],
              isExpanded: true,
              items: [
                'name',
                'price_asc',
                'price_desc',
                'newest',
              ].map((sort) {
                return DropdownMenuItem(
                  value: sort,
                  child: Text(l10n.sortOption(sort)),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _filters['sortBy'] = value;
                  _updateFilters();
                });
              },
            ),
          ),
          Padding(
            padding: EdgeInsets.all(16),
            child: ElevatedButton(
              onPressed: () {
                setState(() {
                  _filters['category'] = 'all';
                  _filters['minPrice'] = 0.0;
                  _filters['maxPrice'] = double.infinity;
                  _filters['inStock'] = false;
                  _filters['sortBy'] = 'name';
                  _updateFilters();
                });
              },
              child: Text(l10n.resetFilters),
            ),
          ),
        ],
      ),
    );
  }
} 