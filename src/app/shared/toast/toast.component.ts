import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent implements OnInit {
  ngOnInit(): void {
    this.showAlert = true;
    this.startProgressBar();
  }
  showAlert: boolean = false;
  progress: number = 100;
  interval = 0;
  startProgressBar() {
    this.progress = 100;
    const interval = setInterval(() => {
      this.progress -= 2;
      if (this.progress <= 0) {
        clearInterval(interval);
        this.showAlert = false;
      }
    }, 60);
  }

  closeAlert() {
    this.showAlert = false;
    clearInterval(this.interval);
  }
  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
