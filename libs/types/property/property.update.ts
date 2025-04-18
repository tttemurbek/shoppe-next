import { JewelleryLocation, JewelleryStatus, JewelleryType } from '../../enums/jewellery.enum';

export interface PropertyUpdate {
  _id: string;
  propertyType?: JewelleryType;
  propertyStatus?: JewelleryStatus;
  propertyLocation?: JewelleryLocation;
  propertyAddress?: string;
  propertyTitle?: string;
  propertyPrice?: number;
  propertySquare?: number;
  propertyBeds?: number;
  propertyRooms?: number;
  propertyImages?: string[];
  propertyDesc?: string;
  propertyBarter?: boolean;
  propertyRent?: boolean;
  soldAt?: Date;
  deletedAt?: Date;
  constructedAt?: Date;
}
