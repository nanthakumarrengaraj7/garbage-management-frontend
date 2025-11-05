import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;

  private http = inject(HttpClient);

  loginUser() {
    if (!this.email || !this.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Email and Password are required!',
        confirmButtonColor: '#b22222',
      });
      return;
    }

    this.isLoading = true;

    const loginData = {
      email: this.email,
      password: this.password
    };

    this.http.post('https://garbage-management-backend-qtya.onrender.com/api/auth/login', loginData)
      .subscribe({
        next: (response: any) => {
          console.log('Login successful:', response);
          Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            text: 'You have successfully logged in.',
            confirmButtonColor: '#b22222',
          }).then(() => {
            localStorage.setItem('token', response.token);
            localStorage.setItem('role', response.user.role);
            localStorage.setItem('username', response.user.fullName);
            localStorage.setItem('user_id', response.user.id);


            window.location.href = '/';
          });
        },
        error: (error) => {
          console.error('Login failed:', error);
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: error.error?.message || 'Unknown error occurred',
            confirmButtonColor: '#b22222',
          });
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }
}
