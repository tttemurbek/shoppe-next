import { JewelleryLocation, JewelleryStatus, JewelleryType } from '../../enums/jewellery.enum';

export interface JewelleryUpdate {
  _id: string;
  jewelleryType?: JewelleryType;
  jewelleryStatus?: JewelleryStatus;
  jewelleryLocation?: JewelleryLocation;
  jewelleryAddress?: string;
  jewelleryTitle?: string;
  jewelleryPrice?: number;
  jewellerySquare?: number;
  jewelleryBeds?: number;
  jewelleryRooms?: number;
  jewelleryImages?: string[];
  jewelleryDesc?: string;
  jewelleryBarter?: boolean;
  jewelleryRent?: boolean;
  soldAt?: Date;
  deletedAt?: Date;
  constructedAt?: Date;
}
