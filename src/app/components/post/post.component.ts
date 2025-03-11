import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { PostsService } from '../../Service/posts/posts.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit, OnChanges {
  constructor(private postService: PostsService, private http: HttpClient) {}
  ngOnInit(): void {
    this.getCurrentUser();
    console.log(this.postUSerName);
  }

  isLiked = false;
  @Input() postUSerName: any;
  @Input() postUserImage: any;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['postUSerName']) {
      console.log('Updated post user name:', this.postUSerName);
    }
    if (changes['postUserImage']) {
      console.log('Updated post user name:', this.postUserImage);
    }
  }
  @Input() post: any;
  currentUserId: number = 0;
  currentUserName: string = '';
  isModalOpen = false;
  comments: any[] = [];
  editablePost = { id: 0, title: '', content: '', image: '' };
  showComments: boolean = false;
  @Output() usrmakeEdit = new EventEmitter();
  isPostLiked(post: any): boolean {
    return post.likedBy?.includes(this.currentUserId);
  }

  toggleLike(post: any): void {
    const userId = this.currentUserId;

    post.likedBy = post.likedBy || [];

    const isLiked = post.likedBy.includes(userId);

    post.likedBy = isLiked
      ? post.likedBy.filter((id: any) => id !== userId)
      : [...post.likedBy, userId];

    post.isLiked = !isLiked;

    this.postService
      .toggleLike(post.id, userId, isLiked, post.likedBy.length, post.likedBy)
      .subscribe(() => {
        post.likes += isLiked ? -1 : 1;
      });
  }

  getCurrentUser() {
    const userData = localStorage.getItem('user');

    const parsedUserData = userData ? JSON.parse(userData) : null;

    this.currentUserName = parsedUserData ? parsedUserData.username : null;
    this.currentUserId = parsedUserData ? parsedUserData.id : null;
  }

  addComment(post: any, commentContent: string): void {
    const userId = this.currentUserId;
    const userName = this.currentUserName;

    const newComment = { userId, userName, content: commentContent };
    post.comments = post.comments || [];
    post.comments.push(newComment);

    this.postService
      .addComment(post.id, userId, userName, commentContent)
      .subscribe(
        (response: any) => {
          console.log('Comment added successfully:', response);
        },
        (error) => {
          console.error('Error adding comment:', error);
          post.comments.pop();
        }
      );
  }

  editPost(post: any): void {
    console.log('Edit post:', post);
  }

  deletePost(postId: number): void {
    this.postService.deletePost(postId).subscribe(() => {
      Swal.fire({
        title: 'Success!',
        text: 'Post Deleted successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      this.usrmakeEdit.emit('user make delete changes');
    });
  }

  openEditModal(post: any) {
    console.log('Opening modal for:', post);
    this.isModalOpen = true;
    this.editablePost = { ...post };
  }
  toggleCommentSection(post: any) {
    this.showComments = !this.showComments;
    if (this.showComments === true) {
      this.postService.getAllComments(post.id).subscribe((comments) => {
        console.log(comments);
        this.comments = comments;
      });
    }
  }

  closeModal() {
    console.log('Closing modal');
    this.isModalOpen = false;
  }

  saveChanges(post: any) {
    console.log('Saving changes:', post);
    this.postService.editPost(post).subscribe(
      () => {
        Swal.fire({
          title: 'Success!',
          text: 'Post updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        this.usrmakeEdit.emit('user make save changes');
        this.closeModal();
      },
      (error) => {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update post.',
          icon: 'error',
          confirmButtonText: 'Try Again',
        });
      }
    );
  }
}
