import {
  Component,
  OnInit,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { AlbumsService } from '../../core/albums.service';
import { Albums } from '../../common/interfaces/albums';
import {
  catchError,
  delay,
  filter,
  finalize,
  lastValueFrom,
  of,
  timeout,
} from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SpinnerComponent } from '../common/spinner/spinner.component';
import { SpinnerService } from '../../core/spinner.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [AsyncPipe, SpinnerComponent],
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.css',
})
export class AlbumsComponent implements OnInit {
  private _albumsService: AlbumsService = inject(AlbumsService);
  private _spinnerService: SpinnerService = inject(SpinnerService);

  // RXJS operators
  public albums$ = this._albumsService.getAlbums();
  public albumsData: Albums[] = [];

  //WritableSignals
  public albums: WritableSignal<Albums[]> = signal<Albums[]>([]);
  public isLoading: WritableSignal<boolean> = signal<boolean>(false);

  //Computed Signals
  public numberOfAlbums: Signal<number> = computed(() => {
    return this.albums().length;
  });

  private newAlbum: Albums = {
    id: 12,
    title: 'Este es el nuevo album',
    userId: 1,
  };

  constructor() {
    // When the signal albums change, this will refresh
    effect(() => {
      console.log(`The current albums are: ${this.albums().length}`);
    });
  }

  ngOnInit() {}

  async getAlbums(): Promise<void> {
    this._spinnerService.show();
    try {
      this.albums.set(await lastValueFrom(this._albumsService.getAlbums()));
    } catch (error) {
      console.log(error);
    }
    this._spinnerService.hide();
  }

  async getAlbumsObservable(): Promise<void> {
    this._spinnerService.show();

    this.albums$
      .pipe(
        delay(2000),
        catchError((error) => {
          console.error('Error:', error);
          return of([]);
        }),
        finalize(() => this._spinnerService.hide())
      )
      .subscribe((albums) => {
        this.albumsData = albums;
      });
  }

  logAlbums() {
    console.log(this.albums());
  }

  addAlbum(): void {
    this.albums.update((albums) => [...albums, this.newAlbum]);
  }

  editAlbum(): void {
    this.albums.update((albums) => {
      var album = albums.find((album) => album.id === 1);
      album !== undefined
        ? (album.title = 'Nuevo título para el álbum con id 1')
        : null;
      return albums;
    });
  }

  deleteAlbum(): void {
    this.albums.update((albums) => {
      return albums.filter((album) => album.title !== 'omnis laborum odio');
    });
  }
}
