import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { RickAndMortyService } from '../../@core/service/rick-and-morty.service';
import { HttpClient } from '@angular/common/http';
import { Character, CharacterFilter } from '../../@core/models/rick-and-morty.model';
import { FilterMetadata } from 'primeng/api';
import { ImageLoadedPipe } from '../../@core/pipes/image-loaded.pipe';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-table-view',
  standalone: true,
  imports: [TableModule, ImageLoadedPipe, NgClass],
  providers: [HttpClient],
  templateUrl: './table-view.component.html',
  styleUrl: './table-view.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class TableViewComponent implements OnInit {
  private readonly rickAndMortyService = inject(RickAndMortyService);
  @ViewChild('table') table: Table | undefined;

  characters: Character[] = [];
  selectedItems: Character[] = [];
  filters: Partial<CharacterFilter> & { pageSize: number } = {
    name: '',
    type: '',
    page: 1,
    pageSize: 20,
  };
  totalCount = 0;
  loading = false;
  activeFilters: { key: string; isArray: boolean; }[] | undefined;
  private searchParams = new URLSearchParams();
  loadingStates: boolean[] = [];

  ngOnInit(): void {
    this.getCharacters();
  }

  getCharacters() {
    this.loadingStates = [];
    this.rickAndMortyService.getCharacters(this.searchParams.toString()).subscribe((characters) => {
      this.characters = characters.results;
      this.totalCount = characters.info.count;
      this.filters.page = characters.info.pages;
      this.loadingStates = Array(this.characters.length * this.filters.page).fill(true);
    });
  }

  onTableSelectionChange(event: any) {
    console.log(event);
    this.selectedItems = event;
  }

  onFilterChange() {
    if (!this.table) return;
    this.table.editingRowKeys = {};
    this.selectedItems = [];
    this.loading = true;
    this.mapTableFilterToFilter();
    this.activeFilters = this.getActiveFilters();
    this.searchParams = new URLSearchParams();
    this.buildSearchParams();
    this.getCharacters();
  }

  onPageChange(event: any) {
    this.selectedItems = [];
    this.table ? (this.table.editingRowKeys = {}) : null;
  }

  private mapTableFilterToFilter() {
    Object.entries(this.table!.filters as Record<string, FilterMetadata[]>).map(([key, value]) => { 
      this.filters[key as keyof CharacterFilter] = value[0].value;
    });
  }

  private getActiveFilters(): { key: string; isArray: boolean }[] | undefined {
    if (!this.table) return;
    return Object.entries(this.table.filters as Record<string, FilterMetadata[]>)
      .filter(([key, filterValue]) => {
        if (!filterValue[0].value) return false;
        if (key === 'sortBy') return false;
        return true;
      })
      .map(([key, filterValue]) => ({
        key,
        isArray: Array.isArray(filterValue[0].value) && filterValue[0].value.length > 0,
      }))
      .filter((item) => item.isArray || !Array.isArray((this.table!.filters as Record<string, FilterMetadata[]>)[item.key][0].value));
  }

  private createPaginationParams(first: number): void {
    this.filters.page = 1;
    this.filters.page = first / this.filters.pageSize + 1;
    this.searchParams.append('page', this.filters.page.toString());
  }

  private buildSearchParams(): void {
    const formatValue = (value: unknown) => {
      // if (value instanceof Date) {
      //   return this.datePipe.transform(value, 'yyyy-MM-dd') ?? '';
      // }
      return String(value);
    };

    const appendArrayValue = (key: string, array: unknown[]) => {
      array.forEach((item) => {
        if (Array.isArray(item)) {
          item.forEach((subItem) => this.searchParams.append(key, formatValue(subItem)));
        } else {
          this.searchParams.append(key, formatValue(item));
        }
      });
    };

    const appendFilterValue = (key: string, value: unknown) => {
      if (!value) return;
      if (Array.isArray(value)) {
        appendArrayValue(key, value);
      } else {
        this.searchParams.append(key, formatValue(value));
      }
    };

    this.createPaginationParams(this.table?.first || 0);

    Object.entries(this.table!.filters as Record<string, FilterMetadata[]>).forEach(([key, value]) => {
      const filterValue = value?.[0]?.value;
      if (filterValue) {
        appendFilterValue(key, filterValue);
      }
    });
  }

  onImageLoad(index: number) {
    this.loadingStates[index] = false;
  }

}
