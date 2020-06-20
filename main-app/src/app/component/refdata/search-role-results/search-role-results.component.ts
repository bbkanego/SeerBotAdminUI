import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {Subscription} from 'rxjs';
import {BIZ_BOTS_CONSTANTS} from '../../../model/Constants';
import {RoleService} from '../../../service/role.service';
import {BaseBotComponent} from '../../common/baseBot.component';

@Component({
  selector: 'app-search-role-results',
  templateUrl: './search-role-results.component.html',
  styleUrls: ['./search-role-results.component.css']
})
export class SearchRoleResultsComponent extends BaseBotComponent implements OnInit, OnDestroy {

  roleResults: any[];
  searchCriteriaSubscription: Subscription;
  notificationSub: Subscription;
  searchContext = 'searchRoles';

  constructor(
    private roleService: RoleService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      this.searchRoles();
    });

    this.notificationSub = this.notificationService
      .onNotification()
      .subscribe((data: any) => {
        if (data.subscriberType === BIZ_BOTS_CONSTANTS.REFRESH_ROLE_SEARCH_RESULTS) {
          this.router.navigate(['/ref-data/role/search'], {queryParams: {ts: (new Date()).getTime()}});
        }
      });
  }

  ngOnDestroy(): void {
    if (this.searchCriteriaSubscription) {
      this.searchCriteriaSubscription.unsubscribe();
    }
    if (this.notificationSub) {
      this.notificationSub.unsubscribe();
    }
  }

  editRole(id: string) {
    this.router.navigate(['edit', id], {
      relativeTo: this.activatedRoute
    });
  }

  getResourceLocal(key: string): string {
    return this.getResource('refData', key);
  }

  private searchRoles() {
    this.searchCriteriaSubscription = this.roleService
      .getAll()
      .subscribe(results => {
        this.roleResults = results;
      });
  }

}
