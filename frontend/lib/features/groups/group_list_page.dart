import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../providers/providers.dart';

class GroupListPage extends ConsumerWidget {
  const GroupListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = GoRouter.of(context);
    final groups = ref.watch(groupsProvider);
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Groups'),
        leading: router.canPop() ? BackButton(onPressed: router.pop) : null,
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              children: [
                for (final g in groups)
                  ListTile(
                    title: Text(g.name),
                    subtitle: Text(g.isOwner ? 'Owner' : 'Member'),
                  ),
              ],
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              ElevatedButton(
                onPressed: () => router.go('/groups/create'),
                child: const Text('Create Group'),
              ),
              ElevatedButton(
                onPressed: () => router.go('/groups/join'),
                child: const Text('Join Group'),
              ),
            ],
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
