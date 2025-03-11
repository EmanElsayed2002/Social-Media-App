import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../Service/posts/posts.service';
import Swal from 'sweetalert2';
import { UserService } from '../../Service/user/user.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent implements OnInit {
  constructor(
    private postService: PostsService,
    private userServie: UserService
  ) {}
  users: any[] = [];
  usersImage: any[] = [];
  ngOnInit() {
    this.getCurrentUser();
    this.getPosts();
    this.fetchUsers();
    console.log(this.users);
  }
  fetchUsers() {
    this.userServie.getUsers().subscribe((users: any) => {
      console.log(users);
      users.forEach((user: any) => {
        console.log('hi' + user);
        this.users[user.id] = user.username;
        this.usersImage[user.id] = user.profileImage;
      });
    });
  }

  posts: any[] = [];
  currentUserId: number = 0;
  newPost = {
    userId: this.currentUserId,
    content: '',
    image: '',
    likes: 0,
    comments: [],
  };
  getCurrentUser() {
    const userData = localStorage.getItem('user');

    const parsedUserData = userData ? JSON.parse(userData) : null;

    this.currentUserId = parsedUserData ? parsedUserData.id : '0';
    console.log(this.currentUserId);
  }
  isLoading: boolean = true;

  getPosts() {
    this.isLoading = true;
    this.postService.getPosts().subscribe(
      (posts) => {
        this.posts = posts;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching posts:', error);
        this.isLoading = false;
      }
    );
  }

  addPost() {
    const content = this.newPost.content.trim();
    const image = this.newPost.image.trim();

    if (!content) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Post content cannot be empty.',
      });
      return;
    }
    const urlRegex =
      /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp))|^(https?:\/\/.*)$/i;

    if (image && !urlRegex.test(image)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Image URL',
        text: 'Please provide a valid image URL (png, jpg, jpeg, gif, svg, webp).',
      });
      return;
    }

    this.isLoading = true;
    this.newPost.userId = this.currentUserId;
    console.log(this.newPost);
    this.postService.addPost(this.newPost).subscribe(
      (addedPost) => {
        this.posts.unshift(addedPost);
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Post added successfully!',
          showConfirmButton: false,
          timer: 1500,
        });

        this.newPost = {
          userId: this.currentUserId,
          content: '',
          image: '',
          likes: 0,
          comments: [],
        };
      },
      (error) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something went wrong while adding the post.',
        });
        console.error('Error adding post:', error);
      }
    );
  }

  likePost(post: any) {
    post.likes++;
  }

  addComment(post: any, commentContent: string) {
    if (commentContent.trim()) {
      const newComment = {
        id: Date.now(),
        userId: this.currentUserId,
        content: commentContent,
      };
      post.comments.push(newComment);
    }
  }

  editPost(post: any) {
    console.log('Edit post:', post);
  }

  deletePost(postId: number) {
    this.posts = this.posts.filter((post) => post.id !== postId);
  }
}
