import { inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ValidatorFn, Validators } from '@angular/forms';

import {
  AssetContactEdit,
  AssetFile,
  AssetFileType,
  AssetLanguageEdit,
  DateId,
  LegalDocItemCode,
  LinkedAsset,
  StatusAssetUseCode,
  StatusWork,
  Studies,
} from '@asset-sg/shared';

import { distinctUntilChanged, map, shareReplay, startWith } from 'rxjs';
import { IdVM } from '../models';

const makeAssetEditorGeneralFormGroup = (formBuilder: FormBuilder) =>
  formBuilder.group({
    id: new FormControl<number>(0, { nonNullable: true }),
    titlePublic: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    sgsId: new FormControl<number | null>(null),
    titleOriginal: new FormControl<string | null>('', { nonNullable: true }),
    createDate: new FormControl<DateId | null | undefined>(undefined, {
      validators: Validators.required,
    }),
    receiptDate: new FormControl<DateId | null | undefined>(undefined, {
      validators: Validators.required,
    }),
    assetKindItemCode: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    assetFormatItemCode: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    assetLanguages: new FormControl<AssetLanguageEdit[]>([], { nonNullable: true }),
    manCatLabelRefs: new FormControl<string[]>(['other'], { nonNullable: true }),
    ids: new FormControl<IdVM[]>([], { nonNullable: true }),
    workgroupId: new FormControl<number | null>(null, {
      validators: Validators.required,
    }),
  });

export type AssetEditorGeneralFormGroup = ReturnType<typeof makeAssetEditorGeneralFormGroup>;

const makeAssetEditorFilesFormGroup = (formBuilder: FormBuilder) =>
  formBuilder.group({
    normalFiles: makeAssetEditorFileTypeFormGroup(formBuilder),
    legalFiles: makeAssetEditorFileTypeFormGroup(formBuilder),
  });

const makeAssetEditorFileTypeFormGroup = (formBuilder: FormBuilder) =>
  formBuilder.group({
    existingFiles: new FormControl<AssetEditorFile[]>([], { nonNullable: true }),
    filesToDelete: new FormControl<number[]>([], { nonNullable: true }),
    newFiles: formBuilder.array<FormControl<AssetEditorNewFile>>([]),
  });

export type AssetEditorFilesFormGroup = ReturnType<typeof makeAssetEditorFilesFormGroup>;
export type AssetEditorFileTypeFormGroup = ReturnType<typeof makeAssetEditorFileTypeFormGroup>;

export interface AssetEditorFile extends AssetFile {
  willBeDeleted: boolean;
}

export interface AssetEditorNewFile {
  type: AssetFileType;
  legalDocItemCode: LegalDocItemCode | null;
  file: File;
}

const validateUsageDates: ValidatorFn = (control: AbstractControl) => {
  const formGroup = control as AssetEditorUsageFormGroup;

  const internalUseStatusStartAvailability = formGroup.controls['internalStartAvailabilityDate'];
  const publicUseStatusStartAvailability = formGroup.controls['publicStartAvailabilityDate'];

  if (
    internalUseStatusStartAvailability.value &&
    publicUseStatusStartAvailability.value &&
    internalUseStatusStartAvailability.value > publicUseStatusStartAvailability.value
  ) {
    internalUseStatusStartAvailability.setErrors({
      ...internalUseStatusStartAvailability.errors,
      internalPublicUsageDateError: true,
    });
    publicUseStatusStartAvailability.setErrors({
      ...publicUseStatusStartAvailability.errors,
      internalPublicUsageDateError: true,
    });
  } else {
    const { internalPublicUsageDateError: _internalPublicUsageDateError1, ...restInternalUseStatusStartAvailability } =
      internalUseStatusStartAvailability.errors || {};
    internalUseStatusStartAvailability.setErrors(
      Object.keys(restInternalUseStatusStartAvailability).length === 0 ? null : restInternalUseStatusStartAvailability
    );

    const { internalPublicUsageDateError: _internalPublicUsageDateError2, ...restPublicUseStatusStartAvailability } =
      publicUseStatusStartAvailability.errors || {};
    publicUseStatusStartAvailability.setErrors(
      Object.keys(restPublicUseStatusStartAvailability).length === 0 ? null : restPublicUseStatusStartAvailability
    );
  }

  return null;
};

