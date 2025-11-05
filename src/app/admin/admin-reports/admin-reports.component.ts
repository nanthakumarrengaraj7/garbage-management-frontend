import { Component, OnInit } from '@angular/core';
import { HttpClient , HttpClientModule  } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Ward {
  _id: string;
  name: string;
  wardNumber: string;
}

interface WasteReport {
  _id?: string;
  ward: string;
  reportDate: string;
  bioDegradable: number;
  nonBioDegradable: number;
  awareness: string;
  createdAt?: string;
}

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule , HttpClientModule ], // Add FormsModule here
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.css']
})
export class AdminReportsComponent implements OnInit {
  private readonly API_BASE_URL = 'https://garbage-management-backend-qtya.onrender.com/api';
  private readonly WARDS_API = `${this.API_BASE_URL}/wards`;
  private readonly REPORTS_API = `${this.API_BASE_URL}/waste-reports`;

  wards: Ward[] = [];
  reports: WasteReport[] = [];
  reportData: WasteReport = {
    ward: '',
    reportDate: new Date().toISOString().split('T')[0],
    bioDegradable: 0,
    nonBioDegradable: 0,
    awareness: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchWards();
    this.fetchReports();
  }

  // ... rest of your component methods remain the same ...
  fetchWards(): void {
    this.http.get<Ward[]>(this.WARDS_API).subscribe(
      (wards) => {
        this.wards = wards;
      },
      (error) => {
        console.error('Error fetching wards:', error);
      }
    );
  }

  fetchReports(): void {
    this.http.get<WasteReport[]>(this.REPORTS_API).subscribe(
      (reports) => {
        this.reports = reports;
      },
      (error) => {
        console.error('Error fetching reports:', error);
      }
    );
  }

  onSubmit(form: NgForm): void {
    if (this.reportData.bioDegradable + this.reportData.nonBioDegradable > 100) {
      alert('Total waste percentage cannot exceed 100%');
      return;
    }

    if (form.valid) {
      this.http.post<WasteReport>(this.REPORTS_API, this.reportData).subscribe(
        (newReport) => {
          this.reports.unshift(newReport);
          this.resetForm();
          form.resetForm();
        },
        (error) => {
          console.error('Error submitting report:', error);
        }
      );
    }
  }

  resetForm(): void {
    this.reportData = {
      ward: '',
      reportDate: new Date().toISOString().split('T')[0],
      bioDegradable: 0,
      nonBioDegradable: 0,
      awareness: ''
    };
  }

  getWardName(wardId: string): string {
    const ward = this.wards.find(w => w._id === wardId);
    return ward ? `${ward.name} (Ward ${ward.wardNumber})` : 'Unknown Ward';
  }
}