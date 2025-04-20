import React, { useState } from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography, Grid, Box, Container } from '@mui/material';
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

  const SectionHeader = ({ title, link, icon = '/img/icons/arrowBig.svg', alt = 'View all' }) => (
    <Stack className="content-top">
      <Link href={link}>
        <span>{title}</span>
      </Link>
      <img src={icon} alt={alt} />
    </Stack>
  );

  if (device === 'mobile') {
    return (
      <Stack className="community-board-mobile">
        <Container>
          <Typography variant="h2" className="mobile-title">
            Community Highlights
          </Typography>
          <Box sx={{ mt: 3 }}>
            <SectionHeader title="News & Updates" link="/community?articleCategory=NEWS" />
            <Grid container spacing={2}>
              {newsArticles.slice(0, 4).map((article, index) => (
                <Grid item xs={6} key={article?._id}>
                  <CommunityCard vertical={true} article={article} index={index} />
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 4 }}>
              <SectionHeader title="Free Discussions" link="/community?articleCategory=FREE" />
              <Stack spacing={2}>
                {freeArticles.map((article, index) => (
                  <CommunityCard vertical={false} article={article} index={index} key={article?._id} />
                ))}
              </Stack>
            </Box>
          </Box>
        </Container>
      </Stack>
    );
  }

  return (
    <Stack className="community-board">
      <Container className="container">
        <Stack className="section-header">
          <Typography variant="h1">Community Highlights</Typography>
          <Typography variant="subtitle1" className="section-subtitle">
            Discover the latest updates and discussions
          </Typography>
        </Stack>

        <Grid container spacing={4} className="community-main">
          {/* News Section - Left Column */}
          <Grid item xs={12} md={6} className="community-section">
            <SectionHeader title="News & Updates" link="/community?articleCategory=NEWS" />
            <Grid container spacing={3} className="card-grid">
              {newsArticles.map((article, index) => (
                <Grid item xs={6} sm={4} key={article?._id}>
                  <CommunityCard vertical={true} article={article} index={index} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Free Discussions - Right Column */}
          <Grid item xs={12} md={6} className="community-section">
            <SectionHeader title="Free Discussions" link="/community?articleCategory=FREE" />
            <Stack className="vertical-list" spacing={2.5}>
              {freeArticles.map((article, index) => (
                <CommunityCard vertical={false} article={article} index={index} key={article?._id} />
              ))}
            </Stack>
          </Grid>

          {/* Recommended Section */}
          <Grid item xs={12} md={6} className="community-section">
            <SectionHeader title="Recommended" link="/community?articleCategory=RECOMMEND" />
            <Grid container spacing={3} className="card-grid">
              {recommendArticles.map((article, index) => (
                <Grid item xs={6} sm={4} key={article?._id}>
                  <CommunityCard vertical={true} article={article} index={index} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Humor Section */}
          <Grid item xs={12} md={6} className="community-section">
            <SectionHeader title="Humor" link="/community?articleCategory=HUMOR" />
            <Grid container spacing={3} className="card-grid">
              {humorArticles.map((article, index) => (
                <Grid item xs={6} sm={4} key={article?._id}>
                  <CommunityCard vertical={true} article={article} index={index} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Stack>
  );
};

export default CommunityBoards;
