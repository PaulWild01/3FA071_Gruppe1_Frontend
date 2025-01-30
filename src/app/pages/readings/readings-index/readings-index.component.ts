import {Component, OnInit} from '@angular/core';
import {ReadingService} from '../../../services/reading.service';
import {NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomButtonComponent} from '../../../components/custom-button/custom-button.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgIcon} from '@ng-icons/core';
import {Reading} from '../../../types/reading';
import {KindOfMeter} from '../../../enums/kind-of-meter';
import {read} from '@popperjs/core';

@Component({
  selector: 'app-customer-index',
  imports: [
    NgForOf,
    CustomButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgIcon
  ],
  templateUrl: './readings-index.component.html',
  styles: `
    tr.readings {
      cursor: pointer;
    }
  `
})
export class ReadingsIndexComponent implements OnInit {
  public readings: Reading[] = [];
  public showFilters = false;
  public query?: string;
  public kindOfMeterFilter?: KindOfMeter;

  public orderBy?: string;
  public orderDirection?: string;

  public kindOfMeter(): string[] {
    return Object.keys(KindOfMeter);
  }

  private updateQueryParams(): void {
    if (this.kindOfMeterFilter && String(this.kindOfMeterFilter).toUpperCase() === 'UNDEFINED') {
      this.kindOfMeterFilter = undefined;
    }
    const kindOfMeter = this.kindOfMeterFilter ? String(this.kindOfMeterFilter).toUpperCase() : null;

    if (this.query === '') {
      this.query = undefined;
    }
    const query = this.query ? this.query : null;

    const orderBy = this.orderBy ? this.orderBy : null;

    const desc = this.orderDirection === 'desc' ? true : null;

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {q: query, kindOfMeter: kindOfMeter, orderBy: orderBy, desc: desc},
        queryParamsHandling: 'merge'
      }
    ).then();

  }

  public applyFilters(): void {
    this.updateQueryParams();
    this.loadReadings();
  }

  public clearFilters(): void {
    this.query = undefined;
    this.kindOfMeterFilter = undefined;
    this.updateQueryParams();
    this.loadReadings();
  }

  public changeOrderBy(orderBy: string): void {
    if (this.orderBy === orderBy) {
      if (!this.orderDirection) {
        this.setOrderBy(this.orderBy, 'desc')
        return;
      }

      if (this.orderDirection === 'desc') {
        this.setOrderBy(this.orderBy, 'asc')
        return;
      }

      this.setOrderBy(undefined, undefined);
      return;
    }

    this.setOrderBy(orderBy, 'desc');
  }

  private setOrderBy(orderBy?: string, orderDirection?: string) {
    this.orderBy = orderBy;
    this.orderDirection = orderDirection;
    this.loadReadings();
    this.updateQueryParams();
  }

  ngOnInit() {
    this.query = this.route.snapshot.queryParams['q'];

    const kindOfMeter: string | undefined = this.route.snapshot.queryParams['kindOfMeter'];
    this.kindOfMeterFilter = kindOfMeter ? KindOfMeter[kindOfMeter.toUpperCase() as keyof typeof KindOfMeter] : undefined;

    this.orderBy = this.route.snapshot.queryParams['orderBy'];
    this.orderDirection = this.route.snapshot.queryParams['desc'] === 'true' ? 'desc' : 'asc';

    this.loadReadings();

    if (this.query || this.kindOfMeterFilter) {
      this.showFilters = true;
    }
  }

  private loadReadings(): void {
    this.readingservice.all().subscribe(readings => {
      this.readings = readings.filter(readings => {
        return (!this.kindOfMeterFilter || readings.kindOfMeter === this.kindOfMeterFilter) && (!this.query || this.searchQuery(readings));
      }).sort((a, b): number => {
        if (!this.orderBy) {
          return 0;
        }

        const orderBy: string = this.orderBy ?? '';
        const value: number = this.orderDirection === 'desc' ? 1 : -1;

        if (this.orderBy === 'dateOfReading') {
          if (!a.dateOfReading && !b.dateOfReading) {
            return 0;
          }

          if (!a.dateOfReading) {
            return 1;
          }

          if (!b.dateOfReading) {
            return -1;
          }

          const aDateOfReading = new Date(a.dateOfReading ?? '');
          const bDateOfReading = new Date(b.dateOfReading ?? '');
          return aDateOfReading > bDateOfReading ? -value : value;
        }

        return (a[orderBy as keyof Reading] ?? '') > (b[orderBy as keyof Reading] ?? '') ? -value : value;
      });
    });
  }

  private searchQuery(readings: Reading): boolean {
    return readings.id.includes(this.query ?? '') ||
      (String(readings.dateOfReading)?.includes(this.query ?? '') ?? false) ||
      readings.meterId.toLowerCase().includes(this.query?.toLowerCase() ?? '') ||
      String(readings.meterCount).includes(this.query?.toLowerCase() ?? '') ||
      readings.comment.toLowerCase().includes(this.query?.toLowerCase() ?? '') ||
      String(readings.substitute).includes(this.query?.toLowerCase() ?? '');
  }

  constructor(private readingservice: ReadingService, public router: Router, private route: ActivatedRoute) {
  }

  protected readonly KindOfMeter = KindOfMeter;
  protected readonly read = read;
}
