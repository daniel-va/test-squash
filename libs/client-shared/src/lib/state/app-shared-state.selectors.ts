import { Contact, emptyValueItem, ReferenceData, valueItemRecordToArray } from '@asset-sg/shared';
import * as RD from '@devexperts/remote-data-ts';
import { getRouterSelectors } from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';
import * as A from 'fp-ts/Array';
import { flow, pipe } from 'fp-ts/function';
import { contramap } from 'fp-ts/Ord';
import * as R from 'fp-ts/Record';
import * as S from 'fp-ts/string';

import { AppState } from './app-shared-state';

const appSharedFeature = (state: AppState) => state.shared;

export const selectRDReferenceData = createSelector(appSharedFeature, (state) => state.rdReferenceData);

export const selectIsAnonymousMode = createSelector(appSharedFeature, (state) => state.isAnonymousMode);

export const selectHasConsentedToTracking = createSelector(appSharedFeature, (state) => state.hasConsentedToTracking);

export const selectRDUserProfile = createSelector(appSharedFeature, (state) => state.rdUserProfile);

export const selectUser = createSelector(selectRDUserProfile, RD.toNullable);

export const selectWorkgroups = createSelector(appSharedFeature, (state) => state.workgroups);

const _makeReferenceDataVM = (referenceData: ReferenceData) => ({
  ...referenceData,
  assetFormItemArray: valueItemRecordToArray(referenceData.assetFormatItems),
  assetKindItemArray: valueItemRecordToArray(referenceData.assetKindItems),
  languageItemArray: valueItemRecordToArray(referenceData.languageItems),
  manCatLabelItemsArray: valueItemRecordToArray(referenceData.manCatLabelItems),
  statusAssetUseItemsArray: valueItemRecordToArray(referenceData.statusAssetUseItems),
  natRelItemsArray: valueItemRecordToArray(referenceData.natRelItems),
  contactKindItemsArray: valueItemRecordToArray(referenceData.contactKindItems),
  statusWorkItemsArray: valueItemRecordToArray(referenceData.statusWorkItems),
  contactsArray: pipe(
    referenceData.contacts,
    R.toArray,
    A.sort(contramap((a: [string, Contact]) => a[1].name)(S.Ord)),
    A.map((a) => a[1])
  ),
});
export type ReferenceDataVM = ReturnType<typeof _makeReferenceDataVM>;

export const emptyReferenceDataVM: ReferenceDataVM = {
  assetFormatItems: {},
  assetKindItems: {},
  autoCatLabelItems: {},
  autoObjectCatItems: {},
  geomQualityItems: {},
  languageItems: {},
  legalDocItems: {},
  manCatLabelItems: {},
  natRelItems: {},
  pubChannelItems: {},
  statusAssetUseItems: {
    tobechecked: emptyValueItem,
    underclarification: emptyValueItem,
    approved: emptyValueItem,
  },
  statusWorkItems: {},
  contactKindItems: {},
  contacts: {},
  assetFormItemArray: [],
  assetKindItemArray: [],
  languageItemArray: [],
  manCatLabelItemsArray: [],
  statusAssetUseItemsArray: [],
  natRelItemsArray: [],
  contactKindItemsArray: [],
  contactsArray: [],
  statusWorkItemsArray: [],
};

export const selectRDReferenceDataVM = createSelector(
  selectRDReferenceData,
  flow(
    RD.map((referenceData) => ({
      ...referenceData,
      assetFormItemArray: valueItemRecordToArray(referenceData.assetFormatItems),
      assetKindItemArray: valueItemRecordToArray(referenceData.assetKindItems),
      languageItemArray: valueItemRecordToArray(referenceData.languageItems),
      manCatLabelItemsArray: valueItemRecordToArray(referenceData.manCatLabelItems),
      statusAssetUseItemsArray: valueItemRecordToArray(referenceData.statusAssetUseItems),
      natRelItemsArray: valueItemRecordToArray(referenceData.natRelItems),
      contactKindItemsArray: valueItemRecordToArray(referenceData.contactKindItems),
      statusWorkItemsArray: valueItemRecordToArray(referenceData.statusWorkItems),
      contactsArray: pipe(
        referenceData.contacts,
        R.toArray,
        A.sort(contramap((a: [string, Contact]) => a[1].name)(S.Ord)),
        A.map((a) => a[1])
      ),
    }))
  )
);

export const selectLocale = createSelector(appSharedFeature, (state) => (state.lang === 'en' ? 'en-GB' : 'de-CH'));

export const {
  selectCurrentRoute, // select the current route
  selectFragment, // select the current route fragment
  selectQueryParams, // select the current route query params
  selectQueryParam, // factory function to select a query param
  selectRouteParams, // select the current route params
  selectRouteParam, // factory function to select a route param
  selectRouteData, // select the current route data
  selectRouteDataParam, // factory function to select a route data param
  selectUrl, // select the current url
  selectTitle, // select the title if available
} = getRouterSelectors();
