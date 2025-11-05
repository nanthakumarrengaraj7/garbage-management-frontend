import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClient and HttpClientModule
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], // Add HttpClientModule here
  templateUrl: './admin-contact.component.html',
  styleUrls: ['./admin-contact.component.css']
})
export class AdminContactComponent implements OnInit {
  queries: any[] = [];

  constructor(private http: HttpClient) {} // Inject HttpClient

  ngOnInit(): void {
    this.fetchQueries();
  }

  // Fetch all contact queries
  fetchQueries() {
    this.http.get<any[]>('https://garbage-management-backend-qtya.onrender.com/api/contact')
      .subscribe({
        next: (response) => {
          this.queries = response;
        },
        error: (error) => {
          console.error('Error fetching queries:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to fetch queries!',
          });
        }
      });
  }

  // Delete a query
  deleteQuery(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this query!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`https://garbage-management-backend-qtya.onrender.com/api/contact/${id}`)
          .subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'The query has been deleted.',
              });
              // Refresh the list after deletion
              this.fetchQueries();
            },
            error: (error) => {
              console.error('Error deleting query:', error);
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to delete the query!',
              });
            }
          });
      }
    });
  }
}