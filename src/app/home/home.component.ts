import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2'; // Import SweetAlert
import { FooterComponent } from '../Components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  queryData = {
    name: '',
    email: '',
    message: ''
  };

  constructor(private http: HttpClient) {}

  submitQuery() {
    // Send the query data to the backend API
    this.http.post('http://localhost:5000/api/contact', this.queryData)
      .subscribe({
        next: (response) => {
          // Show success message using SweetAlert
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Your query has been submitted successfully!',
          });
          // Reset the form
          this.queryData = { name: '', email: '', message: '' };
        },
        error: (error) => {
          // Show error message using SweetAlert
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong! Please try again.',
          });
          console.error('Error submitting query:', error);
        }
      });
  }
}