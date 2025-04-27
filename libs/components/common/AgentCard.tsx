import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Box, Typography, Tooltip } from '@mui/material';
import Link from 'next/link';
import { REACT_APP_API_URL } from '../../config';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface AgentCardProps {
  agent: any;
  likeMemberHandler: any;
}

const AgentCard = (props: AgentCardProps) => {
  const { agent, likeMemberHandler } = props;
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const imagePath: string = agent?.memberImage
    ? `${REACT_APP_API_URL}/${agent?.memberImage}`
    : '/img/profile/defaultUser.svg';

  if (device === 'mobile') {
    return (
      <Stack className="agent-general-card mobile">
        <Box
          component={'div'}
          className={'agent-img'}
          style={{
            backgroundImage: `url(${imagePath})`,
          }}
        >
          <div className="property-badge">{agent?.memberJewelleries} properties</div>
        </Box>
        <Stack className={'agent-desc'}>
          <Box component={'div'} className={'agent-info'}>
            <strong>{agent?.memberFullName ?? agent?.memberNick}</strong>
            <span>Agent</span>
          </Box>
          <Box component={'div'} className={'buttons'}>
            <span className="stat-item">
              <RemoveRedEyeIcon />
              <Typography className="view-cnt">{agent?.memberViews}</Typography>
            </span>
            <span className="stat-item" onClick={() => likeMemberHandler(user, agent?._id)}>
              {agent?.meLiked && agent?.meLiked[0]?.myFavorite ? (
                <FavoriteIcon color={'primary'} />
              ) : (
                <FavoriteBorderIcon />
              )}
              <Typography className="view-cnt">{agent?.memberLikes}</Typography>
            </span>
          </Box>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack className="agent-general-card">
      <Link
        href={{
          pathname: '/agent/detail',
          query: { agentId: agent?._id },
        }}
      >
        <Box
          component={'div'}
          className={'agent-img'}
          style={{
            backgroundImage: `url(${imagePath})`,
          }}
        >
          <div className="property-badge">{agent?.memberJewelleries} properties</div>
          <div className="hover-overlay">
            <span>View Profile</span>
          </div>
        </Box>
      </Link>

      <Stack className={'agent-desc'}>
        <Box component={'div'} className={'agent-info'}>
          <Link
            href={{
              pathname: '/agent/detail',
              query: { agentId: agent?._id },
            }}
          >
            <strong>{agent?.memberFullName ?? agent?.memberNick}</strong>
          </Link>
          <span>Agent</span>
        </Box>
        <Box component={'div'} className={'buttons'}>
          <Tooltip title="Views">
            <IconButton className="stat-button">
              <RemoveRedEyeIcon />
              <Typography className="view-cnt">{agent?.memberViews}</Typography>
            </IconButton>
          </Tooltip>
          <Tooltip
            title={agent?.meLiked && agent?.meLiked[0]?.myFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <IconButton className="stat-button" onClick={() => likeMemberHandler(user, agent?._id)}>
              {agent?.meLiked && agent?.meLiked[0]?.myFavorite ? (
                <FavoriteIcon color={'primary'} />
              ) : (
                <FavoriteBorderIcon />
              )}
              <Typography className="view-cnt">{agent?.memberLikes}</Typography>
            </IconButton>
          </Tooltip>
        </Box>
      </Stack>
    </Stack>
  );
};

export default AgentCard;
