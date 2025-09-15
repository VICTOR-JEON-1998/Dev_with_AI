import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class ProfilePage extends ConsumerWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = GoRouter.of(context);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        leading: router.canPop() ? BackButton(onPressed: router.pop) : null,
      ),
      body: const Center(
        child: Text('User Profile'),
      ),
    );
  }
}
