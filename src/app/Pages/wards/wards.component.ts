import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../Components/footer/footer.component';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

interface Ward {
  _id: string;
  wardNumber: string;
  name?: string;  // Optional as it's not in your API response
  imageUrl: string;
  taluk: string;
  district: string;
  state: string;
  country: string;
  wasteReports?: WasteReport[];
}

interface WasteReport {
  _id: string;
  ward: {
    _id: string;
    wardNumber: string;
  };
  reportDate: string;
  bioDegradable: number;
  nonBioDegradable: number;
  awareness: string;
  reportedBy?: string;  // Optional as it's not in your API response
  createdAt: string;
  images?: string[];    // Optional as it's not in your API response
}

interface Complaint {
  title: string;
  location: string;
  description: string;
  wardNumber: string;
  raisedBy: string;
  images: File[];
}

@Component({
  selector: 'app-wards',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, HttpClientModule],
  templateUrl: './wards.component.html',
  styleUrls: ['./wards.component.css']
})
export class WardsComponent implements OnInit {
  wards: Ward[] = [];
  mergedWards: Ward[] = [];
  isModalOpen = false;
  complaint: Complaint = {
    title: '',
    location: '',
    description: '',
    wardNumber: '',
    raisedBy: localStorage.getItem('username') || 'Anonymous',
    images: []
  };
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    forkJoin({
      wards: this.http.get<Ward[]>('https://garbage-management-backend-qtya.onrender.com/api/wards'),
      reports: this.http.get<WasteReport[]>('https://garbage-management-backend-qtya.onrender.com/api/waste-reports')
    }).subscribe({
      next: ({ wards, reports }) => {
        this.wards = wards;
        this.mergeWardsWithReports(wards, reports);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.isLoading = false;
        this.showError('Failed to load data', error.error?.message || 'Unknown error occurred');
      }
    });
  }

  mergeWardsWithReports(wards: Ward[], reports: WasteReport[]) {
    this.mergedWards = wards.map(ward => {
      const wardReports = reports.filter(report => report.ward._id === ward._id);
      return {
        ...ward,
        wasteReports: wardReports
      };
    });
    this.wards = this.mergedWards;
  }

  getAverageBio(reports: WasteReport[]): number {
    if (!reports || reports.length === 0) return 0;
    const total = reports.reduce((sum, report) => sum + report.bioDegradable, 0);
    return Math.round(total / reports.length);
  }

  getAverageNonBio(reports: WasteReport[]): number {
    if (!reports || reports.length === 0) return 0;
    const total = reports.reduce((sum, report) => sum + report.nonBioDegradable, 0);
    return Math.round(total / reports.length);
  }

  getLastReportDate(reports: WasteReport[]): string {
    if (!reports || reports.length === 0) return 'N/A';
    // Sort by date descending and get the most recent
    const sortedReports = [...reports].sort((a, b) => 
      new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime()
    );
    return sortedReports[0].reportDate;
  }

  openModal(wardNumber: string) {
    this.complaint.wardNumber = wardNumber;
    this.complaint.raisedBy = localStorage.getItem('username') || 'Anonymous';
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetComplaintForm();
  }

  resetComplaintForm() {
    this.complaint = {
      title: '',
      location: '',
      description: '',
      wardNumber: '',
      raisedBy: localStorage.getItem('username') || 'Anonymous',
      images: []
    };
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      this.complaint.images = Array.from(files);
    }
  }

  removeFile(index: number) {
    this.complaint.images.splice(index, 1);
  }

  submitComplaint() {
    if (!this.validateComplaint()) {
      return;
    }

    const formData = new FormData();
    formData.append('title', this.complaint.title);
    formData.append('location', this.complaint.location);
    formData.append('description', this.complaint.description);
    formData.append('wardNumber', this.complaint.wardNumber);
    formData.append('raisedBy', this.complaint.raisedBy);

    this.complaint.images.forEach((file, index) => {
      formData.append('images', file, file.name);
    });

    this.http.post('https://garbage-management-backend-qtya.onrender.com/api/complaints', formData)
      .subscribe({
        next: (response) => {
          this.showSuccess('Complaint submitted successfully!');
          this.closeModal();
        },
        error: (error) => {
          console.error('Error submitting complaint:', error);
          this.showError('Submission failed', error.error?.message || 'Unknown error occurred');
        }
      });
  }

  private validateComplaint(): boolean {
    if (!this.complaint.title || !this.complaint.description || 
        !this.complaint.wardNumber || !this.complaint.raisedBy) {
      this.showWarning('Please fill in all required fields');
      return false;
    }

    if (this.complaint.images.length === 0) {
      this.showWarning('Please upload at least one image');
      return false;
    }

    return true;
  }

  private showSuccess(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
      confirmButtonColor: '#9B1C2C',
    });
  }

  private showError(title: string, message: string) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonColor: '#9B1C2C',
    });
  }

  private showWarning(message: string) {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: message,
      confirmButtonColor: '#9B1C2C',
    });
  }
}