import React from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Box, Typography, Badge } from '@mui/material';
import Moment from 'react-moment';
import { BoardArticle } from '../../types/board-article/board-article';

interface CommunityCardProps {
  vertical: boolean;
  article: BoardArticle;
  index: number;
}

const CommunityCard = (props: CommunityCardProps) => {
  const { vertical, article, index } = props;
  const device = useDeviceDetect();
  const articleImage = article?.articleImage
    ? `${process.env.REACT_APP_API_URL}/${article?.articleImage}`
    : '/img/event.svg';

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'NEWS':
        return 'News';
      case 'FREE':
        return 'Free Board';
      case 'RECOMMEND':
        return 'Recommended';
      case 'HUMOR':
        return 'Humor';
      default:
        return 'Discussion';
    }
  };

  if (device === 'mobile') {
    return (
      <Link href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}>
        <Box className={vertical ? 'mobile-vertical-card' : 'mobile-horizontal-card'}>
          <Box
            className="card-image"
            sx={{
              backgroundImage: `url(${articleImage})`,
              position: 'relative',
              height: vertical ? '120px' : '80px',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            {vertical && <Box className="index-badge">{index + 1}</Box>}
          </Box>
          <Box className="card-content">
            <Typography variant="body1" className="card-title">
              {article?.articleTitle}
            </Typography>
            <Box className="card-meta">
              {vertical ? (
                <Typography variant="caption" className="category-tag">
                  {getCategoryLabel(article?.articleCategory)}
                </Typography>
              ) : (
                <Typography variant="caption" className="date-tag">
                  <Moment format="DD.MM.YY">{article?.createdAt}</Moment>
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Link>
    );
  }

  if (vertical) {
    return (
      <Link href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}>
        <Box className="vertical-card">
          <Box className="community-img" style={{ backgroundImage: `url(${articleImage})` }}>
            <Box className="index-badge">{index + 1}</Box>
          </Box>
          <Box className="card-content">
            <Typography variant="body1" component="strong">
              {article?.articleTitle}
            </Typography>
            <Typography variant="caption" className="category-tag">
              {getCategoryLabel(article?.articleCategory)}
            </Typography>
          </Box>
        </Box>
      </Link>
    );
  }

  return (
    <Link href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}>
      <Box className="horizontal-card">
        <Box className="image-container">
          <img src={articleImage} alt={article.articleTitle} />
        </Box>
        <Box className="card-content">
          <Typography variant="body1" component="strong">
            {article.articleTitle}
          </Typography>
          <Typography variant="caption" className="date-tag">
            <Moment format="DD.MM.YY">{article?.createdAt}</Moment>
          </Typography>
        </Box>
      </Box>
    </Link>
  );
};

export default CommunityCard;
