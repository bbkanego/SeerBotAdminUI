import {Injectable, Injector} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../environments/frozenEnvironment';
import {BaseBotCrudService} from './baseBotCrud.service';

@Injectable()
export class CategoryService extends BaseBotCrudService {
  searchCriteriaModel: any = {};

  constructor(injector: Injector) {
    super(injector);
  }

  initModel(): Observable<any> {
    return this.getRequest(environment.INIT_CATEGORY_URL);
  }

  setSearchCriteriaModel(model) {
    this.searchCriteriaModel = model;
  }

  getSearchCriteriaModel() {
    return this.searchCriteriaModel;
  }

  searchCategoryForEdit(model: any): Observable<any> {
    return this.getRequest(environment.GET_FOR_EDIT_CATEGORY_URL);
  }

  save(model: any): Observable<any> {
    return this.postRequest(environment.SAVE_CATEGORY_URL, model);
  }

  delete(id: string): Observable<any> {
    return this.deleteRequest(environment.SAVE_CATEGORY_URL, id);
  }

  update(model: any): Observable<any> {
    return this.postRequest(environment.SAVE_CATEGORY_URL, model);
  }

  getById(id: string): Observable<any> {
    return this.getRequest(environment.SAVE_CATEGORY_URL + '/' + id);
  }

  getAll(): Observable<any[]> {
    return this.getCategoriesForEdit();
  }

  getCategoriesForEdit(): Observable<any[]> {
    return this.getRequest(environment.GET_FOR_EDIT_CATEGORY_URL);
  }
}
