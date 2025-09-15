import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'features/auth/sign_in_page.dart';
import 'features/auth/sign_up_page.dart';
import 'features/groups/group_list_page.dart';
import 'features/groups/group_create_page.dart';
import 'features/groups/group_join_page.dart';
import 'providers/providers.dart';

void main() {
  runApp(const ProviderScope(child: PBApp()));
}

final router = GoRouter(initialLocation: '/', routes: [
  GoRoute(path: '/', builder: (context, state) => const SignInPage()),
  GoRoute(path: '/signup', builder: (context, state) => const SignUpPage()),
  GoRoute(path: '/home', builder: (context, state) => const GroupListPage()),
  GoRoute(path: '/groups/create', builder: (context, state) => const GroupCreatePage()),
  GoRoute(path: '/groups/join', builder: (context, state) => const GroupJoinPage()),
]);

class PBApp extends ConsumerWidget {
  const PBApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ref.read(dioProvider);
    return MaterialApp.router(
      routerConfig: router,
      title: 'Private Board',
    );
  }
}
