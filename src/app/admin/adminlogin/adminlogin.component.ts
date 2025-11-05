import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adminlogin',
  standalone: true,
  imports: [HttpClientModule , ReactiveFormsModule,CommonModule], // ✅ Import HttpClientModule here
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css']
})
export class AdminloginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.http.post('https://garbage-management-backend-qtya.onrender.com/api/auth/login', credentials).subscribe(
        (response: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            text: 'Welcome to the Admin Panel',
            timer: 2000
          });

          console.log('Login Success:', response);
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.user.role);

          window.location.href = '/admindashboard';
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed!',
            text: error.error.message || 'Invalid Credentials',
            timer: 2000
          });
        }
      );
    }
  }
}
