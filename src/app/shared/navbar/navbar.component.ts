import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  getUserName(): string {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user ? user.username : 'User';
  }

  onLogout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  openUserProfile() {
    this.router.navigate(['profile']);
  }
  getUserProfileImage(): string | null {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.profileImage || null;
  }
}
