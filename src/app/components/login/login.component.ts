import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../Service/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private authService: UserService, private router: Router) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.showError('Please fill out the form correctly.');
      return;
    }

    this.authService.getUsers().subscribe((users) => {
      const user = users.find(
        (user: any) =>
          user.email === this.loginForm.controls['email'].value &&
          user.password === this.loginForm.value.password
      );

      if (user) {
        console.log(user);
        localStorage.setItem('user', JSON.stringify(user));
        Swal.fire({
          title: 'Welcome Back!',
          text: 'Login successful!',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Go to Posts',
        }).then(() => {
          this.router.navigate(['/posts']);
        });
      } else {
        this.showError('Invalid email or password.');
      }
    });
  }

  showError(message: string) {
    Swal.fire({
      title: 'Login Failed',
      text: message,
      icon: 'error',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Try Again',
    });
  }
}
