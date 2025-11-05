import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule , HttpClientModule ,CommonModule ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  selectedRole: string = '';
  isModalOpen: boolean = false;
  selectedUser: any = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    role: '',
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.http.get<any[]>('https://garbage-management-backend-qtya.onrender.com/api/users').subscribe(
      (res) => {
        this.users = res.map(user => ({
          ...user,
          phone: user.phone || '',  // Handle missing phone
          address: user.address || ''  // Handle missing address
        }));
        this.filterUsers();
      },
      (err) => {
        console.error('Error fetching users:', err);
        Swal.fire('Error!', 'Failed to fetch users!', 'error');
      }
    );
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = user.fullName.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesRole = !this.selectedRole || user.role === this.selectedRole;
      return matchesSearch && matchesRole;
    });
  }

  openModal(user: any) {
    this.selectedUser = { ...user };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveUser() {
    if (this.selectedUser._id) {
      this.http
        .put(`https://garbage-management-backend-qtya.onrender.com/api/users/${this.selectedUser._id}`, this.selectedUser)
        .subscribe(
          () => {
            Swal.fire('Success!', 'User updated successfully!', 'success');
            this.getUsers(); // Refresh users after update
            this.closeModal();
          },
          (err) => {
            console.error('Error updating user:', err);
            Swal.fire('Error!', 'Failed to update user!', 'error');
          }
        );
    }
  }

  deleteUser(userId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http
          .delete(`https://garbage-management-backend-qtya.onrender.com/api/users/${userId}`)
          .subscribe(
            () => {
              Swal.fire('Deleted!', 'User has been deleted.', 'success');
              this.getUsers();
            },
            (err) => {
              console.error('Error deleting user:', err);
              Swal.fire('Error!', 'Failed to delete user!', 'error');
            }
          );
      }
    });
  }
}
