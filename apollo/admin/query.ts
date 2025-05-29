import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_ALL_MEMBERS_BY_ADMIN = gql`
  query GetAllMembersByAdmin($input: MembersInquiry!) {
    getAllMembersByAdmin(input: $input) {
      list {
        _id
        memberType
        memberStatus
        memberAuthType
        memberPhone
        memberNick
        memberFullName
        memberImage
        memberAddress
        memberDesc
        memberWarnings
        memberBlocks
        memberJewelleries
        memberRank
        memberArticles
        memberPoints
        memberLikes
        memberViews
        deletedAt
        createdAt
        updatedAt
        accessToken
      }
      metaCounter {
        total
      }
    }
  }
`;

/**************************
 *        JEWELLERY        *
 *************************/

export const GET_ALL_JEWELLERIES_BY_ADMIN = gql`
  query GetAllJewelleriesByAdmin($input: AllJewelleriesInquiry!) {
    getAllJewelleriesByAdmin(input: $input) {
      list {
        _id
        jewelleryType
        jewelleryStatus
        jewelleryLocation
        jewelleryAddress
        jewelleryTitle
        jewelleryPrice
        jewelleryViews
        jewelleryLikes
        jewelleryImages
        jewelleryDesc
        jewelleryBarter
        jewelleryRent
        memberId
        soldAt
        deletedAt
        constructedAt
        createdAt
        updatedAt
        memberData {
          _id
          memberType
          memberStatus
          memberAuthType
          memberPhone
          memberNick
          memberFullName
          memberImage
          memberAddress
          memberDesc
          memberWarnings
          memberBlocks
          memberJewelleries
          memberRank
          memberPoints
          memberLikes
          memberViews
          deletedAt
          createdAt
          updatedAt
          accessToken
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const GET_ALL_BOARD_ARTICLES_BY_ADMIN = gql`
  query GetAllBoardArticlesByAdmin($input: AllBoardArticlesInquiry!) {
    getAllBoardArticlesByAdmin(input: $input) {
      list {
        _id
        articleCategory
        articleStatus
        articleTitle
        articleContent
        articleImage
        articleViews
        articleLikes
        memberId
        createdAt
        updatedAt
        memberData {
          _id
          memberType
          memberStatus
          memberAuthType
          memberPhone
          memberNick
          memberFullName
          memberImage
          memberAddress
          memberDesc
          memberWarnings
          memberBlocks
          memberJewelleries
          memberRank
          memberPoints
          memberLikes
          memberViews
          deletedAt
          createdAt
          updatedAt
          accessToken
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

/**************************
 *         COMMENT        *
 *************************/

export const GET_COMMENTS = gql`
  query GetComments($input: CommentsInquiry!) {
    getComments(input: $input) {
      list {
        _id
        commentStatus
        commentGroup
        commentContent
        commentRefId
        memberId
        createdAt
        updatedAt
        memberData {
          _id
          memberType
          memberStatus
          memberAuthType
          memberPhone
          memberNick
          memberFullName
          memberImage
          memberAddress
          memberDesc
          memberWarnings
          memberBlocks
          memberJewelleries
          memberRank
          memberPoints
          memberLikes
          memberViews
          deletedAt
          createdAt
          updatedAt
          accessToken
        }
      }
      metaCounter {
        total
      }
    }
  }
`;
