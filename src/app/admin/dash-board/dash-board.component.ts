import { Component, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dash-board',
  standalone: true,
  imports: [HttpClientModule], // ✅ Ensure HttpClientModule is imported
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements AfterViewInit {
  @ViewChild('complaintChart') complaintChart!: ElementRef;

  totalWards = 0;
  totalUsers = 0;
  totalEmployees = 0;
  totalComplaints = 0;
  pendingComplaints = 0;
  completedComplaints = 0;

  private http = inject(HttpClient); // ✅ Inject HttpClient

  ngAfterViewInit() {
    this.fetchCounts();
  }

  fetchCounts() {
    console.log('Fetching counts...');
  
    // Fetch Wards Count
    this.http.get<any[]>('https://garbage-management-backend-qtya.onrender.com/api/wards').subscribe({
      next: (response) => {
        console.log('Wards Count:', response.length);
        this.totalWards = response.length; // ✅ Get array length
      },
      error: (err) => console.error('Error fetching wards:', err)
    });
  
    // Fetch Users Count
    this.http.get<any[]>('https://garbage-management-backend-qtya.onrender.com/api/users').subscribe({
      next: (response) => {
        console.log('Users Count:', response.length);
        this.totalUsers = response.length; // ✅ Get array length
      },
      error: (err) => console.error('Error fetching users:', err)
    });
  
    // Fetch Employees Count
    this.http.get<any[]>('https://garbage-management-backend-qtya.onrender.com/api/emp').subscribe({
      next: (response) => {
        console.log('Employees Count:', response.length);
        this.totalEmployees = response.length; // ✅ Get array length
      },
      error: (err) => console.error('Error fetching employees:', err)
    });
  
    // Fetch Complaints Data
    this.http.get<any[]>('https://garbage-management-backend-qtya.onrender.com/api/complaints').subscribe({
      next: (response) => {
        console.log('Complaints Data:', response);
  
        // ✅ Count complaints based on status
        this.totalComplaints = response.length;
        this.pendingComplaints = response.filter(c => c.status === 'Pending').length;
        this.completedComplaints = response.filter(c => c.status === 'Completed').length;
  
        this.loadChart();
      },
      error: (err) => console.error('Error fetching complaints:', err)
    });
  }
  

  loadChart() {
    if (!this.complaintChart || !this.complaintChart.nativeElement) {
      console.error('Chart Element is not available');
      return;
    }

    console.log('Loading Chart...');
    new Chart(this.complaintChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Pending', 'Completed'],
        datasets: [
          {
            label: 'Complaints',
            data: [this.pendingComplaints, this.completedComplaints],
            backgroundColor: ['#FF6384', '#36A2EB'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB']
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          }
        }
      }
    });
  }
}
