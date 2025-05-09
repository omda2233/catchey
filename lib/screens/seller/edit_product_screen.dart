import 'dart:io';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:image_picker/image_picker.dart';
import '../../providers/auth_provider.dart';
import '../../services/product_service.dart';
import '../../models/product.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class EditProductScreen extends StatefulWidget {
  final Product product;

  const EditProductScreen({
    Key? key,
    required this.product,
  }) : super(key: key);

  @override
  _EditProductScreenState createState() => _EditProductScreenState();
}

class _EditProductScreenState extends State<EditProductScreen> {
  final _formKey = GlobalKey<FormState>();
  final _productService = ProductService();
  final _imagePicker = ImagePicker();
  
  late final TextEditingController _nameController;
  late final TextEditingController _descriptionController;
  late final TextEditingController _priceController;
  late String _selectedCategory;
  late bool _inStock;
  List<File> _newImages = [];
  List<String> _existingImages = [];
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.product.name);
    _descriptionController = TextEditingController(text: widget.product.description);
    _priceController = TextEditingController(text: widget.product.price.toString());
    _selectedCategory = widget.product.category;
    _inStock = widget.product.inStock;
    _existingImages = [widget.product.imageUrl];
  }

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    _priceController.dispose();
    super.dispose();
  }

  Future<void> _pickImages() async {
    final pickedFiles = await _imagePicker.pickMultiImage();
    if (pickedFiles != null) {
      setState(() {
        _newImages.addAll(pickedFiles.map((file) => File(file.path)));
      });
    }
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;
    if (_existingImages.isEmpty && _newImages.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(AppLocalizations.of(context)!.selectAtLeastOneImage)),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final updatedProduct = widget.product.copyWith(
        name: _nameController.text,
        description: _descriptionController.text,
        price: double.parse(_priceController.text),
        category: _selectedCategory,
        inStock: _inStock,
      );

      await _productService.updateProduct(
        widget.product.id,
        updatedProduct,
        _newImages.isEmpty ? null : _newImages,
      );
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(AppLocalizations.of(context)!.productUpdated)),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.editProduct),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: EdgeInsets.all(16),
          children: [
            // Image Selection
            Container(
              height: 200,
              decoration: BoxDecoration(
                border: Border.all(color: theme.colorScheme.outline),
                borderRadius: BorderRadius.circular(12),
              ),
              child: _existingImages.isEmpty && _newImages.isEmpty
                  ? Center(
                      child: TextButton.icon(
                        onPressed: _pickImages,
                        icon: Icon(Icons.add_photo_alternate),
                        label: Text(l10n.selectImages),
                      ),
                    )
                  : Stack(
                      children: [
                        PageView.builder(
                          itemCount: _existingImages.length + _newImages.length,
                          itemBuilder: (context, index) {
                            if (index < _existingImages.length) {
                              return Stack(
                                children: [
                                  Image.network(
                                    _existingImages[index],
                                    fit: BoxFit.cover,
                                  ),
                                  Positioned(
                                    right: 8,
                                    top: 8,
                                    child: IconButton(
                                      icon: Icon(Icons.delete, color: Colors.red),
                                      onPressed: () {
                                        setState(() {
                                          _existingImages.removeAt(index);
                                        });
                                      },
                                    ),
                                  ),
                                ],
                              );
                            } else {
                              final newImageIndex = index - _existingImages.length;
                              return Stack(
                                children: [
                                  Image.file(
                                    _newImages[newImageIndex],
                                    fit: BoxFit.cover,
                                  ),
                                  Positioned(
                                    right: 8,
                                    top: 8,
                                    child: IconButton(
                                      icon: Icon(Icons.delete, color: Colors.red),
                                      onPressed: () {
                                        setState(() {
                                          _newImages.removeAt(newImageIndex);
                                        });
                                      },
                                    ),
                                  ),
                                ],
                              );
                            }
                          },
                        ),
                        Positioned(
                          right: 8,
                          bottom: 8,
                          child: FloatingActionButton.small(
                            onPressed: _pickImages,
                            child: Icon(Icons.add_photo_alternate),
                          ),
                        ),
                      ],
                    ),
            ),
            SizedBox(height: 16),

            // Product Name
            TextFormField(
              controller: _nameController,
              decoration: InputDecoration(
                labelText: l10n.productName,
                prefixIcon: Icon(Icons.label),
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return l10n.enterProductName;
                }
                return null;
              },
            ),
            SizedBox(height: 16),

            // Description
            TextFormField(
              controller: _descriptionController,
              decoration: InputDecoration(
                labelText: l10n.description,
                prefixIcon: Icon(Icons.description),
              ),
              maxLines: 3,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return l10n.enterDescription;
                }
                return null;
              },
            ),
            SizedBox(height: 16),

            // Price
            TextFormField(
              controller: _priceController,
              decoration: InputDecoration(
                labelText: l10n.price,
                prefixIcon: Icon(Icons.attach_money),
              ),
              keyboardType: TextInputType.number,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return l10n.enterPrice;
                }
                if (double.tryParse(value) == null) {
                  return l10n.enterValidPrice;
                }
                return null;
              },
            ),
            SizedBox(height: 16),

            // Category
            DropdownButtonFormField<String>(
              value: _selectedCategory,
              decoration: InputDecoration(
                labelText: l10n.category,
                prefixIcon: Icon(Icons.category),
              ),
              items: [
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
                if (value != null) {
                  setState(() => _selectedCategory = value);
                }
              },
            ),
            SizedBox(height: 16),

            // In Stock Switch
            SwitchListTile(
              title: Text(l10n.inStock),
              value: _inStock,
              onChanged: (value) {
                setState(() => _inStock = value);
              },
            ),
            SizedBox(height: 24),

            // Submit Button
            ElevatedButton(
              onPressed: _isLoading ? null : _submitForm,
              child: _isLoading
                  ? SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : Text(l10n.saveChanges),
            ),
          ],
        ),
      ),
    );
  }
} 