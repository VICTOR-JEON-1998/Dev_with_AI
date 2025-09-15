import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:zod/zod.dart';

import '../../providers/providers.dart';

class GroupJoinPage extends ConsumerWidget {
  const GroupJoinPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = GoRouter.of(context);
    final controller = TextEditingController();
    final schema = Zod.string().min(1);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Join Group'),
        leading: router.canPop() ? BackButton(onPressed: router.pop) : null,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: controller,
              decoration: const InputDecoration(labelText: 'Group Code'),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                final result = schema.safeParse(controller.text);
                if (result.success) {
                  ref.read(groupsProvider.notifier).addGroup(controller.text, owner: false);
                  router.go('/home');
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Invalid code')),
                  );
                }
              },
              child: const Text('Join'),
            )
          ],
        ),
      ),
    );
  }
}
