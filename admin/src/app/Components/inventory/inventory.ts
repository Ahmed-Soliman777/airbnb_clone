import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ListingService } from '../../Services/listing.service';
import { ExperienceService } from '../../Services/experience.service';
import { ServiceService } from '../../Services/service.service';
import { Listing as ListingModel } from '../../Models/listing';
import { Experience } from '../../Models/experience';
import { Service } from '../../Models/service';
import { ViewListingModalComponent } from './view-inventory-modal/view-inventory-modal';
import { EditListingModalComponent } from './edit-inventory-modal/edit-inventory-modal';
import { DeleteListingModalComponent } from './delete-inventory-modal/delete-inventory-modal';
import { InventoryHeaderComponent } from './inventory-header/inventory-header';
import { InventoryStatsComponent } from './inventory-stats/inventory-stats';
import { InventorySearchFiltersComponent } from './inventory-search-filters/inventory-search-filters';
import { InventoryTableComponent } from './inventory-table/inventory-table';
import { InventoryPaginationComponent } from './inventory-pagination/inventory-pagination';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ViewListingModalComponent,
    EditListingModalComponent,
    DeleteListingModalComponent,
    InventoryHeaderComponent,
    InventoryStatsComponent,
    InventorySearchFiltersComponent,
    InventoryTableComponent,
    InventoryPaginationComponent,
  ],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
})
export class Inventory implements OnInit, OnDestroy {
  private listingService = inject(ListingService);
  private experienceService = inject(ExperienceService);
  private serviceService = inject(ServiceService);
  private router = inject(Router);
  //cdr used for manual change detection after async data loads
  private cdr = inject(ChangeDetectorRef);
  private routerSubscription?: Subscription;

  // Expose Math to template
  Math = Math;

