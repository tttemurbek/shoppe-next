import React from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Box } from '@mui/material';
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

  if (device === 'mobile') {
    return <div>COMMUNITY CARD (MOBILE)</div>;
  } else {
    if (vertical) {
      return (
        <Link href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}>
          <Box component={'div'} className={'vertical-card'}>
            <div className={'community-img'} style={{ backgroundImage: `url(${articleImage})` }}>
              <div className="index-badge">{index + 1}</div>
            </div>
            <div className="card-content">
              <strong>{article?.articleTitle}</strong>
              <span className="category-tag">Free Board</span>
            </div>
          </Box>
        </Link>
      );
    } else {
      return (
        <Link href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}>
          <Box component={'div'} className="horizontal-card">
            <div className="image-container">
              <img src={articleImage} alt={article.articleTitle} />
            </div>
            <div className="card-content">
              <strong>{article.articleTitle}</strong>
              <span className="date-tag">
                <Moment format="DD.MM.YY">{article?.createdAt}</Moment>
              </span>
            </div>
          </Box>
        </Link>
      );
    }
  }
};

export default CommunityCard;
