import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Jewellery } from '../../types/jewellery/jewellery';
import Link from 'next/link';
import { formatterStr } from '../../utils';
import { REACT_APP_API_URL, topJewelleryRank } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

interface JewelleryCardType {
  jewellery: Jewellery;
  likeJewelleryHandler?: any;
  myFavorites?: boolean;
  recentlyVisited?: boolean;
}

const JewelleryCard = (props: JewelleryCardType) => {
  const { jewellery, likeJewelleryHandler, myFavorites, recentlyVisited } = props;
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const imagePath: string = jewellery?.jewelleryImages[0]
    ? `${REACT_APP_API_URL}/${jewellery?.jewelleryImages[0]}`
    : '/img/banner/header1.svg';

  if (device === 'mobile') {
    return <div>JEWELLEY CARD</div>;
  } else {
    return (
      <Stack className="card-config">
        <Stack className="top">
          <Link
            href={{
              pathname: '/jewellery/detail',
              query: { id: jewellery?._id },
            }}
          >
            <img src={imagePath} alt="" />
          </Link>
          {jewellery && jewellery?.jewelleryRank > topJewelleryRank && (
            <Box component={'div'} className={'top-badge'}>
              <img src="/img/icons/electricity.svg" alt="" />
              <Typography>TOP</Typography>
            </Box>
          )}
          <Box component={'div'} className={'price-box'}>
            <Typography>${formatterStr(jewellery?.jewelleryPrice)}</Typography>
          </Box>
        </Stack>
        <Stack className="bottom">
          <Stack className="name-address">
            <Stack className="name">
              <Link
                href={{
                  pathname: '/jewellery/detail',
                  query: { id: jewellery?._id },
                }}
              >
                <Typography>{jewellery.jewelleryTitle}</Typography>
              </Link>
            </Stack>
            <Stack className="address">
              <Typography>
                {jewellery.jewelleryAddress}, {jewellery.jewelleryLocation}
              </Typography>
            </Stack>
            <Stack className="gram">
              <Typography>{jewellery.jewelleryGram} grams</Typography>
            </Stack>
          </Stack>
          {/* <Stack className="options">
            <Stack className="option">
              <img src="/img/icons/bed.svg" alt="" /> <Typography>{jewellery.propertyBeds} bed</Typography>
            </Stack>
            <Stack className="option">
              <img src="/img/icons/room.svg" alt="" /> <Typography>{jewellery.propertyRooms} room</Typography>
            </Stack>
            <Stack className="option">
              <img src="/img/icons/expand.svg" alt="" /> <Typography>{jewellery.propertySquare} m2</Typography>
            </Stack>
          </Stack> */}
          <Stack className="divider"></Stack>
          <Stack className="type-buttons">
            {!recentlyVisited && (
              <Stack className="buttons">
                <IconButton color={'default'}>
                  <RemoveRedEyeIcon />
                  <Typography className="view-cnt">{jewellery?.jewelleryViews}</Typography>
                </IconButton>
                <IconButton color={'default'} onClick={() => likeJewelleryHandler(user, jewellery?._id)}>
                  {myFavorites ? (
                    <FavoriteIcon color="primary" />
                  ) : jewellery?.meLiked && jewellery?.meLiked[0]?.myFavorite ? (
                    <FavoriteIcon color="primary" />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                  <Typography className="view-cnt">{jewellery?.jewelleryLikes}</Typography>
                </IconButton>
                <IconButton color={'default'} onClick={() => likeJewelleryHandler('user', 'jewellery?._id')}>
                  <AddShoppingCartIcon />
                  <Typography className="view-cnt">{jewellery?.jewelleryLikes}</Typography>
                </IconButton>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
    );
  }
};

export default JewelleryCard;
