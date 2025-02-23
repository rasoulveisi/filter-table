import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageLoaded',
  standalone: true,
  pure: true
})
export class ImageLoadedPipe implements PipeTransform {
  transform(imageIds: Set<number>, characterId: number): boolean {
    return imageIds.has(characterId);
  }
}