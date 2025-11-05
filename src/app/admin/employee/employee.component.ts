import { Component } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel
import Swal from 'sweetalert2';  // Import SweetAlert2 for notifications

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],  // Add HttpClientModule here
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  searchTerm: string = '';
  isModalOpen: boolean = false;
  editMode: boolean = false;
  selectedEmployee: any = null;
  wards: any[] = [];  // Array to store ward data

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchEmployees();
    this.fetchWards();  // Fetch the ward data
  }

  // Fetch employee data from backend API
  fetchEmployees() {
    this.http.get<any[]>('https://garbage-management-backend-qtya.onrender.com/api/emp').subscribe(
      (data) => {
        this.employees = data;
        this.filteredEmployees = data;
      },
      (error) => {
        Swal.fire('Error', 'Failed to fetch employees!', 'error');  // SweetAlert error
        console.error('Error fetching employees:', error);
      }
    );
  }

  // Fetch ward data from backend API
  fetchWards() {
    this.http.get<any[]>('https://garbage-management-backend-qtya.onrender.com/api/wards').subscribe(
      (data) => {
        this.wards = data;  // Assign the fetched wards data to the wards array
      },
      (error) => {
        Swal.fire('Error', 'Failed to fetch wards!', 'error');  // SweetAlert error
        console.error('Error fetching wards:', error);
      }
    );
  }

  // Filter employee list based on search term
  filterEmployees() {
    this.filteredEmployees = this.employees.filter((employee) =>
      employee.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Open modal for adding/editing employee
  openModal(employee: any = null) {
    this.isModalOpen = true;
    if (employee) {
      this.editMode = true;
      this.selectedEmployee = { ...employee };
    } else {
      this.editMode = false;
      this.selectedEmployee = {};
    }
  }

  // Close the modal
  closeModal() {
    this.isModalOpen = false;
    this.selectedEmployee = null;
  }

  // Save employee data (add/edit)
  saveEmployee() {
    if (this.editMode) {
      this.http.put(`https://garbage-management-backend-qtya.onrender.com/api/emp/${this.selectedEmployee._id}`, this.selectedEmployee).subscribe(
        () => {
          this.fetchEmployees();
          this.closeModal();
          Swal.fire('Success', 'Employee updated successfully!', 'success');  // SweetAlert success
        },
        (error) => {
          Swal.fire('Error', 'Failed to update employee!', 'error');  // SweetAlert error
          console.error('Error updating employee:', error);
        }
      );
    } else {
      this.http.post('https://garbage-management-backend-qtya.onrender.com/api/emp', this.selectedEmployee).subscribe(
        () => {
          this.fetchEmployees();
          this.closeModal();
          Swal.fire('Success', 'Employee added successfully!', 'success');  // SweetAlert success
        },
        (error) => {
          Swal.fire('Error', 'Failed to add employee!', 'error');  // SweetAlert error
          console.error('Error adding employee:', error);
        }
      );
    }
  }

  // Delete an employee
  deleteEmployee(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the employee.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`https://garbage-management-backend-qtya.onrender.com/api/emp/${id}`).subscribe(
          () => {
            this.fetchEmployees();
            Swal.fire('Deleted!', 'The employee has been deleted.', 'success');  // SweetAlert success
          },
          (error) => {
            Swal.fire('Error', 'Failed to delete employee!', 'error');  // SweetAlert error
            console.error('Error deleting employee:', error);
          }
        );
      }
    });
  }
}