  // Data
  listings: ListingModel[] = [];
  experiences: Experience[] = [];
  services: Service[] = [];
  allItems: any[] = []; // Combined array of all types
  filteredListings: any[] = [];
  selectedListing: ListingModel | null = null;
  totalListingsFromDB = 0; // Total listings count from database
  totalExperiencesFromDB = 0; // Total experiences count from database
  totalServicesFromDB = 0; // Total services count from database
  listingsGrowth = 0; // Growth percentage for listings
  experiencesGrowth = 0; // Growth percentage for experiences
  servicesGrowth = 0; // Growth percentage for services

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
    // Subscribe to router events to reload data when navigating to this route
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Only reload if we're on the listing route
        if (this.router.url.includes('/listing')) {
          this.loadData();
        }
      });

    // Initial data load
    this.loadData();
  }

  ngOnDestroy() {
    // Clean up subscription to prevent memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private loadData() {
    this.loadAllItems();
    this.loadListingStats();
    this.loadExperienceStats();
    this.loadServiceStats();
  }

  loadListingStats() {
    // console.log('Loading listing stats from:', this.listingService);
    this.listingService.getListingStats().subscribe({
      next: (response) => {
        // console.log('Stats response received:', JSON.stringify(response));
        // console.log('Response data:', response.data);
        // console.log('Total listings:', response.data?.totalListings);
        if (response && response.data && response.data.totalListings !== undefined) {
          this.totalListingsFromDB = response.data.totalListings;
          this.listingsGrowth = response.data.growthPercentage || 0;
          this.cdr.detectChanges();
        } else {
          console.warn('Unexpected response structure:', response);
        }
      },
      error: (error) => {
        console.error('Failed to load listing stats:', error);
      },
    });
  }

  loadExperienceStats() {
    this.experienceService.getExperienceStats().subscribe({
      next: (response) => {
        if (response && response.data && response.data.totalExperiences !== undefined) {
          this.totalExperiencesFromDB = response.data.totalExperiences;
          this.experiencesGrowth = response.data.growthPercentage || 0;
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Failed to load experience stats:', error);
      },
    });
  }

  loadServiceStats() {
    this.serviceService.getServiceStats().subscribe({
      next: (response) => {
        console.log('Service stats response:', response);
        console.log('Growth percentage:', response.data?.growthPercentage);
        if (response && response.data && response.data.totalServices !== undefined) {
          this.totalServicesFromDB = response.data.totalServices;
          this.servicesGrowth = response.data.growthPercentage || 0;
          console.log('Set servicesGrowth to:', this.servicesGrowth);
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Failed to load service stats:', error);
      },
    });
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

  loadAllItems() {
    this.isLoading = true;
    this.errorMessage = '';

    // Use Promise.all or forkJoin to load all three types
    Promise.all([
      this.listingService
        .getListings({
          page: 1,
          limit: 1000,
          search: this.searchQuery,
          propertyType: this.selectedPropertyType,
        })
        .toPromise(),
      this.experienceService
        .getExperiences({
          page: 1,
          limit: 1000,
          search: this.searchQuery,
        })
        .toPromise(),
      this.serviceService
        .getServices({
          page: 1,
          limit: 1000,
          search: this.searchQuery,
        })
        .toPromise(),
    ])
      .then(([listingsRes, experiencesRes, servicesRes]) => {
        // Add type identifier to each item
        this.listings = (listingsRes?.data || []).map((item: any) => ({
          ...item,
          itemType: 'listing',
        }));
        this.experiences = (experiencesRes?.data || []).map((item: any) => ({
          ...item,
          itemType: 'experience',
        }));
        this.services = (servicesRes?.data || []).map((item: any) => ({
          ...item,
          itemType: 'service',
        }));

        // Combine all items
        this.allItems = [...this.listings, ...this.experiences, ...this.services];

        // Apply pagination to combined items
        this.totalItems = this.allItems.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.updatePaginatedItems();

        this.isLoading = false;
        // Manually trigger change detection
        this.cdr.detectChanges();
      })
      .catch((error) => {
        this.errorMessage = 'Failed to load items: ' + (error?.message || 'Unknown error');
        this.isLoading = false;
        // Manually trigger change detection even on error
        this.cdr.detectChanges();
      });
  }

  updatePaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredListings = this.allItems.slice(startIndex, endIndex);
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadAllItems();
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedPropertyType = '';
    this.currentPage = 1;
    this.loadAllItems();
  }

  // Pagination
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedItems();
    }
  }

  getPaginationPages(): number[] {
    const maxPagesToShow = 5;
    const pages: number[] = [];
    const pagesToShow = Math.min(this.totalPages, maxPagesToShow);

    for (let i = 1; i <= pagesToShow; i++) {
      pages.push(i);
    }

    return pages;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedItems();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedItems();
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

  exportData() {
    console.log('Exporting data...');
    // TODO: Implement export functionality
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
    this.errorMessage = '';
    this.listingService.createListing(this.formData).subscribe({
      next: (response) => {
        this.successMessage = 'Listing created successfully!';
        this.closeModals();
        this.loadAllItems();
        this.loadListingStats(); // Refresh stats
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
    this.errorMessage = '';
    this.listingService.updateListing(this.selectedListing._id, this.formData).subscribe({
      next: (response) => {
        this.successMessage = 'Listing updated successfully!';
        this.closeModals();
        this.loadAllItems();
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
    this.errorMessage = '';
    this.listingService.deleteListing(this.selectedListing._id).subscribe({
      next: (response) => {
        this.successMessage = 'Listing deleted successfully!';
        this.closeModals();
        this.loadAllItems();
        this.loadListingStats(); // Refresh stats
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

  getItemTypeLabel(item: any): string {
    if (item.itemType === 'listing') {
      return this.getPropertyTypeLabel(item.propertyType || 'listing');
    } else if (item.itemType === 'experience') {
      return item.experienceType || 'Experience';
    } else if (item.itemType === 'service') {
      return item.serviceCategory || 'Service';
    }
    return 'Unknown';
  }

  getItemPrice(item: any): string {
    if (item.itemType === 'listing') {
      return `$${item.pricePerNight}/night`;
    } else if (item.itemType === 'experience') {
      return `$${item.pricePerPerson || 0}/person`;
    } else if (item.itemType === 'service') {
      return `$${item.hourlyRate || 0}/hour`;
    }
    return 'N/A';
  }

  getItemImage(item: any): string {
    if (item.images && item.images.length > 0) {
      return item.images[0].url;
    }
    return 'https://via.placeholder.com/60';
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
