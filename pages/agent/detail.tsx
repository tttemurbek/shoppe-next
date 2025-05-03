import React, { ChangeEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import PropertyBigCard from '../../libs/components/common/JewelleryBigCard';
import ReviewCard from '../../libs/components/agent/ReviewCard';
import {
  Box,
  Button,
  Pagination,
  Stack,
  Typography,
  Avatar,
  Rating,
  Divider,
  Container,
  Grid,
  TextField,
  IconButton,
  Chip,
  Skeleton,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SendIcon from '@mui/icons-material/Send';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Jewellery } from '../../libs/types/jewellery/jewellery';
import { Member } from '../../libs/types/member/member';
import { userVar } from '../../apollo/store';
import { PropertiesInquiry } from '../../libs/types/jewellery/jewellery.input';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { Messages, REACT_APP_API_URL } from '../../libs/config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { T } from '../../libs/types/common';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { CREATE_COMMENT, LIKE_TARGET_JEWELLERY } from '../../apollo/user/mutation';
import { GET_COMMENTS, GET_MEMBER, GET_JEWELLERIES } from '../../apollo/user/query';

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

const AgentDetail: NextPage = ({ initialInput, initialComment, ...props }: any) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [agent, setAgent] = useState<Member | null>(null);
  const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(initialInput);
  const [agentProperties, setAgentProperties] = useState<Jewellery[]>([]);
  const [propertyTotal, setPropertyTotal] = useState<number>(0);
  const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
  const [agentComments, setAgentComments] = useState<Comment[]>([]);
  const [commentTotal, setCommentTotal] = useState<number>(0);
  const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
    commentGroup: CommentGroup.MEMBER,
    commentContent: '',
    commentRefId: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /** APOLLO REQUESTS **/

  const [createComment] = useMutation(CREATE_COMMENT);
  const [likeTargetProperty] = useMutation(LIKE_TARGET_JEWELLERY);

  const {
    loading: getMemberLoading,
    data: getMemberData,
    error: getMemberError,
    refetch: getMemberRefetch,
  } = useQuery(GET_MEMBER, {
    fetchPolicy: 'network-only',
    variables: { input: agentId },
    skip: !agentId,
    onCompleted: (data: T) => {
      setAgent(data?.getMember);
      setSearchFilter({
        ...searchFilter,
        search: {
          memberId: data?.getMember?._id,
        },
      });
      setCommentInquiry({
        ...commentInquiry,
        search: {
          commentRefId: data?.getMember?._id,
        },
      });
      setInsertCommentData({
        ...insertCommentData,
        commentRefId: data?.getMember?._id,
      });
      setTimeout(() => setIsLoading(false), 500);
    },
  });

  const {
    loading: getPropertiesLoading,
    data: getPropertiesData,
    error: getPropertiesError,
    refetch: getPropertiesRefetch,
  } = useQuery(GET_JEWELLERIES, {
    fetchPolicy: 'network-only',
    variables: { input: searchFilter },
    skip: !searchFilter.search.memberId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setAgentProperties(data?.getJewelleries?.list);
      setPropertyTotal(data?.getJewelleries?.metaCounter[0]?.total ?? 0);
    },
  });

  const {
    loading: getCommentsLoading,
    data: getCommentsData,
    error: getCommentsError,
    refetch: getCommentsRefetch,
  } = useQuery(GET_COMMENTS, {
    fetchPolicy: 'network-only',
    variables: { input: commentInquiry },
    skip: !commentInquiry.search.commentRefId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setAgentComments(data?.getComments?.list);
      setCommentTotal(data?.getComments?.metaCounter[0]?.total ?? 0);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    if (router.query.agentId) setAgentId(router.query.agentId as string);
  }, [router]);

  useEffect(() => {
    if (searchFilter.search.memberId) {
      getPropertiesRefetch({ variables: { input: searchFilter } }).then();
    }
  }, [searchFilter]);

  useEffect(() => {
    if (commentInquiry.search.commentRefId) {
      getCommentsRefetch({ variables: { input: commentInquiry } }).then();
    }
  }, [commentInquiry]);

  /** HANDLERS **/
  const redirectToMemberPageHandler = async (memberId: string) => {
    try {
      if (memberId === user?._id) await router.push(`/mypage?memberId=${memberId}`);
      else await router.push(`/member?memberId=${memberId}`);
    } catch (error) {
      await sweetErrorHandling(error);
    }
  };

  const propertyPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
    setSearchFilter({ ...searchFilter, page: value });
  };

  const commentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
    setCommentInquiry({ ...commentInquiry, page: value });
  };

  const createCommentHandler = async () => {
    try {
      if (!user?._id) throw new Error(Messages.error2);
      if (user._id === agentId) throw new Error('Cannot write a review for yourself');

      await createComment({
        variables: {
          input: insertCommentData,
        },
      });

      setInsertCommentData({ ...insertCommentData, commentContent: '' });
      await sweetTopSmallSuccessAlert('Review submitted successfully!', 1200);
      await getCommentsRefetch({ input: commentInquiry });
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  };

  const likeJewelleryHandler = async (user: any, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Messages.error2);

      await likeTargetProperty({ variables: { input: id } });
      await getPropertiesRefetch({ input: searchFilter });
      await sweetTopSmallSuccessAlert('success', 800);
    } catch (err: any) {
      console.log('ERROR, likeJewelleryHandler:', err.message);
      sweetMixinErrorAlert(err.message).then();
    }
  };

  const renderAgentInfo = () => {
    if (isLoading) {
      return (
        <Stack className="agent-info">
          <Skeleton variant="circular" width={120} height={120} />
          <Box component={'div'} className={'info'}>
            <Skeleton variant="text" width={200} height={40} />
            <Skeleton variant="text" width={150} height={30} />
          </Box>
        </Stack>
      );
    }

    return (
      <Stack className="agent-info">
        <img
          src={agent?.memberImage ? `${REACT_APP_API_URL}/${agent?.memberImage}` : '/img/profile/defaultUser.svg'}
          alt={agent?.memberFullName || 'Agent profile'}
          onClick={() => redirectToMemberPageHandler(agent?._id as string)}
        />
        <Box component={'div'} className={'info'}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <strong onClick={() => redirectToMemberPageHandler(agent?._id as string)}>
              {agent?.memberFullName ?? agent?.memberNick}
            </strong>
            {agent?.memberStatus && (
              <Chip size="small" color="primary" label="Verified" sx={{ height: 22, fontSize: 12 }} />
            )}
          </Stack>

          <div>
            <PhoneIcon sx={{ width: 18, height: 18 }} />
            <span>{agent?.memberPhone || 'No phone provided'}</span>
          </div>

          {agent?.memberRank && (
            <div>
              <ThumbUpOffAltIcon sx={{ width: 18, height: 18 }} />
              <span>{agent.memberRank}</span>
            </div>
          )}

          {agent?.memberAddress && (
            <div>
              <LocationOnIcon sx={{ width: 18, height: 18 }} />
              <span>{agent?.memberAddress}</span>
            </div>
          )}
        </Box>
      </Stack>
    );
  };

  const renderPropertySection = () => {
    return (
      <Stack className="agent-home-list">
        <Typography variant="h5" sx={{ fontWeight: 600, marginLeft: 2, marginTop: 2 }}>
          Listed Properties
        </Typography>

        {getPropertiesLoading ? (
          <Stack className="card-wrap">
            {[1, 2, 3].map((item) => (
              <Box key={item} sx={{ width: 300, height: 350, margin: 2 }}>
                <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
                <Skeleton variant="text" width="80%" height={30} sx={{ mt: 2 }} />
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="40%" height={20} />
              </Box>
            ))}
          </Stack>
        ) : (
          <Stack className="card-wrap">
            {agentProperties.length > 0 ? (
              <div className="wrap-main">
                {agentProperties.map((jewellery: Jewellery) => (
                  <PropertyBigCard
                    jewellery={jewellery}
                    key={jewellery?._id}
                    likeJewelleryHandler={likeJewelleryHandler}
                  />
                ))}
              </div>
            ) : (
              <Box className="no-data" sx={{ textAlign: 'center', py: 4 }}>
                <img src="/img/icons/icoAlert.svg" alt="No properties" />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  No properties found!
                </Typography>
              </Box>
            )}
          </Stack>
        )}

        {agentProperties.length > 0 && (
          <Stack className="pagination">
            <Stack className="pagination-box">
              <Pagination
                page={searchFilter.page}
                count={Math.ceil(propertyTotal / searchFilter.limit) || 1}
                onChange={propertyPaginationChangeHandler}
                shape="rounded"
                color="primary"
              />
            </Stack>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Total {propertyTotal} propert{propertyTotal > 1 ? 'ies' : 'y'} available
            </Typography>
          </Stack>
        )}
      </Stack>
    );
  };

  const renderReviewsSection = () => {
    return (
      <Stack className="review-box">
        <Stack className="main-intro">
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Reviews
          </Typography>
          <Typography variant="body2">See what others are saying about this agent</Typography>
        </Stack>

        {commentTotal > 0 ? (
          <Stack className="review-wrap">
            <Box component={'div'} className={'title-box'}>
              <StarIcon />
              <span>
                {commentTotal} review{commentTotal > 1 ? 's' : ''}
              </span>
            </Box>

            {getCommentsLoading
              ? Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <Box key={index} sx={{ my: 2, px: 2 }}>
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Skeleton variant="circular" width={50} height={50} />
                        <Stack spacing={1} width="100%">
                          <Skeleton variant="text" width="40%" height={20} />
                          <Skeleton variant="text" width="25%" height={16} />
                          <Skeleton variant="text" width="100%" height={60} />
                        </Stack>
                      </Stack>
                    </Box>
                  ))
              : agentComments?.map((comment: Comment) => <ReviewCard comment={comment} key={comment?._id} />)}

            <Box component={'div'} className={'pagination-box'}>
              <Pagination
                page={commentInquiry.page}
                count={Math.ceil(commentTotal / commentInquiry.limit) || 1}
                onChange={commentPaginationChangeHandler}
                shape="rounded"
                color="primary"
              />
            </Box>
          </Stack>
        ) : (
          <Box sx={{ textAlign: 'center', my: 4, p: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
            <Typography variant="body1">No reviews yet. Be the first to leave a review!</Typography>
          </Box>
        )}

        <Stack className="leave-review-config">
          <Typography className="main-title">Leave A Review</Typography>
          <Typography className="review-title">Your Experience</Typography>

          <TextField
            multiline
            rows={4}
            placeholder="Share your experience with this agent..."
            fullWidth
            value={insertCommentData.commentContent}
            onChange={({ target: { value } }) => {
              setInsertCommentData({ ...insertCommentData, commentContent: value });
            }}
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: 2,
                height: 100,
                padding: '8px',
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#eb6753',
                  borderWidth: '2px',
                },
              },
            }}
          />

          <Box className="submit-btn" component={'div'}>
            <Button
              className="submit-review"
              disabled={!insertCommentData.commentContent || !user?._id || user?._id === agentId}
              onClick={createCommentHandler}
              endIcon={<SendIcon />}
            >
              <Typography className="title">Submit Review</Typography>
            </Button>
          </Box>

          {!user?._id && (
            <Typography className="error-message" variant="caption" color="error">
              You must be logged in to leave a review
            </Typography>
          )}

          {user?._id === agentId && (
            <Typography className="error-message" variant="caption" color="error">
              You cannot review your own profile
            </Typography>
          )}
        </Stack>
      </Stack>
    );
  };

  if (device === 'mobile') {
    // Mobile version would be implemented here
    return <div>AGENT DETAIL PAGE MOBILE</div>;
  } else {
    return (
      <Stack className="agent-detail-page">
        <Stack className="container">
          {renderAgentInfo()}
          {renderPropertySection()}
          {renderReviewsSection()}
        </Stack>
      </Stack>
    );
  }
};

AgentDetail.defaultProps = {
  initialInput: {
    page: 1,
    limit: 9,
    search: {
      memberId: '',
    },
  },
  initialComment: {
    page: 1,
    limit: 5,
    sort: 'createdAt',
    direction: 'ASC',
    search: {
      commentRefId: '',
    },
  },
};

export default withLayoutBasic(AgentDetail);
