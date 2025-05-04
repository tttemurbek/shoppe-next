'use client';

import type React from 'react';
import { type ChangeEvent, useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Stack, Typography, IconButton } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutFull from '../../libs/components/layout/LayoutFull';
import type { NextPage } from 'next';
import Review from '../../libs/components/jewellery/Review';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';
import JewelleryBigCard from '../../libs/components/common/JewelleryBigCard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import type { Jewellery } from '../../libs/types/jewellery/jewellery';
import { formatterStr } from '../../libs/utils';
import { REACT_APP_API_URL } from '../../libs/config';
import { userVar } from '../../apollo/store';
import type { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import type { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { Pagination as MuiPagination, Tab, Tabs } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import 'swiper/css';
import 'swiper/css/pagination';
import { GET_COMMENTS, GET_JEWELLERIES, GET_JEWELLERY } from '../../apollo/user/query';
import type { T } from '../../libs/types/common';
import { Direction, Message } from '../../libs/enums/common.enum';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { CREATE_COMMENT, LIKE_TARGET_JEWELLERY } from '../../apollo/user/mutation';

SwiperCore.use([Autoplay, Navigation, Pagination]);

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const JewelleryDetail: NextPage = ({ initialComment, ...props }: any) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const [jewelleryId, setJewelleryId] = useState<string | null>(null);
  const [jewellery, setJewellery] = useState<Jewellery | null>(null);
  const [slideImage, setSlideImage] = useState<string>('');
  const [destinationJewelleries, setDestinationJewelleries] = useState<Jewellery[]>([]);
  const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
  const [jewelleryComments, setJewelleryComments] = useState<Comment[]>([]);
  const [commentTotal, setCommentTotal] = useState<number>(0);
  const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
    commentGroup: CommentGroup.JEWELLERY,
    commentContent: '',
    commentRefId: '',
  });
  const [quantity, setQuantity] = useState<number>(1);
  const [tabValue, setTabValue] = useState(0);

  /** APOLLO REQUESTS **/

  const [likeTargetJewellery] = useMutation(LIKE_TARGET_JEWELLERY);
  const [createCommand] = useMutation(CREATE_COMMENT);

  const {
    loading: getJewelleryLoading,
    data: getJewelleryData,
    error: getJewelleryError,
    refetch: getJewelleryRefetch,
  } = useQuery(GET_JEWELLERY, {
    fetchPolicy: 'network-only',
    variables: { input: jewelleryId },
    skip: !jewelleryId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      if (data?.getJewellery) setJewellery(data?.getJewellery);
      if (data?.getJewellery) setSlideImage(data?.getJewellery?.jewelleryImages[0]);
    },
  });

  const {
    loading: getJewelleriesLoading,
    data: getJewelleriesData,
    error: getJewelleriesError,
    refetch: getJewelleriesRefetch,
  } = useQuery(GET_JEWELLERIES, {
    fetchPolicy: 'cache-and-network',
    variables: {
      input: {
        page: 1,
        limit: 4,
        sort: 'createdAt',
        direction: Direction.DESC,
        search: {
          locationList: jewellery?.jewelleryLocation ? [jewellery?.jewelleryLocation] : [],
        },
      },
    },
    skip: !jewelleryId && !jewellery,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      if (data?.getJewelleries?.list) setDestinationJewelleries(data?.getJewelleries?.list);
    },
  });

  const {
    loading: getCommentsLoading,
    data: getCommentsData,
    error: getCommentsError,
    refetch: getCommentsRefetch,
  } = useQuery(GET_COMMENTS, {
    fetchPolicy: 'cache-and-network',
    variables: { input: initialComment },
    skip: !commentInquiry.search?.commentRefId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      if (data?.getComments?.list) setJewelleryComments(data?.getComments?.list);
      setCommentTotal(data?.getComments?.metaCounter[0]?.total ?? 0);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    if (router.query.id) {
      setJewelleryId(router.query.id as string);
      setCommentInquiry({
        ...commentInquiry,
        search: {
          commentRefId: router.query.id as string,
        },
      });
      setInsertCommentData({
        ...insertCommentData,
        commentRefId: router.query.id as string,
      });
    }
  }, [router]);

  useEffect(() => {
    if (commentInquiry.search.commentRefId) {
      getCommentsRefetch({ input: commentInquiry });
    }
  }, [commentInquiry]);

  /** HANDLERS **/

  const likeJewelleryHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      //execute likeJewelleryHandler
      await likeTargetJewellery({ variables: { input: id } });

      // execute getJewelleriesRefetch
      await getJewelleryRefetch({
        input: id,
      });
      await getJewelleriesRefetch({
        input: {
          page: 1,
          limit: 4,
          sort: 'createdAt',
          direction: Direction.DESC,
          search: {
            locationList: [jewellery?.jewelleryLocation],
          },
        },
      });

      await sweetTopSmallSuccessAlert('success', 800);
    } catch (err: any) {
      console.log('ERROR, likeJewelleryHandler:', err.message);
      sweetMixinErrorAlert(err.message).then();
    }
  };

  const changeImageHandler = (image: string) => {
    setSlideImage(image);
  };

  const commentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
    commentInquiry.page = value;
    setCommentInquiry({ ...commentInquiry });
  };

  const createCommentHandler = async () => {
    try {
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
      await createCommand({ variables: { input: insertCommentData } });

      setInsertCommentData({ ...insertCommentData, commentContent: '' });

      await getCommentsRefetch({ input: commentInquiry });
    } catch (err: any) {
      await sweetErrorHandling(err);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleQuantityChange = (action: 'increase' | 'decrease') => {
    if (action === 'increase') {
      setQuantity(quantity + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (getJewelleryLoading) {
    return (
      <Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '1080px' }}>
        <CircularProgress size={'4rem'} />
      </Stack>
    );
  }

  if (device === 'mobile') {
    return (
      <div id={'jewellery-detail-page'}>
        <div className={'container'}>
          <Stack className={'jewellery-detail-container'}>
            <Stack className={'jewellery-image-gallery'}>
              <img
                src={slideImage ? `${REACT_APP_API_URL}/${slideImage}` : '/placeholder.svg?height=600&width=600'}
                alt={jewellery?.jewelleryTitle || 'Jewellery Image'}
                className={'main-image'}
              />
              <Stack direction="row" spacing={2} className={'thumbnail-container'}>
                {jewellery?.jewelleryImages.map((image: string, index: number) => (
                  <Box
                    key={index}
                    onClick={() => changeImageHandler(image)}
                    className={`thumbnail ${slideImage === image ? 'active' : ''}`}
                  >
                    <img src={`${REACT_APP_API_URL}/${image}`} alt={`Thumbnail ${index + 1}`} />
                  </Box>
                ))}
              </Stack>
            </Stack>

            <Stack className={'jewellery-info'}>
              <Typography variant="h4" className={'jewellery-title'}>
                {jewellery?.jewelleryTitle || 'Lira Earrings'}
              </Typography>
              <Typography variant="h6" className={'jewellery-price'}>
                ${jewellery?.jewelleryPrice ? formatterStr(jewellery.jewelleryPrice) : '20.00'}
              </Typography>

              <Box className={'rating-container'}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`star ${i < (jewellery?.jewelleryRank || 5) ? 'filled' : ''}`}>
                    ★
                  </span>
                ))}
                <Typography variant="body2" className={'review-count'}>
                  1 customer review
                </Typography>
              </Box>

              <Typography variant="body1" className={'jewellery-description'}>
                {jewellery?.jewelleryDesc ||
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat, augue a volutpat hendrerit, sapien tortor faucibus augue, a maximus elit ex vitae libero. Sed quis mauris eget arcu facilisis consequat sed eu felis.'}
              </Typography>

              <Stack direction="row" spacing={2} className={'quantity-cart-container'}>
                <Box className={'quantity-selector'}>
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange('decrease')}
                    disabled={quantity <= 1}
                    className={'quantity-button'}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography className={'quantity-value'}>{quantity}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange('increase')}
                    className={'quantity-button'}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Button variant="contained" fullWidth className={'add-to-cart-button'}>
                  ADD TO CART
                </Button>
              </Stack>

              <Stack direction="row" spacing={2} className={'social-container'}>
                <IconButton className={'social-button'}>
                  {jewellery?.meLiked && jewellery?.meLiked[0]?.myFavorite ? (
                    <FavoriteIcon />
                  ) : (
                    <FavoriteBorderIcon onClick={() => likeJewelleryHandler(user, jewellery?._id || '')} />
                  )}
                </IconButton>
                <IconButton className={'social-button'}>
                  <EmailIcon />
                </IconButton>
                <IconButton className={'social-button'}>
                  <FacebookIcon />
                </IconButton>
                <IconButton className={'social-button'}>
                  <InstagramIcon />
                </IconButton>
                <IconButton className={'social-button'}>
                  <TwitterIcon />
                </IconButton>
              </Stack>

              <Box className={'product-meta'}>
                <Typography variant="body2" className={'meta-item'}>
                  <span className={'meta-label'}>GRAM:</span> {jewellery?.jewelleryGram || '12'} grams
                </Typography>
                <Typography variant="body2" className={'meta-item'}>
                  <span className={'meta-label'}>Categories:</span> {jewellery?.jewelleryType || 'Fashion, Style'}
                </Typography>
              </Box>
            </Stack>

            <Box className={'tabs-container'}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="jewellery information tabs"
                className={'tabs-navigation'}
              >
                <Tab label="Description" id="tab-0" aria-controls="tabpanel-0" />
                <Tab label="Additional information" id="tab-1" aria-controls="tabpanel-1" />
                <Tab label={`Reviews(${commentTotal})`} id="tab-2" aria-controls="tabpanel-2" />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                <Typography variant="body1" className={'tab-content'}>
                  {jewellery?.jewelleryDesc ||
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat, augue a volutpat hendrerit, sapien tortor faucibus augue, a maximus elit ex vitae libero. Sed quis mauris eget arcu facilisis consequat sed eu felis.'}
                </Typography>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Box className={'additional-info'}>
                  <Box className={'info-row'}>
                    <Typography className={'info-label'}>Weight</Typography>
                    <Typography className={'info-value'}>{jewellery?.jewelleryGram || '0.3'} gram</Typography>
                  </Box>
                  <Box className={'info-row'}>
                    <Typography className={'info-label'}>Dimensions</Typography>
                    <Typography className={'info-value'}>N/A</Typography>
                  </Box>
                  <Box className={'info-row'}>
                    <Typography className={'info-label'}>Materials</Typography>
                    <Typography className={'info-value'}>Gold</Typography>
                  </Box>
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                {commentTotal > 0 ? (
                  <Stack className={'review-list'}>
                    {jewelleryComments?.map((comment: Comment) => (
                      <Review comment={comment} key={comment?._id} />
                    ))}
                    <Box component={'div'} className={'pagination-box'}>
                      <MuiPagination
                        page={commentInquiry.page}
                        count={Math.ceil(commentTotal / commentInquiry.limit)}
                        onChange={commentPaginationChangeHandler}
                        shape="circular"
                        color="primary"
                      />
                    </Box>
                  </Stack>
                ) : (
                  <Typography variant="body1" className={'no-reviews'}>
                    No reviews yet.
                  </Typography>
                )}

                <Stack className={'leave-review-config'}>
                  <Typography className={'review-title'}>Leave A Review</Typography>
                  <textarea
                    onChange={({ target: { value } }: any) => {
                      setInsertCommentData({ ...insertCommentData, commentContent: value });
                    }}
                    value={insertCommentData.commentContent}
                    className={'review-textarea'}
                    placeholder="Write your review here..."
                  ></textarea>
                  <Box className={'submit-btn'} component={'div'}>
                    <Button
                      className={'submit-review'}
                      disabled={insertCommentData.commentContent === '' || !user?._id}
                      onClick={createCommentHandler}
                    >
                      Submit Review
                    </Button>
                  </Box>
                </Stack>
              </TabPanel>
            </Box>

            {destinationJewelleries.length > 0 && (
              <Stack className={'similar-items'}>
                <Typography variant="h5" className={'section-title'}>
                  Similar Items
                </Typography>
                <Stack className={'cards-box'}>
                  <Swiper
                    className={'similar-items-swiper'}
                    slidesPerView={'auto'}
                    spaceBetween={35}
                    modules={[Autoplay, Navigation, Pagination]}
                    navigation={{
                      nextEl: '.swiper-similar-next',
                      prevEl: '.swiper-similar-prev',
                    }}
                    pagination={{
                      el: '.swiper-similar-pagination',
                    }}
                  >
                    {destinationJewelleries.map((jewellery: Jewellery) => (
                      <SwiperSlide className={'similar-item-slide'} key={jewellery._id}>
                        <JewelleryBigCard
                          likeJewelleryHandler={likeJewelleryHandler}
                          jewellery={jewellery}
                          key={jewellery?._id}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <Stack className={'pagination-box'}>
                    <WestIcon className={'swiper-similar-prev'} />
                    <div className={'swiper-similar-pagination'}></div>
                    <EastIcon className={'swiper-similar-next'} />
                  </Stack>
                </Stack>
              </Stack>
            )}
          </Stack>
        </div>
      </div>
    );
  } else {
    return (
      <div id={'jewellery-detail-page'}>
        <div className={'container'}>
          <Stack className={'jewellery-detail-container'}>
            <Stack direction="row" spacing={4} className={'jewellery-main-content'}>
              {/* Left side - Image Gallery */}
              <Stack className={'jewellery-image-gallery'}>
                <Stack direction="row" className={'gallery-container'}>
                  <Stack className={'thumbnails-container'}>
                    {jewellery?.jewelleryImages.map((image: string, index: number) => (
                      <Box
                        key={index}
                        onClick={() => changeImageHandler(image)}
                        className={`thumbnail ${slideImage === image ? 'active' : ''}`}
                      >
                        <img src={`${REACT_APP_API_URL}/${image}`} alt={`Thumbnail ${index + 1}`} />
                      </Box>
                    ))}
                  </Stack>
                  <Box className={'main-image-container'}>
                    <img
                      src={slideImage ? `${REACT_APP_API_URL}/${slideImage}` : '/placeholder.svg?height=600&width=600'}
                      alt={jewellery?.jewelleryTitle || 'Lira Earrings'}
                      className={'main-image'}
                    />
                  </Box>
                </Stack>
              </Stack>

              {/* Right side - Product Info */}
              <Stack className={'jewellery-info'}>
                <Typography variant="h4" className={'jewellery-title'}>
                  {jewellery?.jewelleryTitle || 'Lira Earrings'}
                </Typography>
                <Typography variant="h6" className={'jewellery-price'}>
                  ${jewellery?.jewelleryPrice ? formatterStr(jewellery.jewelleryPrice) : '20.00'}
                </Typography>

                <Box className={'rating-container'}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`star ${i < (jewellery?.jewelleryRank || 5) ? 'filled' : ''}`}>
                      ★
                    </span>
                  ))}
                  <Typography variant="body2" className={'review-count'}>
                    Rank of this product is - {jewellery?.jewelleryRank} 
                  </Typography>
                </Box>

                <Typography variant="body1" className={'jewellery-description'}>
                  {jewellery?.jewelleryDesc ||
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat, augue a volutpat hendrerit, sapien tortor faucibus augue, a maximus elit ex vitae libero. Sed quis mauris eget arcu facilisis consequat sed eu felis.'}
                </Typography>

                <Stack direction="row" spacing={2} className={'quantity-cart-container'}>
                  <Box className={'quantity-selector'}>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange('decrease')}
                      disabled={quantity <= 1}
                      className={'quantity-button'}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography className={'quantity-value'}>{quantity}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange('increase')}
                      className={'quantity-button'}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Button variant="contained" fullWidth className={'add-to-cart-button'}>
                    ADD TO CART
                  </Button>
                </Stack>

                <Stack direction="row" spacing={2} className={'social-container'}>
                  <IconButton className={'social-button'}>
                    {jewellery?.meLiked && jewellery?.meLiked[0]?.myFavorite ? (
                      <FavoriteIcon />
                    ) : (
                      <FavoriteBorderIcon onClick={() => likeJewelleryHandler(user, jewellery?._id || '')} />
                    )}
                  </IconButton>
                  <IconButton className={'social-button'}>
                    <EmailIcon />
                  </IconButton>
                  <IconButton className={'social-button'}>
                    <FacebookIcon />
                  </IconButton>
                  <IconButton className={'social-button'}>
                    <InstagramIcon />
                  </IconButton>
                  <IconButton className={'social-button'}>
                    <TwitterIcon />
                  </IconButton>
                </Stack>

                <Box className={'product-meta'}>
                  <Typography variant="body2" className={'meta-item'}>
                    <span className={'meta-label'}>GRAM:</span> {jewellery?.jewelleryGram || '12'} grams
                  </Typography>
                  <Typography variant="body2" className={'meta-item'}>
                    <span className={'meta-label'}>Categories:</span> {jewellery?.jewelleryType || 'Fashion, Style'}
                  </Typography>
                </Box>
              </Stack>
            </Stack>

            {/* Tabs Section */}
            <Box className={'tabs-container'}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="jewellery information tabs"
                className={'tabs-navigation'}
              >
                <Tab label="Description" id="tab-0" aria-controls="tabpanel-0" />
                <Tab label="Additional information" id="tab-1" aria-controls="tabpanel-1" />
                <Tab label={`Reviews(${commentTotal})`} id="tab-2" aria-controls="tabpanel-2" />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                <Typography variant="body1" className={'tab-content'}>
                  {jewellery?.jewelleryDesc ||
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat, augue a volutpat hendrerit, sapien tortor faucibus augue, a maximus elit ex vitae libero. Sed quis mauris eget arcu facilisis consequat sed eu felis.'}
                </Typography>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Box className={'additional-info'}>
                  <Box className={'info-row'}>
                    <Typography className={'info-label'}>Weight</Typography>
                    <Typography className={'info-value'}>{jewellery?.jewelleryGram || '0.3'} gram</Typography>
                  </Box>
                  <Box className={'info-row'}>
                    <Typography className={'info-label'}>Dimensions</Typography>
                    <Typography className={'info-value'}>N/A</Typography>
                  </Box>
                  <Box className={'info-row'}>
                    <Typography className={'info-label'}>Materials</Typography>
                    <Typography className={'info-value'}>Gold</Typography>
                  </Box>
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                {commentTotal > 0 ? (
                  <Stack className={'review-list'}>
                    {jewelleryComments?.map((comment: Comment) => (
                      <Review comment={comment} key={comment?._id} />
                    ))}
                    <Box component={'div'} className={'pagination-box'}>
                      <MuiPagination
                        page={commentInquiry.page}
                        count={Math.ceil(commentTotal / commentInquiry.limit)}
                        onChange={commentPaginationChangeHandler}
                        shape="circular"
                        color="primary"
                      />
                    </Box>
                  </Stack>
                ) : (
                  <Typography variant="body1" className={'no-reviews'}>
                    No reviews yet.
                  </Typography>
                )}

                <Stack className={'leave-review-config'}>
                  <Typography className={'review-title'}>Leave A Review</Typography>
                  <textarea
                    onChange={({ target: { value } }: any) => {
                      setInsertCommentData({ ...insertCommentData, commentContent: value });
                    }}
                    value={insertCommentData.commentContent}
                    className={'review-textarea'}
                    placeholder="Write your review here..."
                  ></textarea>
                  <Box className={'submit-btn'} component={'div'}>
                    <Button
                      className={'submit-review'}
                      disabled={insertCommentData.commentContent === '' || !user?._id}
                      onClick={createCommentHandler}
                    >
                      Submit Review
                    </Button>
                  </Box>
                </Stack>
              </TabPanel>
            </Box>

            {/* Similar Items Section */}
            {destinationJewelleries.length > 0 && (
              <Stack className={'similar-items'}>
                <Typography variant="h5" className={'section-title'}>
                  Similar Items
                </Typography>
                <Stack className={'cards-box'}>
                  <Swiper
                    className={'similar-items-swiper'}
                    slidesPerView={3}
                    spaceBetween={35}
                    modules={[Autoplay, Navigation, Pagination]}
                    navigation={{
                      nextEl: '.swiper-similar-next',
                      prevEl: '.swiper-similar-prev',
                    }}
                    pagination={{
                      el: '.swiper-similar-pagination',
                    }}
                  >
                    {destinationJewelleries.map((jewellery: Jewellery) => (
                      <SwiperSlide className={'similar-item-slide'} key={jewellery._id}>
                        <JewelleryBigCard
                          likeJewelleryHandler={likeJewelleryHandler}
                          jewellery={jewellery}
                          key={jewellery?._id}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <Stack direction="row" spacing={2} className={'pagination-box'}>
                    <WestIcon className={'swiper-similar-prev'} />
                    <div className={'swiper-similar-pagination'}></div>
                    <EastIcon className={'swiper-similar-next'} />
                  </Stack>
                </Stack>
              </Stack>
            )}
          </Stack>
        </div>
      </div>
    );
  }
};

JewelleryDetail.defaultProps = {
  initialComment: {
    page: 1,
    limit: 5,
    sort: 'createdAt',
    direction: 'DESC',
    search: {
      commentRefId: '',
    },
  },
};

export default withLayoutFull(JewelleryDetail);
