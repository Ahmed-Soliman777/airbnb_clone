import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ListingService } from '../../Services/listing.service';
import { Listing as ListingModel } from '../../Models/listing';

@Component({
  selector: 'app-listing',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './listing.html',
  styleUrl: './listing.css',
})
export class Listing implements OnInit {
  private listingService = inject(ListingService);

  // Expose Math to template
  Math = Math;

  // Data
  listings: ListingModel[] = [];
  filteredListings: ListingModel[] = [];
  selectedListing: ListingModel | null = null;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  // Filters
  searchQuery = '';
  selectedPropertyType = '';
  propertyTypes = ['apartment', 'house', 'villa', 'shared_room', 'private_room'];

  // Modal states
  showViewModal = false;
  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;

  // Loading and error states
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Form data
  formData: Partial<ListingModel> = this.getEmptyFormData();

  ngOnInit() {
    this.loadListings();
  }

  loadListings() {
    this.isLoading = true;
    this.errorMessage = '';

    this.listingService
      .getListings({
        page: this.currentPage,
        limit: this.itemsPerPage,
        search: this.searchQuery,
        propertyType: this.selectedPropertyType,
      })
      .subscribe({
        next: (response) => {
          this.listings = response.data;
          this.filteredListings = response.data;
          this.totalItems = response.total || 0;
          this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load listings: ' + error.message;
          this.isLoading = false;
        },
      });
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadListings();
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedPropertyType = '';
    this.currentPage = 1;
    this.loadListings();
  }

  // Pagination
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadListings();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadListings();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadListings();
    }
  }

  // CRUD Operations
  openViewModal(listing: ListingModel) {
    this.selectedListing = listing;
    this.showViewModal = true;
  }

  openAddModal() {
    this.formData = this.getEmptyFormData();
    this.showAddModal = true;
  }

  openEditModal(listing: ListingModel) {
    this.selectedListing = listing;
    this.formData = { ...listing };
    this.showEditModal = true;
  }

  openDeleteModal(listing: ListingModel) {
    this.selectedListing = listing;
    this.showDeleteModal = true;
  }

  closeModals() {
    this.showViewModal = false;
    this.showAddModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.selectedListing = null;
    this.errorMessage = '';
  }

  createListing() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.listingService.createListing(this.formData).subscribe({
      next: (response) => {
        this.successMessage = 'Listing created successfully!';
        this.closeModals();
        this.loadListings();
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (error) => {
        this.errorMessage = 'Failed to create listing: ' + error.message;
        this.isLoading = false;
      },
    });
  }

  updateListing() {
    if (!this.selectedListing?._id || !this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.listingService.updateListing(this.selectedListing._id, this.formData).subscribe({
      next: (response) => {
        this.successMessage = 'Listing updated successfully!';
        this.closeModals();
        this.loadListings();
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (error) => {
        this.errorMessage = 'Failed to update listing: ' + error.message;
        this.isLoading = false;
      },
    });
  }

  deleteListing() {
    if (!this.selectedListing?._id) {
      return;
    }

    this.isLoading = true;
    this.listingService.deleteListing(this.selectedListing._id).subscribe({
      next: (response) => {
        this.successMessage = 'Listing deleted successfully!';
        this.closeModals();
        this.loadListings();
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete listing: ' + error.message;
        this.isLoading = false;
      },
    });
  }

  // Helper methods
  validateForm(): boolean {
    if (!this.formData.title?.en || !this.formData.title?.ar) {
      this.errorMessage = 'Title in both languages is required';
      return false;
    }
    if (!this.formData.description?.en || !this.formData.description?.ar) {
      this.errorMessage = 'Description in both languages is required';
      return false;
    }
    if (!this.formData.propertyType) {
      this.errorMessage = 'Property type is required';
      return false;
    }
    if (!this.formData.pricePerNight || this.formData.pricePerNight <= 0) {
      this.errorMessage = 'Valid price per night is required';
      return false;
    }
    if (!this.formData.maxGuests || this.formData.maxGuests <= 0) {
      this.errorMessage = 'Valid max guests is required';
      return false;
    }
    return true;
  }

  getEmptyFormData(): Partial<ListingModel> {
    return {
      title: { en: '', ar: '' },
      description: { en: '', ar: '' },
      propertyType: 'apartment',
      address: {
        street: '',
        city: '',
        country: '',
        coordinates: { lat: 0, lng: 0 },
      },
      pricePerNight: 0,
      cleaningFee: 0,
      maxGuests: 1,
      bedrooms: 1,
      bathrooms: 1,
      images: [],
      amenities: [],
      highlightFeatures: [],
      hostId: '',
    };
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  getPropertyTypeLabel(type: string): string {
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Computed properties for statistics
  get averageRating(): number {
    if (this.listings.length === 0) return 0;
    const sum = this.listings.reduce((acc, l) => acc + (l.ratingAvg || 0), 0);
    return sum / this.listings.length;
  }

  get averagePricePerNight(): number {
    if (this.listings.length === 0) return 0;
    const sum = this.listings.reduce((acc, l) => acc + (l.pricePerNight || 0), 0);
    return sum / this.listings.length;
  }

  get paginationStart(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get paginationEnd(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }
}
