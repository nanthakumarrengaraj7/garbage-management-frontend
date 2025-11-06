import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { Ward } from './ward.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-wards',
  templateUrl: './admin-wards.component.html',
  styleUrls: ['./admin-wards.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, FormsModule],
})
export class AdminWardsComponent implements OnInit {
  wards: Ward[] = [];
  filteredWards: Ward[] = [];
  wardForm!: FormGroup;
  isModalOpen = false;
  editMode = false;
  selectedWardId: string = '';
  searchTerm: string = '';
  selectedFile: File | null = null;

  private apiUrl = 'https://garbage-management-backend-qtya.onrender.com/api/wards';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.wardForm = this.fb.group({
      wardNumber: ['', Validators.required],
      taluk: ['', Validators.required],
      district: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
    });

    this.loadWards();
  }

  loadWards(): void {
    this.http.get<Ward[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Failed to load wards:', error);
        return of([]);
      })
    ).subscribe((data) => {
      this.wards = data;
      this.filteredWards = data;
    });
  }

  filterWards(): void {
    const searchTermLower = this.searchTerm.toLowerCase();

    this.filteredWards = this.wards.filter((ward) =>
      ward.wardNumber.toString().toLowerCase().includes(searchTermLower) ||
      ward.taluk.toLowerCase().includes(searchTermLower) ||
      ward.district.toLowerCase().includes(searchTermLower) ||
      ward.state.toLowerCase().includes(searchTermLower) ||
      ward.country.toLowerCase().includes(searchTermLower)
    );
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  async onSubmit(): Promise<void> {
    if (this.wardForm.valid) {
      const formData = new FormData();
      formData.append('wardNumber', this.wardForm.get('wardNumber')?.value);
      formData.append('taluk', this.wardForm.get('taluk')?.value);
      formData.append('district', this.wardForm.get('district')?.value);
      formData.append('state', this.wardForm.get('state')?.value);
      formData.append('country', this.wardForm.get('country')?.value);

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      try {
        if (this.editMode && this.selectedWardId) {
          console.log('Updating ward with ID:', this.selectedWardId);
          await this.http.put(`${this.apiUrl}/update/${this.selectedWardId}`, formData).toPromise();
          Swal.fire('Success', 'Ward updated successfully!', 'success');
        } else {
          const newWard = await this.http.post<Ward>(this.apiUrl, formData).toPromise();
          if (newWard) {
            this.wards.push(newWard);
            Swal.fire('Success', 'Ward added successfully!', 'success');
          }
        }

        this.loadWards();
        this.closeModal();
      } catch (error) {
        console.error('Failed to save ward:', error);
        Swal.fire('Error', 'Failed to save ward!', 'error');
      }
    }
  }

  deleteWard(index: number): void {
    const ward = this.filteredWards[index];
    
    if (!ward || !ward._id) {
      console.error('Ward or Ward ID is undefined:', ward);
      Swal.fire('Error', 'Invalid Ward ID!', 'error');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this ward!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Deleting ward with ID:', ward._id);
        this.http.delete(`${this.apiUrl}/delete/${ward._id}`).subscribe(() => {
          this.wards = this.wards.filter(w => w._id !== ward._id);
          this.filterWards();
          Swal.fire('Deleted!', 'Ward has been deleted.', 'success');
        }, (error) => {
          console.error('Failed to delete ward:', error);
          Swal.fire('Error', 'Failed to delete ward!', 'error');
        });
      }
    });
  }

  openModal(index?: number): void {
    this.isModalOpen = true;
    this.editMode = index !== undefined;
    this.selectedFile = null;

    if (this.editMode && index !== undefined) {
      const selectedWard = this.filteredWards[index];
      
      if (selectedWard && selectedWard._id) {
        this.selectedWardId = selectedWard._id;
        console.log('Selected ward for editing, ID:', this.selectedWardId);
        
        this.wardForm.patchValue({
          wardNumber: selectedWard.wardNumber,
          taluk: selectedWard.taluk,
          district: selectedWard.district,
          state: selectedWard.state,
          country: selectedWard.country,
        });
      } else {
        console.error('Selected ward does not have a valid ID:', selectedWard);
        Swal.fire('Error', 'Invalid ward selection!', 'error');
        this.closeModal();
      }
    } else {
      this.wardForm.reset();
      this.selectedWardId = '';
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedFile = null;
  }

  getImageUrl(imageName: string): string {
  return `https://garbage-management-backend-qtya.onrender.com/uploads/${imageName}`;
}
}