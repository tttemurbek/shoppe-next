import { JewelleryLocation, JewelleryStatus, JewelleryType } from '../../enums/jewellery.enum';
import { Direction } from '../../enums/common.enum';

export interface PropertyInput {
  propertyType: JewelleryType;
  propertyLocation: JewelleryLocation;
  propertyAddress: string;
  propertyTitle: string;
  propertyPrice: number;
  propertySquare: number;
  propertyBeds: number;
  propertyRooms: number;
  propertyImages: string[];
  propertyDesc?: string;
  propertyBarter?: boolean;
  propertyRent?: boolean;
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

export interface PropertiesInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: PISearch;
}

interface APISearch {
  propertyStatus?: JewelleryStatus;
}

export interface AgentPropertiesInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: APISearch;
}

interface ALPISearch {
  propertyStatus?: JewelleryStatus;
  propertyLocationList?: JewelleryLocation[];
}

export interface AllPropertiesInquiry {
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
