import { DOCUMENT } from '@angular/common';
import { ElementRef, Pipe, PipeTransform, inject } from '@angular/core';
import { LV95Y, roundToMillimeter } from '@asset-sg/shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as E from 'fp-ts/Either';
import { fromEvent, take } from 'rxjs';

@UntilDestroy()
@Pipe({
  name: 'lv95yWithoutPrefix',
  standalone: false,
})
export class Lv95yWithoutPrefixPipe implements PipeTransform {
  private _host = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private _dcmnt = inject(DOCUMENT);

  transform(value: unknown) {
    if (this._dcmnt.activeElement === this._host.nativeElement) {
      fromEvent(this._host.nativeElement, 'blur')
        .pipe(take(1), untilDestroyed(this))
        .subscribe(() => {
          const decoded = LV95Y.decode(value);
          this._host.nativeElement.value = E.isLeft(decoded)
            ? String(value)
            : roundToMillimeter(decoded.right - 2000000).toFixed(3);
        });
    }
    const decoded = LV95Y.decode(value);
    const { selectionStart, selectionEnd } = this._host.nativeElement;
    setTimeout(() => {
      this._host.nativeElement.setSelectionRange(selectionStart, selectionEnd);
    });
    return E.isLeft(decoded)
      ? value
      : this._dcmnt.activeElement === this._host.nativeElement
      ? roundToMillimeter(decoded.right - 2000000)
      : roundToMillimeter(decoded.right - 2000000).toFixed(3);
  }
}
