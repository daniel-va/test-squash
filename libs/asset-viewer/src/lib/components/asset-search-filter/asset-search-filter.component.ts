import { Component, inject, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as actions from '../../state/asset-search/asset-search.actions';
import { AppStateWithAssetSearch } from '../../state/asset-search/asset-search.reducer';
import { Filter } from '../../state/asset-search/asset-search.selector';

@Component({
  selector: 'asset-sg-asset-search-filter',
  templateUrl: './asset-search-filter.component.html',
  styleUrls: ['./asset-search-filter.component.scss'],
  standalone: false,
})
export class AssetSearchFilterComponent<T> {
  @Input({ required: true })
  filters!: Array<Filter<T>>;

  private readonly store = inject(Store<AppStateWithAssetSearch>);

  toggle(filter: Filter<T>): void {
    const activeValues = new Set(this.filters.filter((it) => it.isActive).map((it) => it.value));
    if (activeValues.has(filter.value)) {
      activeValues.delete(filter.value);
    } else {
      activeValues.add(filter.value);
    }
    this.store.dispatch(
      actions.updateSearchQuery({
        query: { [filter.queryKey]: activeValues.size > 0 ? [...activeValues] : undefined },
      })
    );
  }
}
