import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'features/auth/sign_in_page.dart';
import 'features/auth/sign_up_page.dart';
import 'features/groups/group_list_page.dart';
import 'features/groups/group_create_page.dart';
import 'features/groups/group_join_page.dart';
import 'features/posts/group_feed_page.dart';
import 'features/posts/post_detail_page.dart';
import 'features/posts/post_compose_page.dart';
import 'features/posts/post_edit_page.dart';
import 'features/settings/profile_page.dart';
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
  GoRoute(
    path: '/groups/:id/feed',
    builder: (context, state) => GroupFeedPage(groupId: state.params['id']!),
  ),
  GoRoute(
    path: '/posts/:id',
    builder: (context, state) => PostDetailPage(postId: state.params['id']!),
  ),
  GoRoute(
    path: '/posts/compose',
    builder: (context, state) => PostComposePage(groupId: state.uri.queryParameters['group']),
  ),
  GoRoute(
    path: '/posts/:id/edit',
    builder: (context, state) => PostEditPage(postId: state.params['id']!),
  ),
  GoRoute(path: '/settings/profile', builder: (context, state) => const ProfilePage()),
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
