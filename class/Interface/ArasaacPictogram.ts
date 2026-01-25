interface ArasaacKeyword {
  keyword: string;
  type: number;
  meaning?: string;
  plural?: string;
  hasLocution: boolean;
}

export interface ArasaacPictogram {
  _id: number;
  created: string;
  downloads: number;
  tags: string[];
  synsets: string[];
  sex: boolean;
  lastUpdated: string;
  schematic: boolean;
  keywords: ArasaacKeyword[];
  categories: string[];
  violence: boolean;
  hair: boolean;
  skin: boolean;
  aac: boolean;
  aacColor: boolean;
}