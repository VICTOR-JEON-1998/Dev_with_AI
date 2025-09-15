import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:zod/zod.dart';

import '../../providers/providers.dart';

class SignInPage extends ConsumerWidget {
  const SignInPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = GoRouter.of(context);
    final emailController = TextEditingController();
    final passwordController = TextEditingController();
    final schema = Zod.object({
      'email': Zod.string().email(),
      'password': Zod.string().min(6),
    });

    return Scaffold(
      appBar: AppBar(
        title: const Text('Sign In'),
        leading: router.canPop() ? BackButton(onPressed: router.pop) : null,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: emailController,
              decoration: const InputDecoration(labelText: 'Email'),
            ),
            TextField(
              controller: passwordController,
              decoration: const InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                final result = schema.safeParse({
                  'email': emailController.text,
                  'password': passwordController.text,
                });
                if (result.success) {
                  ref.read(authTokenProvider.notifier).state = 'token';
                  router.go('/home');
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Invalid credentials')),
                  );
                }
              },
              child: const Text('Sign In'),
            ),
            TextButton(
              onPressed: () => router.go('/signup'),
              child: const Text('Sign Up'),
            )
          ],
        ),
      ),
    );
  }
}
