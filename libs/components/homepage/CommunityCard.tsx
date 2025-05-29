// @ts-nocheck
import Link from 'next/link';
// @ts-ignore
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Box, Typography } from '@mui/material';
// @ts-ignore
import Moment from 'react-moment';

// Add type definition or use any
interface BoardArticle {
  _id: string;
  articleTitle: string;
  articleCategory: string;
  articleImage?: string;
  createdAt: string | Date;
  [key: string]: any; // Allow additional properties
}

interface CommunityCardProps {
  vertical: boolean;
  article: BoardArticle;
  index: number;
}

const CommunityCard = (props: CommunityCardProps) => {
  const { vertical, article, index } = props;

  // Add fallback for device detection
  let device: string;
  try {
    device = useDeviceDetect();
  } catch (error) {
    // Fallback if hook is not available
    device = 'desktop';
  }

  // Fix environment variable for Next.js
  const articleImage = article?.articleImage
    ? `${process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL || ''}/${article?.articleImage}`
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

  // Add fallback for date formatting
  const formatDate = (date: string | Date) => {
    try {
      // @ts-ignore
      return <Moment format="DD.MM.YY">{date}</Moment>;
    } catch (error) {
      // Fallback if Moment is not available
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      });
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
              backgroundSize: 'cover',
              backgroundPosition: 'center',
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
                  {formatDate(article?.createdAt)}
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
          <Box
            className="community-img"
            style={{
              backgroundImage: `url(${articleImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
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
          <img
            src={articleImage || '/placeholder.svg'}
            alt={article?.articleTitle || 'Article image'}
            onError={(e: any) => {
              e.target.src = '/img/event.svg';
            }}
          />
        </Box>
        <Box className="card-content">
          <Typography variant="body1" component="strong">
            {article?.articleTitle}
          </Typography>
          <Typography variant="caption" className="date-tag">
            {formatDate(article?.createdAt)}
          </Typography>
        </Box>
      </Box>
    </Link>
  );
};

export default CommunityCard;
