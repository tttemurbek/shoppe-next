import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_AGENTS = gql`
  query GetAgents($input: AgentsInquiry!) {
    getAgents(input: $input) {
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
        memberPoints
        memberLikes
        memberViews
        deletedAt
        createdAt
        updatedAt
        accessToken
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_MEMBER = gql(`
query GetMember($input: String!) {
    getMember(memberId: $input) {
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
        memberJewelleries
        memberArticles
        memberPoints
        memberLikes
        memberViews
        memberFollowings
				memberFollowers
        memberRank
        memberWarnings
        memberBlocks
        deletedAt
        createdAt
        updatedAt
        accessToken
        meFollowed {
					followingId
					followerId
					myFollowing
				}
    }
}
`);

/**************************
 *        JEWELLERY        *
 *************************/

export const GET_JEWELLERY = gql`
  query GetJewellery($input: String!) {
    getJewellery(jewelleryId: $input) {
      _id
      jewelleryType
      jewelleryStatus
      jewelleryLocation
      jewelleryAddress
      jewelleryTitle
      jewelleryPrice
      jewelleryGram
      jewelleryViews
      jewelleryLikes
      jewelleryImages
      jewelleryDesc
      jewelleryBarter
      jewelleryRent
      memberId
      soldAt
      deletedAt
      createdAt
      constructedAt
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
        memberJewelleries
        memberArticles
        memberFollowers
        memberFollowings
        memberPoints
        memberLikes
        memberViews
        memberComments
        memberWarnings
        memberBlocks
        deletedAt
        createdAt
        updatedAt
        accessToken
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
      }
    }
  }
`;

export const GET_JEWELLERIES = gql`
  query GetJewelleries($input: JewelleriesInquiry!) {
    getJewelleries(input: $input) {
      list {
        _id
        jewelleryType
        jewelleryStatus
        jewelleryLocation
        jewelleryAddress
        jewelleryTitle
        jewelleryPrice
        jewelleryGram
        jewelleryViews
        jewelleryLikes
        jewelleryComments
        jewelleryRank
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
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
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
          memberJewelleries
          memberArticles
          memberFollowers
          memberFollowings
          memberPoints
          memberLikes
          memberViews
          memberComments
          memberRank
          memberWarnings
          memberBlocks
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

export const GET_AGENT_JEWELLERIES = gql`
  query GetAgentJewelleries($input: AgentJewelleriesInquiry!) {
    getAgentJewelleries(input: $input) {
      list {
        _id
        jewelleryType
        jewelleryStatus
        jewelleryLocation
        jewelleryAddress
        jewelleryTitle
        jewelleryPrice
        jewelleryGram
        jewelleryViews
        jewelleryLikes
        jewelleryComments
        jewelleryRank
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
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_FAVORITES = gql`
  query GetFavorites($input: OrdinaryInquiry!) {
    getFavorites(input: $input) {
      list {
        _id
        jewelleryType
        jewelleryStatus
        jewelleryLocation
        jewelleryAddress
        jewelleryTitle
        jewelleryPrice
        jewelleryGram
        jewelleryViews
        jewelleryLikes
        jewelleryComments
        jewelleryRank
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
          memberJewelleries
          memberArticles
          memberFollowers
          memberFollowings
          memberPoints
          memberLikes
          memberViews
          memberComments
          memberRank
          memberWarnings
          memberBlocks
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

export const GET_VISITED = gql`
  query GetVisited($input: OrdinaryInquiry!) {
    getVisited(input: $input) {
      list {
        _id
        jewelleryType
        jewelleryStatus
        jewelleryLocation
        jewelleryAddress
        jewelleryTitle
        jewelleryPrice
        jewelleryGram
        jewelleryViews
        jewelleryLikes
        jewelleryComments
        jewelleryRank
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
          memberJewelleries
          memberArticles
          memberFollowers
          memberFollowings
          memberPoints
          memberLikes
          memberViews
          memberComments
          memberRank
          memberWarnings
          memberBlocks
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

export const GET_BOARD_ARTICLE = gql`
  query GetBoardArticle($input: String!) {
    getBoardArticle(articleId: $input) {
      _id
      articleCategory
      articleStatus
      articleTitle
      articleContent
      articleImage
      articleViews
      articleLikes
      articleComments
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
      }
      meLiked {
        memberId
        likeRefId
        myFavorite
      }
    }
  }
`;

export const GET_BOARD_ARTICLES = gql`
  query GetBoardArticles($input: BoardArticlesInquiry!) {
    getBoardArticles(input: $input) {
      list {
        _id
        articleCategory
        articleStatus
        articleTitle
        articleContent
        articleImage
        articleViews
        articleLikes
        articleComments
        memberId
        createdAt
        updatedAt
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
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

/**************************
 *         FOLLOW        *
 *************************/
export const GET_MEMBER_FOLLOWERS = gql`
  query GetMemberFollowers($input: FollowInquiry!) {
    getMemberFollowers(input: $input) {
      list {
        _id
        followingId
        followerId
        createdAt
        updatedAt
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
        meFollowed {
          followingId
          followerId
          myFollowing
        }
        followerData {
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
          memberJewelleries
          memberArticles
          memberPoints
          memberLikes
          memberViews
          memberComments
          memberFollowings
          memberFollowers
          memberRank
          memberWarnings
          memberBlocks
          deletedAt
          createdAt
          updatedAt
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_MEMBER_FOLLOWINGS = gql`
  query GetMemberFollowings($input: FollowInquiry!) {
    getMemberFollowings(input: $input) {
      list {
        _id
        followingId
        followerId
        createdAt
        updatedAt
        followingData {
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
          memberJewelleries
          memberArticles
          memberPoints
          memberLikes
          memberViews
          memberComments
          memberFollowings
          memberFollowers
          memberRank
          memberWarnings
          memberBlocks
          deletedAt
          createdAt
          updatedAt
          accessToken
        }
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
        meFollowed {
          followingId
          followerId
          myFollowing
        }
      }
      metaCounter {
        total
      }
    }
  }
`;
