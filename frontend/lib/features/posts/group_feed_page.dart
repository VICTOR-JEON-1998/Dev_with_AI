import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../providers/providers.dart';

class GroupFeedPage extends ConsumerWidget {
  final String groupId;
  const GroupFeedPage({super.key, required this.groupId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = GoRouter.of(context);
    final posts = ref.watch(postsProvider);
    final groupPosts = posts.where((p) => p.groupId == groupId).toList();
    return Scaffold(
      appBar: AppBar(
        title: const Text('Group Feed'),
        leading: router.canPop() ? BackButton(onPressed: router.pop) : null,
      ),
      body: RefreshIndicator(
        onRefresh: () => ref.read(postsProvider.notifier).refresh(groupId),
        child: ListView(
          children: [
            for (final p in groupPosts)
              ListTile(
                title: Text(p.content),
                onTap: () => router.go('/posts/${p.id}'),
              ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => router.go('/posts/compose?group=$groupId'),
        child: const Icon(Icons.add),
      ),
    );
  }
}
