import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';

class Group {
  final String name;
  final bool isOwner;
  Group({required this.name, this.isOwner = false});
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

