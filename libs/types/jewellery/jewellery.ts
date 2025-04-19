import { JewelleryLocation, JewelleryStatus, JewelleryType } from '../../enums/jewellery.enum';
import { Member } from '../member/member';

export interface MeLiked {
  memberId: string;
  likeRefId: string;
  myFavorite: boolean;
}

export interface TotalCounter {
  total: number;
}

export interface Jewellery {
  _id: string;
  jewelleryType: JewelleryType;
  jewelleryStatus: JewelleryStatus;
  jewelleryLocation: JewelleryLocation;
  jewelleryAddress: string;
  jewelleryTitle: string;
  jewelleryPrice: number;
  jewellerySquare: number;
  jewelleryBeds: number;
  jewelleryRooms: number;
  jewelleryViews: number;
  jewelleryLikes: number;
  jewelleryComments: number;
  jewelleryRank: number;
  jewelleryImages: string[];
  jewelleryDesc?: string;
  jewelleryBarter: boolean;
  jewelleryRent: boolean;
  jewelleryGram: number;
  memberId: string;
  soldAt?: Date;
  deletedAt?: Date;
  constructedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  /** from aggregation **/
  meLiked?: MeLiked[];
  memberData?: Member;
}

export interface Jewelleries {
  list: Jewellery[];
  metaCounter: TotalCounter[];
}
