import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  apiURL: string = 'http://localhost:3000/posts';
  constructor(private http: HttpClient) {}
  getPosts() {
    return this.http.get<any>(this.apiURL);
  }
  deletePost(postId: any) {
    return this.http.delete(`${this.apiURL}/${postId}`);
  }
  addPost(post: any) {
    return this.http.post(`${this.apiURL}`, post);
  }
  editPost(post: any) {
    console.log(post + 'service');
    return this.http.put(`${this.apiURL}/${post.id}`, post);
  }
  likePost(postId: number, userId: number, likesCount: number) {
    return this.http.post(`${this.apiURL}/${postId}/like`, {
      userId,
      likes: likesCount,
    });
  }

  toggleLike(
    postId: string,
    userId: number,
    isLiked: boolean,
    likesCount: number,
    likedBy: string[]
  ) {
    return this.http.patch(`${this.apiURL}/${postId}`, {
      userId,
      likes: likesCount,
      likedBy,
      action: isLiked ? 'dislike' : 'like',
    });
  }

  addComment(
    postId: string,
    userId: number,
    userName: string,
    commentContent: string
  ) {
    const newComment = {
      id: Date.now().toString(),
      userId,
      userName,
      content: commentContent,
    };

    return this.http.get<any>(`${this.apiURL}/${postId}`).pipe(
      switchMap((post) => {
        const updatedComments = [...post.comments, newComment];
        return this.http.patch(`${this.apiURL}/${postId}`, {
          comments: updatedComments,
        });
      })
    );
  }
  deleteUserPosts(userId: number) {
    this.http
      .get<any[]>(`${this.apiURL}?userId=${userId}`)
      .subscribe((posts) => {
        posts.forEach((post) => {
          this.http.delete(`${this.apiURL}/${post.id}`).subscribe(() => {
            console.log(`Post with id ${post.id} deleted.`);
          });
        });
      });
  }

  getAllComments(postId: number) {
    return this.http
      .get<any>(`${this.apiURL}/${postId}`)
      .pipe(map((post) => post.comments || []));
  }
}