const makeAssetEditorUsageFormGroup = (formBuilder: FormBuilder) =>
  formBuilder.group(
    {
      internalUse: new FormControl<boolean>(false, { nonNullable: true }),
      internalUseStatusAssetUseCode: new FormControl<StatusAssetUseCode>('tobechecked', { nonNullable: true }),
      internalStartAvailabilityDate: new FormControl<DateId | null | undefined>(undefined),
      publicUse: new FormControl<boolean>(false, { nonNullable: true }),
      publicUseStatusAssetUseCode: new FormControl<StatusAssetUseCode>('tobechecked', { nonNullable: true }),
      publicStartAvailabilityDate: new FormControl<DateId | null | undefined>(undefined),
      isNatRel: new FormControl<boolean>(true, { nonNullable: true }),
      natRelTypeItemCodes: new FormControl<string[]>([], { nonNullable: true }),
    },
    { validators: [validateUsageDates] }
  );
export type AssetEditorUsageFormGroup = ReturnType<typeof makeAssetEditorUsageFormGroup>;

const makeAssetEditorContactsFormGroup = (formBuilder: FormBuilder) =>
  formBuilder.group({
    assetContacts: new FormControl<AssetContactEdit[]>([], { nonNullable: true }),
  });
export type AssetEditorContactsFormGroup = ReturnType<typeof makeAssetEditorContactsFormGroup>;

const makeAssetEditorReferencesFormGroup = (formBuilder: FormBuilder) =>
  formBuilder.group({
    thisAssetId: new FormControl<number>(0, { nonNullable: true }),
    assetMain: new FormControl<LinkedAsset | null>(null),
    childAssets: new FormControl<LinkedAsset[]>([], { nonNullable: true }),
    siblingAssets: new FormControl<LinkedAsset[]>([], { nonNullable: true }),
  });
export type AssetEditorReferencesFormGroup = ReturnType<typeof makeAssetEditorReferencesFormGroup>;

const makeAssetEditorGeometriesFormGroup = (formBuilder: FormBuilder) =>
  formBuilder.group({
    studies: new FormControl<Studies>([], { nonNullable: true }),
  });
export type AssetEditorGeometriesFormGroup = ReturnType<typeof makeAssetEditorGeometriesFormGroup>;

const makeAssetEditorAdministrationFormGroup = (formBuilder: FormBuilder) =>
  formBuilder.group({
    sgsId: new FormControl<number | null>(null),
    geolDataInfo: new FormControl<string | null>(null),
    geolContactDataInfo: new FormControl<string | null>(null),
    geolAuxDataInfo: new FormControl<string | null>(null),
    municipality: new FormControl<string | null>(null),
    statusWorks: new FormControl<StatusWork[]>([], { nonNullable: true }),
    newStatusWorkItemCode: new FormControl<string | null>('initiateAsset'),
  });
export type AssetEditorAdministrationFormGroup = ReturnType<typeof makeAssetEditorAdministrationFormGroup>;

export const makeAssetEditorFormGroup = () => {
  const formBuilder = inject(FormBuilder);
  return formBuilder.group({
    general: makeAssetEditorGeneralFormGroup(formBuilder),
    files: makeAssetEditorFilesFormGroup(formBuilder),
    usage: makeAssetEditorUsageFormGroup(formBuilder),
    contacts: makeAssetEditorContactsFormGroup(formBuilder),
    references: makeAssetEditorReferencesFormGroup(formBuilder),
    geometries: makeAssetEditorGeometriesFormGroup(formBuilder),
    administration: makeAssetEditorAdministrationFormGroup(formBuilder),
  });
};

export type AssetEditorFormGroup = ReturnType<typeof makeAssetEditorFormGroup>;

export const isAssetEditorFormDisabled$ = (root: AssetEditorFormGroup) =>
  root.statusChanges.pipe(
    startWith(root.status),
    map((status) => status === 'DISABLED'),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true })
  );
