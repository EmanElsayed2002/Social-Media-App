import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterLink, RouterModule } from '@angular/router';
import { ToastComponent } from './toast/toast.component';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  declarations: [NavbarComponent, ToastComponent, LoadingComponent],
  imports: [CommonModule, RouterModule, RouterLink],
  exports: [NavbarComponent, ToastComponent, LoadingComponent],
})
export class SharedModule {}
