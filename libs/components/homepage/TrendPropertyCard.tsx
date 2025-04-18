import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Property } from '../../types/jewellery/jewellery';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface TrendPropertyCardProps {
  property: Property;
  likePropertyHandler: any;
}

const TrendPropertyCard = (props: TrendPropertyCardProps) => {
  const { property, likePropertyHandler } = props;
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);

  /** HANDLERS **/

  const pushDetailHandler = async (propertyId: string) => {
    console.log('ID:', propertyId);
    await router.push({ pathname: '/property/detail', query: { id: propertyId } });
  };

  if (device === 'mobile') {
    return (
      <Stack className="trend-card-box" key={property._id}>
        <Box
          component={'div'}
          className={'card-img'}
          style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.jewelleryImages[0]})` }}
          onClick={() => {
            pushDetailHandler(property._id);
          }}
        >
          <div>${property.jewelleryPrice}</div>
        </Box>
        <Box component={'div'} className={'info'}>
          <strong
            className={'title'}
            onClick={() => {
              pushDetailHandler(property._id);
            }}
          >
            {property.jewelleryTitle}
          </strong>
          <p className={'desc'}>{property.jewelleryDesc ?? 'no description'}</p>
          <div className={'options'}>
            <div>
              <img src="/img/icons/bed.svg" alt="" />
              <span>{property.propertyBeds} bed</span>
            </div>
            <div>
              <img src="/img/icons/room.svg" alt="" />
              <span>{property.propertyRooms} rooms</span>
            </div>
            <div>
              <img src="/img/icons/expand.svg" alt="" />
              <span>{property.propertySquare} m2</span>
            </div>
          </div>
          <Divider sx={{ mt: '15px', mb: '17px' }} />
          <div className={'bott'}>
            <p>
              {property.jewelleryRent ? 'Rent' : ''} {property.jewelleryRent && property.jewelleryBarter && '/'}{' '}
              {property.jewelleryBarter ? 'Barter' : ''}
            </p>
            <div className="view-like-box">
              <IconButton color={'default'}>
                <RemoveRedEyeIcon />
              </IconButton>
              <Typography className="view-cnt">{property?.jewelleryViews}</Typography>
              <IconButton color={'default'} onClick={() => likePropertyHandler(user, property?._id)}>
                {property?.meLiked && property?.meLiked[0]?.myFavorite ? (
                  <FavoriteIcon style={{ color: 'red' }} />
                ) : (
                  <FavoriteIcon />
                )}
              </IconButton>
              <Typography className="view-cnt">{property?.jewelleryLikes}</Typography>
            </div>
          </div>
        </Box>
      </Stack>
    );
  } else {
    return (
      <Stack className="trend-card-box" key={property._id}>
        <Box
          component={'div'}
          className={'card-img'}
          style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.jewelleryImages[0]})` }}
          onClick={() => {
            pushDetailHandler(property._id);
          }}
        >
          <div>${property.jewelleryPrice}</div>
        </Box>
        <Box component={'div'} className={'info'}>
          <strong
            className={'title'}
            onClick={() => {
              pushDetailHandler(property._id);
            }}
          >
            {property.jewelleryTitle}
          </strong>
          <p className={'desc'}>{property.jewelleryDesc ?? 'no description'}</p>
          <div className={'options'}>
            <div>
              <img src="/img/icons/bed.svg" alt="" />
              <span>{property.propertyBeds} bed</span>
            </div>
            <div>
              <img src="/img/icons/room.svg" alt="" />
              <span>{property.propertyRooms} rooms</span>
            </div>
            <div>
              <img src="/img/icons/expand.svg" alt="" />
              <span>{property.propertySquare} m2</span>
            </div>
          </div>
          <Divider sx={{ mt: '15px', mb: '17px' }} />
          <div className={'bott'}>
            <p>
              {property.jewelleryRent ? 'Rent' : ''} {property.jewelleryRent && property.jewelleryBarter && '/'}{' '}
              {property.jewelleryBarter ? 'Barter' : ''}
            </p>
            <div className="view-like-box">
              <IconButton color={'default'}>
                <RemoveRedEyeIcon />
              </IconButton>
              <Typography className="view-cnt">{property?.jewelleryViews}</Typography>
              <IconButton color={'default'} onClick={() => likePropertyHandler(user, property?._id)}>
                {property?.meLiked && property?.meLiked[0]?.myFavorite ? (
                  <FavoriteIcon style={{ color: 'red' }} />
                ) : (
                  <FavoriteIcon />
                )}
              </IconButton>
              <Typography className="view-cnt">{property?.jewelleryLikes}</Typography>
            </div>
          </div>
        </Box>
      </Stack>
    );
  }
};

export default TrendPropertyCard;
