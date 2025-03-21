import {Injectable} from '@angular/core';
import {Reading} from '../types/reading';
import {ApiRessourceService} from './api-ressource.service';
import {ReadingData} from '../types/reading.data';

@Injectable({
  providedIn: 'root'
})
export class ReadingService extends ApiRessourceService<Reading, ReadingData> {
  override path = 'readings';
}
