import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { RickAndMortyService } from '../../@core/service/rick-and-morty.service';
import { HttpClient } from '@angular/common/http';
import { Character } from '../../@core/models/rick-and-morty.model';
@Component({
  selector: 'app-table-view',
  standalone: true,
  imports: [TableModule],
  providers: [HttpClient],
  templateUrl: './table-view.component.html',
  styleUrl: './table-view.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class TableViewComponent implements OnInit {
  private readonly rickAndMortyService = inject(RickAndMortyService);
  characters: Character[] = [];

  ngOnInit(): void {
    this.rickAndMortyService.getCharacters().subscribe((characters) => {
      this.characters = characters;
    });
  }
}
