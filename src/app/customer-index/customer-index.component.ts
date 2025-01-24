import {Component, OnInit} from '@angular/core';
import {CustomerService} from '../services/customer.service';
import {Customer} from '../types/customer';
import {NgClass, NgForOf} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {PaginationLink} from '../types/pagination-link';
import {Paginator} from '../types/paginator';

@Component({
  selector: 'app-customer-index',
  imports: [
    NgForOf,
    RouterLink,
    NgClass
  ],
  templateUrl: './customer-index.component.html',
  styleUrl: './customer-index.component.css'
})
export class CustomerIndexComponent implements OnInit {
  public paginator!: Paginator<Customer>;
  public paginationLinks: PaginationLink[] = [];

  constructor(private customerService: CustomerService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let page = Number(params["page"]);

      if (!page || page < 1) {
        page = 1;
      }

      this.customerService.all(page).subscribe(paginator => {
        this.paginator = paginator;
        this.paginationLinks = [];

        if (this.paginator.currentPage !== 1) {
          this.paginationLinks.push({
            link: "/customers",
            page: 1,
            label: "1",
            active: false,
            disabled: false
          });
        }

        if (paginator.currentPage > 2) {
          this.paginationLinks.push({
            link: null,
            page: null,
            label: "...",
            active: false,
            disabled: true
          });

          this.paginationLinks.push({
            link: "/customers",
            page: paginator.currentPage - 1,
            label: `${paginator.currentPage - 1}`,
            active: false,
            disabled: false
          });
        }

        this.paginationLinks.push({
          link: "/customers",
          page: paginator.currentPage,
          label: `${paginator.currentPage}`,
          active: true,
          disabled: false
        });

        if (paginator.currentPage < (paginator.lastPage - 1)) {
          this.paginationLinks.push({
            link: "/customers",
            page: paginator.currentPage + 1,
            label: `${paginator.currentPage + 1}`,
            active: false,
            disabled: false
          });
        }

        if (paginator.currentPage < (paginator.lastPage - 2)) {
          this.paginationLinks.push({
            link: null,
            page: null,
            label: "...",
            active: false,
            disabled: true
          });
        }

        if (paginator.currentPage < paginator.lastPage) {
          this.paginationLinks.push({
            link: "/customers",
            page: paginator.lastPage,
            label: `${paginator.lastPage}`,
            active: false,
            disabled: false
          });
        }
      });
    })
  }
}
