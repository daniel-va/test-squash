import { unknownToError } from '@asset-sg/core';
import { AssetByTitle } from '@asset-sg/shared';
import { AppConfig, AppMode, User } from '@asset-sg/shared/v2';
import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { sequenceS } from 'fp-ts/Apply';
import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';

import { flow, Lazy, pipe } from 'fp-ts/function';
import * as RR from 'fp-ts/ReadonlyRecord';
import * as TE from 'fp-ts/TaskEither';
import { Authorize } from '@/core/decorators/authorize.decorator';
import { CurrentUser } from '@/core/decorators/current-user.decorator';
import { PrismaService } from '@/core/prisma.service';
import { AssetSearchService } from '@/features/assets/search/asset-search.service';
import { readEnv, requireEnv } from '@/utils/requireEnv';

@Controller('/')
export class AppController {
  private readonly config: AppConfig;

  constructor(private readonly assetSearchService: AssetSearchService, private readonly prismaService: PrismaService) {
    this.config = {
      mode: readEnv('ANONYMOUS_MODE', Boolean) ? AppMode.Anonymous : AppMode.Default,
      googleAnalyticsId: readEnv('GOOGLE_ANALYTICS_ID'),
      oauth: {
        issuer: requireEnv('OAUTH_ISSUER'),
        clientId: requireEnv('OAUTH_CLIENT_ID'),
        scope: requireEnv('OAUTH_SCOPE'),
        showDebugInformation: readEnv('OAUTH_SHOW_DEBUG_INFORMATION', Boolean) ?? false,
        tokenEndpoint: requireEnv('OAUTH_TOKEN_ENDPOINT'),
      },
    };
  }

  @Get('/config')
  showConfig(): AppConfig {
    return this.config;
  }

  /**
   * @deprecated
   */
  @Get('/asset-edit/search')
  @Authorize.User()
  async searchAssetsByTitle(@Query('title') title: string): Promise<AssetByTitle[]> {
    try {
      return await this.assetSearchService.searchByTitle(title);
    } catch (e) {
      throw new HttpException(unknownToError(e).message, 500);
    }
  }

  @Get('/reference-data')
  @Authorize.User()
  async getReferenceData(@CurrentUser() user: User) {
    const e = await getReferenceData(user, this.prismaService)();
    if (E.isLeft(e)) {
      console.error(e.left);
      throw new HttpException(e.left.message, 500);
    }
    return e.right;
  }
}

const getReferenceData = (user: User, prismaService: PrismaService) => {
  const qt = <A, K extends keyof A>(f: Lazy<Promise<A[]>>, key: K, newKey: string) =>
    pipe(
      TE.tryCatch(f, unknownToError),
      TE.map(
        flow(
          A.map(({ [key]: _key, ...rest }) => [_key as string, { [newKey]: _key, ...rest }] as const),
          RR.fromEntries
        )
      )
    );

  const queries = {
    // These records are all static (i.e. never change) and are shared across all assets.
    assetFormatItems: qt(() => prismaService.assetFormatItem.findMany(), 'assetFormatItemCode', 'code'),
    assetKindItems: qt(() => prismaService.assetKindItem.findMany(), 'assetKindItemCode', 'code'),
    autoCatLabelItems: qt(() => prismaService.autoCatLabelItem.findMany(), 'autoCatLabelItemCode', 'code'),
    autoObjectCatItems: qt(() => prismaService.autoObjectCatItem.findMany(), 'autoObjectCatItemCode', 'code'),
    contactKindItems: qt(() => prismaService.contactKindItem.findMany(), 'contactKindItemCode', 'code'),
    geomQualityItems: qt(() => prismaService.geomQualityItem.findMany(), 'geomQualityItemCode', 'code'),
    languageItems: qt(() => prismaService.languageItem.findMany(), 'languageItemCode', 'code'),
    legalDocItems: qt(() => prismaService.legalDocItem.findMany(), 'legalDocItemCode', 'code'),
    manCatLabelItems: qt(() => prismaService.manCatLabelItem.findMany(), 'manCatLabelItemCode', 'code'),
    natRelItems: qt(() => prismaService.natRelItem.findMany(), 'natRelItemCode', 'code'),
    pubChannelItems: qt(() => prismaService.pubChannelItem.findMany(), 'pubChannelItemCode', 'code'),
    statusAssetUseItems: qt(() => prismaService.statusAssetUseItem.findMany(), 'statusAssetUseItemCode', 'code'),
    statusWorkItems: qt(() => prismaService.statusWorkItem.findMany(), 'statusWorkItemCode', 'code'),

    // Include only the contacts which are assigned to at least one asset to which the user has access.
    contacts: qt(
      () =>
        user.isAdmin
          ? prismaService.contact.findMany()
          : prismaService.contact.findMany({
              where: {
                assetContacts: {
                  some: { asset: { workgroupId: { in: [...user.roles.keys()] } } },
                },
              },
            }),
      'contactId',
      'id'
    ),
  };

  return pipe(queries, sequenceS(TE.ApplicativeSeq));
};
