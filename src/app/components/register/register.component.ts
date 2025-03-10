import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../Service/user/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  isLoading = false;
  showToast: boolean = false;

  constructor(private authService: UserService, private router: Router) {}

  newUserData = new FormGroup({
    username: new FormControl('', [
      Validators.minLength(3),
      Validators.required,
      Validators.maxLength(20),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    profileImage: new FormControl('assets/image.png'),
  });

  onRegister() {
    if (this.newUserData.invalid) {
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
      return;
    }

    this.isLoading = true;
    console.log(this.newUserData.value);
    this.authService.register(this.newUserData.value).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire({
          title: 'Registered Successfully!',
          text: 'You can now login to your account.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Go to Login',
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Registration Failed',
          text: err.error?.message || 'Something went wrong!',
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Try Again',
        });
      },
    });
  }
}
