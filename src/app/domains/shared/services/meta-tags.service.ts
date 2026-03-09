import { inject, Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { environment } from '@envs/environment';

export interface PageMetaData {
  title: string;
  description: string;
  image: string;
  url: string;
}

const defaultMetaData: PageMetaData = {
  title: 'My Angular App',
  description: 'An amazing Angular application.',
  image: '',
  url: environment.domain,
};

@Injectable({
  providedIn: 'root',
})
export class MetaTagsService {
  titleService = inject(Title);
  metaService = inject(Meta);

  updateMetaTags(metaData: Partial<PageMetaData>) {
    const metaDataToUpdate = { ...defaultMetaData, ...metaData };

    const tags = this.generateMetaDefinitions(metaDataToUpdate);
    tags.forEach(definition => this.metaService.updateTag(definition));
    this.titleService.setTitle(metaDataToUpdate.title);
  }

  private generateMetaDefinitions(metaData: PageMetaData): MetaDefinition[] {
    return [
      {
        name: 'description',
        content: metaData.description,
      },
      { name: 'og:title', content: metaData.title },
      { name: 'og:image', content: metaData.image },
      {
        name: 'og:description',
        content: metaData.description,
      },
      { name: 'og:url', content: metaData.url },
    ];
  }
}
