import {booleanAttribute, Component, OnInit} from '@angular/core';
import {ReadingService} from '../../../services/reading.service';
import {NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomButtonComponent} from '../../../components/custom-button/custom-button.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgIcon} from '@ng-icons/core';
import {Reading} from '../../../types/reading';
import {KindOfMeter} from '../../../enums/kind-of-meter';
import {read} from '@popperjs/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ImportModalReadingComponent} from '../../../components/confirmation-modal/import-modal-reading';
import {ExportModalReadingComponent} from '../../../components/confirmation-modal/export-modal-reading';
import {Column} from '../../../types/column';
import {ConfigureColumnModal} from '../../../components/confirmation-modal/configure-column-modal';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Customer} from '../../../types/customer';

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
  public substituteFilter?: boolean;
  public orderBy?: string;
  public orderDirection?: string;

  public columns: Column<Reading>[] = [
    {
      name: "id",
      displayName: "ID",
      getValue: reading => reading.id,
      show: false,
      canSort: false,
    },
    {
      name: "customerId",
      displayName: "Customer ID",
      getValue: reading => reading.customer.id,
      show: false,
      canSort: false,
    },
    {
      name: "customerName",
      displayName: "Customer Name",
      getValue: reading => `${reading.customer.firstName} ${reading.customer.lastName}`,
      show: true,
      canSort: false,
    },
    {
      name: "dateOfReading",
      displayName: "Date",
      getValue: reading => reading.dateOfReading.toString(),
      show: true,
      canSort: true,
    },
    {
      name: "meterId",
      displayName: "Meter ID",
      getValue: reading => reading.meterId,
      show: true,
      canSort: true,
    },
    {
      name: "meterCount",
      displayName: "Meter Count",
      getValue: reading => reading.meterCount.toString(),
      show: true,
      canSort: true,
    },
    {
      name: "kindOfMeter",
      displayName: "Meter Type",
      getValue: reading => reading.kindOfMeter,
      show: true,
      canSort: true,
    },
    {
      name: "comment",
      displayName: "Comment",
      getValue: reading => reading.comment,
      show: true,
      canSort: true,
    },
    {
      name: "substitute",
      displayName: "Substitute",
      getValue: reading => reading.substitute ? 'true' : 'false',
      show: true,
      canSort: true,
    },
  ];

  public kindOfMeter(): string[] {
    return Object.keys(KindOfMeter);
  }

  private updateQueryParams(): void {

    const substitute = this.substituteFilter !== undefined ? this.substituteFilter : null;

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
        queryParams: {q: query, kindOfMeter: kindOfMeter, substitute: substitute, orderBy: orderBy, desc: desc},
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
    this.substituteFilter = undefined;
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
    this.route.queryParamMap.subscribe(params => {
      this.query = params.get('q') ?? '';

      const kindOfMeter = params.get('kindOfMeter');
      this.kindOfMeterFilter = kindOfMeter ? KindOfMeter[kindOfMeter.toUpperCase() as keyof typeof KindOfMeter] : undefined;

      this.orderBy = params.get('orderBy') ?? '';
      this.orderDirection = params.get('desc') === 'true' ? 'desc' : 'asc';

      const substitute = params.get('substitute');
      this.substituteFilter = substitute === 'undefined' ? undefined : substitute === 'true';

      this.loadReadings();
    });

    if (this.query || this.kindOfMeterFilter) {
      this.showFilters = true;
    }
  }


  private loadReadings(): void {
    this.readingService.all().subscribe(readings => {
      this.readings = readings.filter(readings => {
        return (!this.kindOfMeterFilter || readings.kindOfMeter === this.kindOfMeterFilter)
          && (!this.query || this.searchQuery(readings))
          && (this.substituteFilter === undefined || readings.substitute === Boolean(this.substituteFilter)
          );
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

  public showConfigureColumnsModal() {
    const modal = this.modalService.open(ConfigureColumnModal);
    modal.componentInstance.columns = this.columns;
    modal.componentInstance.okButtonClosure((columns: Column<Reading>[]) => this.columns = columns);
  }

  private searchQuery(readings: Reading): boolean {
    return readings.id.includes(this.query ?? '') ||
      (String(readings.dateOfReading)?.includes(this.query ?? '') ?? false) ||
      readings.meterId.toLowerCase().includes(this.query?.toLowerCase() ?? '') ||
      String(readings.meterCount).includes(this.query?.toLowerCase() ?? '') ||
      readings.comment.toLowerCase().includes(this.query?.toLowerCase() ?? '') ||
      String(readings.substitute).includes(this.query?.toLowerCase() ?? '');
  }

  public storeImport() {
    const modal = this.modalService.open(ImportModalReadingComponent);
    modal.componentInstance.okButtonClosure = (data: Reading[]) => {
      this.processData(data);
    };
  }

  private processData(data: Reading[]) {
    data.forEach((record, index) => {
      this.readingservice.store(record.customer, record.dateOfReading, record.meterId, parseFloat(record.meterCount.toString()), record.kindOfMeter, record.comment, record.substitute).subscribe({
        next: () => {
          if (index === data.length - 1) {
            this.router.navigate(['/readings']).then();
          }
        },
        error: (error) => {
          console.error(error);
        },
      });
    });
  }
  public openExportMenu() {
    const modalRef = this.modalService.open(ExportModalReadingComponent);
    modalRef.componentInstance.readings = this.readings;
  }

  constructor(private readingservice: ReadingService,
              public router: Router,
              private route: ActivatedRoute,
              private modalService: NgbModal) {
  }
}
