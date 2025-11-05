import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';  // ✅ SweetAlert Import

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  fullName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  isLoading: boolean = false;

  private http = inject(HttpClient);

  registerUser() {
    if (!this.fullName || !this.email || !this.password || !this.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'All fields are required!',
      });
      return;
    }

    if (this.password !== this.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Passwords do not match!',
      });
      return;
    }

    this.isLoading = true;

    const userData = {
      fullName: this.fullName,
      email: this.email,
      password: this.password
    };

    this.http.post('http://localhost:5000/api/auth/register', userData)
      .subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: 'You can now log in with your new account.',
          }).then(() => {
            window.location.href = '/login';
          });
          this.resetForm();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: error.error?.message || "Unknown error",
          });
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  resetForm() {
    this.fullName = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }
}
