import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:zod/zod.dart';

import '../../providers/providers.dart';

class PostComposePage extends ConsumerWidget {
  final String? groupId;
  const PostComposePage({super.key, this.groupId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = GoRouter.of(context);
    final controller = TextEditingController();
    final schema = Zod.string().min(1);
    final gid = groupId ?? '';
    return Scaffold(
      appBar: AppBar(
        title: const Text('Compose Post'),
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
                if (result.success && gid.isNotEmpty) {
                  ref.read(postsProvider.notifier).addPost(gid, controller.text);
                  router.pop();
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Invalid content')),
                  );
                }
              },
              child: const Text('Post'),
            )
          ],
        ),
      ),
    );
  }
}
