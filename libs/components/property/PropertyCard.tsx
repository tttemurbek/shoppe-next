import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Property } from '../../types/jewellery/jewellery';
import Link from 'next/link';
import { formatterStr } from '../../utils';
import { REACT_APP_API_URL, topPropertyRank } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

interface PropertyCardType {
  property: Property;
  likePropertyHandler?: any;
  myFavorites?: boolean;
  recentlyVisited?: boolean;
}

const PropertyCard = (props: PropertyCardType) => {
  const { property, likePropertyHandler, myFavorites, recentlyVisited } = props;
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const imagePath: string = property?.jewelleryImages[0]
    ? `${REACT_APP_API_URL}/${property?.jewelleryImages[0]}`
    : '/img/banner/header1.svg';

  if (device === 'mobile') {
    return <div>PROPERTY CARD</div>;
  } else {
    return (
      <Stack className="card-config">
        <Stack className="top">
          <Link
            href={{
              pathname: '/property/detail',
              query: { id: property?._id },
            }}
          >
            <img src={imagePath} alt="" />
          </Link>
          {property && property?.jewelleryRank > topPropertyRank && (
            <Box component={'div'} className={'top-badge'}>
              <img src="/img/icons/electricity.svg" alt="" />
              <Typography>TOP</Typography>
            </Box>
          )}
          <Box component={'div'} className={'price-box'}>
            <Typography>${formatterStr(property?.jewelleryPrice)}</Typography>
          </Box>
        </Stack>
        <Stack className="bottom">
          <Stack className="name-address">
            <Stack className="name">
              <Link
                href={{
                  pathname: '/property/detail',
                  query: { id: property?._id },
                }}
              >
                <Typography>{property.jewelleryTitle}</Typography>
              </Link>
            </Stack>
            <Stack className="address">
              <Typography>
                {property.jewelleryAddress}, {property.jewelleryLocation}
              </Typography>
            </Stack>
          </Stack>
          <Stack className="options">
            <Stack className="option">
              <img src="/img/icons/bed.svg" alt="" /> <Typography>{property.propertyBeds} bed</Typography>
            </Stack>
            <Stack className="option">
              <img src="/img/icons/room.svg" alt="" /> <Typography>{property.propertyRooms} room</Typography>
            </Stack>
            <Stack className="option">
              <img src="/img/icons/expand.svg" alt="" /> <Typography>{property.propertySquare} m2</Typography>
            </Stack>
          </Stack>
          <Stack className="divider"></Stack>
          <Stack className="type-buttons">
            <Stack className="type">
              <Typography
                sx={{ fontWeight: 500, fontSize: '13px' }}
                className={property.jewelleryRent ? '' : 'disabled-type'}
              >
                Rent
              </Typography>
              <Typography
                sx={{ fontWeight: 500, fontSize: '13px' }}
                className={property.jewelleryBarter ? '' : 'disabled-type'}
              >
                Barter
              </Typography>
            </Stack>
            {!recentlyVisited && (
              <Stack className="buttons">
                <IconButton color={'default'}>
                  <RemoveRedEyeIcon />
                </IconButton>
                <Typography className="view-cnt">{property?.jewelleryViews}</Typography>
                <IconButton color={'default'} onClick={() => likePropertyHandler(user, property?._id)}>
                  {myFavorites ? (
                    <FavoriteIcon color="primary" />
                  ) : property?.meLiked && property?.meLiked[0]?.myFavorite ? (
                    <FavoriteIcon color="primary" />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
                <Typography className="view-cnt">{property?.jewelleryLikes}</Typography>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
    );
  }
};

export default PropertyCard;
