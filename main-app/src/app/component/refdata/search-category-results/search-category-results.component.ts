import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {Subscription} from 'rxjs';
import {BIZ_BOTS_CONSTANTS} from '../../../model/Constants';
import {CategoryService} from '../../../service/category.service';
import {BaseBotComponent} from '../../common/baseBot.component';

@Component({
  selector: 'seeradmin-search-category-results',
  templateUrl: './search-category-results.component.html',
  styleUrls: ['./search-category-results.component.css']
})
export class SearchCategoryResultsComponent extends BaseBotComponent implements OnInit, OnDestroy {

  categoryResults: any[];
  searchCriteriaSubscription: Subscription;
  notificationSub: Subscription;
  searchContext = 'search_category';
  @ViewChild('saveCategorySuccess') saveCategorySuccess: ElementRef;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    injector: Injector
  ) {
    super(injector);
  }

  get categoryResultsGetter() {
    return this.categoryResults;
  }

  ngOnInit() {
    const searchCriteriaModel = this.categoryService.getSearchCriteriaModel();
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      this.searchCategory(searchCriteriaModel);
    });

    this.notificationSub = this.notificationService
      .onNotification()
      .subscribe((data: any) => {
        if (
          data.subscriberType === BIZ_BOTS_CONSTANTS.REFRESH_CATEGORY_SEARCH_RESULTS
        ) {
          this.router.navigate(['/ref-data/category/search'], {queryParams: {ts: (new Date()).getTime()}});
          this.showToast(this.saveCategorySuccess);
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

  editCategory(id: string) {
    this.router.navigate(['./edit', id], {relativeTo: this.activatedRoute});
  }

  getResourceLocal(key: string): string {
    return this.getResource('refData', key);
  }

  private searchCategory(model: any) {
    this.searchCriteriaSubscription = this.categoryService
      .searchCategoryForEdit(model)
      .subscribe(results => {
        this.categoryResults = results;
      });
  }

}
