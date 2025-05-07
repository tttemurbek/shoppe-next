import { JewelleryLocation, JewelleryStatus, JewelleryType } from '../../enums/jewellery.enum';
import { Direction } from '../../enums/common.enum';

export interface JewelleryInput {
  jewelleryType: JewelleryType;
  jewelleryLocation: JewelleryLocation;
  jewelleryAddress: string;
  jewelleryTitle: string;
  jewelleryPrice: number;
  jewellerySquare: number;
  jewelleryBeds: number;
  jewelleryRooms: number;
  jewelleryImages: string[];
  jewelleryDesc?: string;
  jewelleryBarter?: boolean;
  jewelleryRent?: boolean;
  memberId?: string;
  constructedAt?: Date;
}

interface PISearch {
  memberId?: string;
  locationList?: JewelleryLocation[];
  typeList?: JewelleryType[];
  roomsList?: Number[];
  options?: string[];
  bedsList?: Number[];
  pricesRange?: Range;
  periodsRange?: PeriodsRange;
  squaresRange?: Range;
  text?: string;
}

export interface JewelleriesInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: PISearch;
}

interface APISearch {
  jewelleryStatus?: JewelleryStatus;
}

export interface AgentJewelleriesInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: APISearch;
}

interface ALPISearch {
  jewelleryStatus?: JewelleryStatus;
  jewelleryLocationList?: JewelleryLocation[];
}

export interface AllJewelleriesInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: ALPISearch;
}

interface Range {
  start: number;
  end: number;
}

interface PeriodsRange {
  start: Date | number;
  end: Date | number;
}
