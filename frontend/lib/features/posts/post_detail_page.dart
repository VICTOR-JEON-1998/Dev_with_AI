import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../providers/providers.dart';

class PostDetailPage extends ConsumerWidget {
  final String postId;
  const PostDetailPage({super.key, required this.postId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = GoRouter.of(context);
    final post = ref.watch(postsProvider).firstWhere((p) => p.id == postId);
    final controller = TextEditingController();
    return Scaffold(
      appBar: AppBar(
        title: const Text('Post Detail'),
        leading: router.canPop() ? BackButton(onPressed: router.pop) : null,
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () => router.go('/posts/${post.id}/edit'),
          )
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                Text(post.content),
                const Divider(),
                for (final c in post.comments) ListTile(title: Text(c)),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: controller,
                    decoration: const InputDecoration(labelText: 'Add comment'),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.send),
                  onPressed: () {
                    final text = controller.text;
                    if (text.isNotEmpty) {
                      ref.read(postsProvider.notifier).addComment(post.id, text);
                      controller.clear();
                    }
                  },
                )
              ],
            ),
          )
        ],
      ),
    );
  }
}
