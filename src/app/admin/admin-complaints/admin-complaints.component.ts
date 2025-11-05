import { Component } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './admin-complaints.component.html',
  styleUrls: ['./admin-complaints.component.css'],
})
export class AdminComplaintsComponent {
  complaints: any[] = [];
  filteredComplaints: any[] = [];
  employees: any[] = [];

  searchTerm: string = '';
  selectedStatus: string = '';
  selectedEmployee: string = '';
  startDate: string = '';
  endDate: string = '';

  isModalOpen: boolean = false;
  selectedComplaint: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchComplaints();
    this.fetchEmployees();
  }

  // ✅ Fetch complaints from backend
  fetchComplaints() {
    this.http.get<any[]>('http://localhost:5000/api/complaints').subscribe(
      (data) => {
        this.complaints = data;
        this.filteredComplaints = data;
      },
      (error) => {
        Swal.fire('Error', 'Failed to fetch complaints!', 'error');
        console.error('Error fetching complaints:', error);
      }
    );
  }

 
  

  // ✅ Fetch employee list
  fetchEmployees() {
    this.http.get<any[]>('http://localhost:5000/api/emp').subscribe(
      (data) => {
        this.employees = data;
      },
      (error) => {
        Swal.fire('Error', 'Failed to fetch employees!', 'error');
        console.error('Error fetching employees:', error);
      }
    );
  }

  // ✅ Filter complaints based on search, status, employee, and date range
  filterComplaints() {
    this.filteredComplaints = this.complaints.filter((complaint) => {
      const matchSearch = complaint.title
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      const matchStatus =
        !this.selectedStatus || complaint.status === this.selectedStatus;
      const matchEmployee =
        !this.selectedEmployee || complaint.assignedTo === this.selectedEmployee;
      const matchDate =
        (!this.startDate || new Date(complaint.date) >= new Date(this.startDate)) &&
        (!this.endDate || new Date(complaint.date) <= new Date(this.endDate));

      return matchSearch && matchStatus && matchEmployee && matchDate;
    });
  }

  // ✅ Open modal for editing status
  openModal(complaint: any) {
    this.isModalOpen = true;
    this.selectedComplaint = { ...complaint };
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedComplaint = null;
  }

  // ✅ Save complaint status
  saveComplaintStatus() {
    this.http
      .put(
        `http://localhost:5000/api/complaints/${this.selectedComplaint._id}`,
        this.selectedComplaint
      )
      .subscribe(
        () => {
          this.fetchComplaints();
          this.closeModal();
          Swal.fire('Success', 'Complaint status updated!', 'success');
        },
        (error) => {
          Swal.fire('Error', 'Failed to update status!', 'error');
          console.error('Error updating status:', error);
        }
      );
  }

  // ✅ Assign employee to complaint
  assignEmployee(complaint: any) {
    Swal.fire({
      title: 'Assign Employee',
      input: 'select',
      inputOptions: this.employees.reduce((acc, employee) => {
        acc[employee._id] = employee.name;
        return acc;
      }, {}),
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        complaint.assignedTo = result.value;
        this.saveComplaintStatus();
      }
    });
  }

  // ✅ Delete complaint
  deleteComplaint(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the complaint.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:5000/api/complaints/${id}`).subscribe(
          () => {
            this.fetchComplaints();
            Swal.fire('Deleted!', 'Complaint has been deleted.', 'success');
          },
          (error) => {
            Swal.fire('Error', 'Failed to delete complaint!', 'error');
          }
        );
      }
    });
  }
}


