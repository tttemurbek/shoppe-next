import React, { useState } from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography } from '@mui/material';
import CommunityCard from './CommunityCard';
import { BoardArticle } from '../../types/board-article/board-article';
import { useQuery } from '@apollo/client';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { BoardArticleCategory } from '../../enums/board-article.enum';

const CommunityBoards = () => {
  const device = useDeviceDetect();
  const [searchCommunity, setSearchCommunity] = useState({
    page: 1,
    sort: 'articleViews',
    direction: 'DESC',
  });
  const [newsArticles, setNewsArticles] = useState<BoardArticle[]>([]);
  const [freeArticles, setFreeArticles] = useState<BoardArticle[]>([]);
  const [recommendArticles, setRecommendArticles] = useState<BoardArticle[]>([]);
  const [humorArticles, setHumorArticles] = useState<BoardArticle[]>([]);

  /** APOLLO REQUESTS **/
  const {
    loading: getNewsArticlesLoading,
    data: getNewsArticlesData,
    error: getNewsArticlesError,
    refetch: getNewsArticlesRefetch,
  } = useQuery(GET_BOARD_ARTICLES, {
    fetchPolicy: 'network-only',
    variables: { input: { ...searchCommunity, limit: 6, search: { articleCategory: BoardArticleCategory.NEWS } } },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setNewsArticles(data?.getBoardArticles?.list);
    },
  });

  const {
    loading: getFreeArticlesLoading,
    data: getFreeArticlesData,
    error: getFreeArticlesError,
    refetch: getFreeArticlesRefetch,
  } = useQuery(GET_BOARD_ARTICLES, {
    fetchPolicy: 'network-only',
    variables: { input: { ...searchCommunity, limit: 3, search: { articleCategory: BoardArticleCategory.FREE } } },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setFreeArticles(data?.getBoardArticles?.list);
    },
  });

  const {
    loading: getRecommendArticlesLoading,
    data: getRecommendArticlesData,
    error: getRecommendArticlesError,
    refetch: getRecommendArticlesRefetch,
  } = useQuery(GET_BOARD_ARTICLES, {
    fetchPolicy: 'network-only',
    variables: { input: { ...searchCommunity, limit: 3, search: { articleCategory: BoardArticleCategory.RECOMMEND } } },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setRecommendArticles(data?.getBoardArticles?.list);
    },
  });

  const {
    loading: getHumorArticlesLoading,
    data: getHumorArticlesData,
    error: getHumorArticlesError,
    refetch: getHumorArticlesRefetch,
  } = useQuery(GET_BOARD_ARTICLES, {
    fetchPolicy: 'network-only',
    variables: { input: { ...searchCommunity, limit: 3, search: { articleCategory: BoardArticleCategory.HUMOR } } },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setHumorArticles(data?.getBoardArticles?.list);
    },
  });

  if (device === 'mobile') {
    return <div>COMMUNITY BOARDS (MOBILE)</div>;
  } else {
    return (
      <Stack className={'community-board'}>
        <Stack className={'container'}>
          <Stack className="section-header">
            <Typography variant={'h1'}>Community Highlights</Typography>
            <Typography variant="subtitle1" className="section-subtitle">
              Discover the latest updates and discussions
            </Typography>
          </Stack>
          <Stack className="community-main">
            <Stack className={'community-left'}>
              <Stack className={'content-top'}>
                <Link href={'/community?articleCategory=NEWS'}>
                  <span>News & Updates</span>
                </Link>
                <img src="/img/icons/arrowBig.svg" alt="View all news" />
              </Stack>
              <Stack className={'card-wrap'}>
                {newsArticles.map((article, index) => (
                  <CommunityCard vertical={true} article={article} index={index} key={article?._id} />
                ))}
              </Stack>
            </Stack>
            <Stack className={'community-right'}>
              <Stack className={'content-top'}>
                <Link href={'/community?articleCategory=FREE'}>
                  <span>Free Discussions</span>
                </Link>
                <img src="/img/icons/arrowBig.svg" alt="View all discussions" />
              </Stack>
              <Stack className={'card-wrap vertical'}>
                {freeArticles.map((article, index) => (
                  <CommunityCard vertical={false} article={article} index={index} key={article?._id} />
                ))}
              </Stack>
            </Stack>
            <Stack className={'community-bottom-left'}>
              <Stack className={'content-top'}>
                <Link href={'/community?articleCategory=RECOMMEND'}>
                  <span>Recommended</span>
                </Link>
                <img src="/img/icons/arrowBig.svg" alt="View all recommendations" />
              </Stack>
              <Stack className={'card-wrap vertical'}>
                {recommendArticles.map((article, index) => (
                  <CommunityCard vertical={true} article={article} index={index} key={article?._id} />
                ))}
              </Stack>
            </Stack>
            <Stack className={'community-bottom-right'}>
              <Stack className={'content-top'}>
                <Link href={'/community?articleCategory=HUMOR'}>
                  <span>Recommended</span>
                </Link>
                <img src="/img/icons/arrowBig.svg" alt="View all recommendations" />
              </Stack>
              <Stack className={'card-wrap vertical'}>
                {humorArticles.map((article, index) => (
                  <CommunityCard vertical={true} article={article} index={index} key={article?._id} />
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    );
  }
};

export default CommunityBoards;
