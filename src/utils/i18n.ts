import { Injectable } from '@angular/core';
import { TranslateCompiler, TranslateModule } from '@ngx-translate/core';
import * as MessageFormat from 'messageformat';

/**
 * This compiler expects ICU syntax and compiles the expressions with messageformat.js
 *
 * See https://messageformat.github.io
 * From https://github.com/lephyrus (see https://github.com/ngx-translate/core/pull/553)
 */
@Injectable()
export class TranslateMessageFormatCompiler extends TranslateCompiler {
  private readonly messageFormat: any;

  constructor() {
    super();
    this.messageFormat = new MessageFormat();
  }

  compile(value: string, lang: string): string | ((...args: any[]) => any) {
    return this.messageFormat.compile(value, lang);
  }

  compileTranslations(translations: any, lang: string): any {
    return this.messageFormat.compile(translations, lang);
  }
}

export const translateModuleForRoot = TranslateModule.forRoot({
  compiler: { provide: TranslateCompiler, useClass: TranslateMessageFormatCompiler }
});
