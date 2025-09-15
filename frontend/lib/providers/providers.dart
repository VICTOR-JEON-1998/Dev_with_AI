import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';

class Group {
  final String name;
  final bool isOwner;
  Group({required this.name, this.isOwner = false});
}

class Post {
  final String id;
  final String groupId;
  String content;
  List<String> comments;
  Post({
    required this.id,
    required this.groupId,
    required this.content,
    List<String>? comments,
  }) : comments = comments ?? [];
}

final authTokenProvider = StateProvider<String?>((ref) => null);

final dioProvider = Provider<Dio>((ref) {
  final dio = Dio();
  dio.interceptors.add(InterceptorsWrapper(onRequest: (options, handler) {
    final token = ref.read(authTokenProvider);
    if (token != null) {
      options.headers['Authorization'] = 'Bearer ' + token;
    }
    handler.next(options);
  }));
  return dio;
});

class GroupsNotifier extends StateNotifier<List<Group>> {
  GroupsNotifier() : super([]);

  void addGroup(String name, {bool owner = false}) {
    state = [...state, Group(name: name, isOwner: owner)];
  }
}

final groupsProvider = StateNotifierProvider<GroupsNotifier, List<Group>>((ref) => GroupsNotifier());

class PostsNotifier extends StateNotifier<List<Post>> {
  PostsNotifier() : super([]);

  Future<void> refresh(String groupId) async {
    await Future.delayed(const Duration(milliseconds: 300));
  }

  void addPost(String groupId, String content) {
    final id = DateTime.now().millisecondsSinceEpoch.toString();
    state = [...state, Post(id: id, groupId: groupId, content: content)];
  }

  void editPost(String id, String content) {
    state = [
      for (final p in state)
        if (p.id == id)
          Post(id: p.id, groupId: p.groupId, content: content, comments: p.comments)
        else
          p
    ];
  }

  void addComment(String id, String comment) {
    state = [
      for (final p in state)
        if (p.id == id)
          Post(
            id: p.id,
            groupId: p.groupId,
            content: p.content,
            comments: [...p.comments, comment],
          )
        else
          p
    ];
  }
}

final postsProvider = StateNotifierProvider<PostsNotifier, List<Post>>((ref) => PostsNotifier());
