import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FooterComponent } from '../../Components/footer/footer.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule , FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);

  user: any = { fullName: '', email: '' };
  complaints: any[] = [];

  ngOnInit() {
    this.getUserData(); // ✅ Fetch user data on load
  }

  // ✅ Get User Data from Backend using userId from localStorage
  getUserData() {
    const userId = localStorage.getItem('user_id'); // ✅ Use correct key from localStorage

    if (userId) {
      this.http.get(`https://garbage-management-backend-qtya.onrender.com/api/users/${userId}`, { withCredentials: true })
        .subscribe({
          next: (response: any) => {
            if (Array.isArray(response) && response.length > 0) {
              this.user = response[0];
            } else {
              this.user = response;
            }
            console.log(this.user);
            this.getUserComplaints(); // ✅ Fetch complaints after user data loads
          },
          error: (error) => {
            console.error('Error fetching user data:', error);
            Swal.fire({
              icon: 'error',
              title: 'Failed to Load User Data',
              text: error.error?.message || 'An error occurred while fetching user details.',
              confirmButtonColor: '#b22222',
            });
          }
        });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'User Not Found',
        text: 'No user ID found in local storage. Please log in again.',
        confirmButtonColor: '#b22222',
      }).then(() => {
        window.location.href = '/login';
      });
    }
  }

  // ✅ Get User Complaints from Backend using email
  getUserComplaints() {
   
    const userEmail = localStorage.getItem('username');

    if (userEmail) {
      this.http.get(`https://garbage-management-backend-qtya.onrender.com/api/complaints/user/${userEmail}`, { withCredentials: true })
        .subscribe({
          next: (response: any) => {
            this.complaints = response;
          },
          error: (error) => {
            console.error('Error fetching complaints:', error);
            Swal.fire({
              icon: 'error',
              title: 'Failed to Load Complaints',
              text: error.error?.message || 'An error occurred while fetching complaints.',
              confirmButtonColor: '#b22222',
            });
          }
        });
    }
  }

  // ✅ Get Status Class for Styling
  getStatusClass(status: string) {
    switch (status) {
      case 'Pending': return 'text-yellow-600 font-semibold';
      case 'Resolved': return 'text-green-600 font-semibold';
      case 'In Progress': return 'text-blue-600 font-semibold';
      default: return 'text-gray-600';
    }
  }

  // ✅ Logout API Call
  logout() {
    this.http.post('https://garbage-management-backend-qtya.onrender.com/api/auth/logout', {}, { withCredentials: true })
      .subscribe({
        next: () => {
          localStorage.removeItem('user_id'); // ✅ Remove userId from localStorage
          Swal.fire({
            icon: 'success',
            title: 'Logged Out',
            text: 'You have been logged out successfully.',
            confirmButtonColor: '#b22222',
          }).then(() => {
            window.location.href = '/login';
          });
        },
        error: (error) => {
          console.error('Logout Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Logout Failed',
            text: error.error?.message || 'Failed to log out. Please try again.',
            confirmButtonColor: '#b22222',
          });
        }
      });
  }
}
