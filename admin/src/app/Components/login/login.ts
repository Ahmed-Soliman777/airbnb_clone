import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth-service';
// Import DeviceDetectionService to check device type
import { DeviceDetectionService } from '../../Services/device-detection.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  deviceBlocked: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private deviceDetection: DeviceDetectionService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    // Check device type on component initialization
    if (!this.deviceDetection.isDesktop()) {
      this.deviceBlocked = true;
      const deviceType = this.deviceDetection.getDeviceType();
      this.errorMessage = `Admin access is restricted to desktop computers only. ${
        deviceType === 'mobile' ? 'Mobile phones' : 'Tablets'
      } are not allowed.`;
      this.loginForm.disable();
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    // Check device again before allowing login
    if (!this.deviceDetection.isDesktop()) {
      this.deviceBlocked = true;
      const deviceType = this.deviceDetection.getDeviceType();
      this.errorMessage = `Admin access is restricted to desktop computers only. ${
        deviceType === 'mobile' ? 'Mobile phones' : 'Tablets'
      } are not allowed.`;
      return;
    }

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;
    this.loginForm.disable();

    const { email, password } = this.loginForm.getRawValue();

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.authService.getProfile().subscribe({
          next: (user) => {
            if (user.role === 'admin') {
              this.router.navigate(['/home']);
            } else {
              this.errorMessage = 'Access denied. Admin only.';
              this.authService.logout().subscribe();
              this.loginForm.enable();
            }
            this.isLoading = false;
          },
          error: (err) => {
            this.errorMessage = 'Failed to get user profile';
            this.isLoading = false;
            this.loginForm.enable();
          },
        });
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed';
        this.isLoading = false;
        this.loginForm.enable();
      },
    });
  }
}
