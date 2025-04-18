import { BoardArticleCategory, BoardArticleStatus } from '../../enums/board-article.enum';
import { Member } from '../member/member';
import { MeLiked, TotalCounter } from '../jewellery/jewellery';

export interface BoardArticle {
  _id: string;
  articleCategory: BoardArticleCategory;
  articleStatus: BoardArticleStatus;
  articleTitle: string;
  articleContent: string;
  articleImage: string;
  articleViews: number;
  articleLikes: number;
  articleComments: number;
  memberId: string;
  createdAt: Date;
  updatedAt: Date;
  /** from aggregation **/
  meLiked?: MeLiked[];
  memberData?: Member;
}

export interface BoardArticles {
  list: BoardArticle[];
  metaCounter: TotalCounter[];
}
