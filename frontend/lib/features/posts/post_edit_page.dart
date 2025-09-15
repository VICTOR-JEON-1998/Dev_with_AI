import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:zod/zod.dart';

import '../../providers/providers.dart';

class PostEditPage extends ConsumerWidget {
  final String postId;
  const PostEditPage({super.key, required this.postId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = GoRouter.of(context);
    final post = ref.watch(postsProvider).firstWhere((p) => p.id == postId);
    final controller = TextEditingController(text: post.content);
    final schema = Zod.string().min(1);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Post'),
        leading: router.canPop() ? BackButton(onPressed: router.pop) : null,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: controller,
              decoration: const InputDecoration(labelText: 'Content'),
              maxLines: 5,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                final result = schema.safeParse(controller.text);
                if (result.success) {
                  ref.read(postsProvider.notifier).editPost(post.id, controller.text);
                  router.pop();
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Invalid content')),
                  );
                }
              },
              child: const Text('Save'),
            )
          ],
        ),
      ),
    );
  }
}
