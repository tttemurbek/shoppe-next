import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Jewellery } from '../../types/jewellery/jewellery';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface TrendJewelleryCardProps {
  jewellery: Jewellery;
  likeJewelleryHandler: any;
}

const TrendJewelleryCard = (props: TrendJewelleryCardProps) => {
  const { jewellery, likeJewelleryHandler } = props;
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);

  /** HANDLERS **/

  const pushDetailHandler = async (jewelleryId: string) => {
    console.log('ID:', jewelleryId);
    await router.push({ pathname: '/jewellery/detail', query: { id: jewelleryId } });
  };

  if (device === 'mobile') {
    return (
      <Stack className="trend-card-box" key={jewellery._id}>
        <Box
          component={'div'}
          className={'card-img'}
          style={{ backgroundImage: `url(${REACT_APP_API_URL}/${jewellery?.jewelleryImages[0]})` }}
          onClick={() => {
            pushDetailHandler(jewellery._id);
          }}
        >
          <div>${jewellery.jewelleryPrice}</div>
        </Box>
        <Box component={'div'} className={'info'}>
          <strong
            className={'title'}
            onClick={() => {
              pushDetailHandler(jewellery._id);
            }}
          >
            {jewellery.jewelleryTitle}
          </strong>
          <p className={'desc'}>{jewellery.jewelleryDesc ?? 'no description'}</p>
          <div className={'options'}>
            <div>
              <img src="/img/icons/bed.svg" alt="" />
              <span>{jewellery.propertyBeds} bed</span>
            </div>
            <div>
              <img src="/img/icons/room.svg" alt="" />
              <span>{jewellery.propertyRooms} rooms</span>
            </div>
            <div>
              <img src="/img/icons/expand.svg" alt="" />
              <span>{jewellery.propertySquare} m2</span>
            </div>
          </div>
          <Divider sx={{ mt: '15px', mb: '17px' }} />
          <div className={'bott'}>
            <p>
              {jewellery.jewelleryRent ? 'Rent' : ''} {jewellery.jewelleryRent && jewellery.jewelleryBarter && '/'}{' '}
              {jewellery.jewelleryBarter ? 'Barter' : ''}
            </p>
            <div className="view-like-box">
              <IconButton color={'default'}>
                <RemoveRedEyeIcon />
              </IconButton>
              <Typography className="view-cnt">{jewellery?.jewelleryViews}</Typography>
              <IconButton color={'default'} onClick={() => likeJewelleryHandler(user, jewellery?._id)}>
                {jewellery?.meLiked && jewellery?.meLiked[0]?.myFavorite ? (
                  <FavoriteIcon style={{ color: 'red' }} />
                ) : (
                  <FavoriteIcon />
                )}
              </IconButton>
              <Typography className="view-cnt">{jewellery?.jewelleryLikes}</Typography>
            </div>
          </div>
        </Box>
      </Stack>
    );
  } else {
    return (
      <Stack className="trend-card-box" key={jewellery._id}>
        <Box
          component={'div'}
          className={'card-img'}
          style={{ backgroundImage: `url(${REACT_APP_API_URL}/${jewellery?.jewelleryImages[0]})` }}
          onClick={() => {
            pushDetailHandler(jewellery._id);
          }}
        >
          <div>${jewellery.jewelleryPrice}</div>
        </Box>
        <Box component={'div'} className={'info'}>
          <strong
            className={'title'}
            onClick={() => {
              pushDetailHandler(jewellery._id);
            }}
          >
            {jewellery.jewelleryTitle}
          </strong>
          <p className={'desc'}>{jewellery.jewelleryDesc ?? 'no description'}</p>
          {/* <div className={'options'}>
            <div>
              <img src="/img/icons/bed.svg" alt="" />
              <span>{jewellery.propertyBeds} bed</span>
            </div>
            <div>
              <img src="/img/icons/room.svg" alt="" />
              <span>{jewellery.propertyRooms} rooms</span>
            </div>
            <div>
              <img src="/img/icons/expand.svg" alt="" />
              <span>{jewellery.propertySquare} m2</span>
            </div>
          </div> */}
          <Divider sx={{ mt: '15px', mb: '17px' }} />
          <div className={'bott'}>
            <p>
              {jewellery.jewelleryRent ? 'Rent' : ''} {jewellery.jewelleryRent && jewellery.jewelleryBarter && '/'}{' '}
              {jewellery.jewelleryBarter ? 'Barter' : ''}
            </p>
            <div className="view-like-box">
              <IconButton color={'default'}>
                <RemoveRedEyeIcon />
              </IconButton>
              <Typography className="view-cnt">{jewellery?.jewelleryViews}</Typography>
              <IconButton color={'default'} onClick={() => likeJewelleryHandler(user, jewellery?._id)}>
                {jewellery?.meLiked && jewellery?.meLiked[0]?.myFavorite ? (
                  <FavoriteIcon style={{ color: 'red' }} />
                ) : (
                  <FavoriteIcon />
                )}
              </IconButton>
              <Typography className="view-cnt">{jewellery?.jewelleryLikes}</Typography>
            </div>
          </div>
        </Box>
      </Stack>
    );
  }
};

export default TrendJewelleryCard;
