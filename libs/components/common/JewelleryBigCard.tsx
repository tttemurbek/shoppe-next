import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Jewellery } from '../../types/jewellery/jewellery';
import { REACT_APP_API_URL, topJewelleryRank } from '../../config';
import { formatterStr } from '../../utils';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

interface JewelleryBigCardProps {
  jewellery: Jewellery;
  likeJewelleryHandler?: any;
}

const JewelleryBigCard = (props: JewelleryBigCardProps) => {
  const { jewellery, likeJewelleryHandler } = props;
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const router = useRouter();

  /** HANDLERS **/
  const goJewelleryDetatilPage = (jewelleryId: string) => {
    router.push(`/jewellery/detail?id=${jewelleryId}`);
  };

  if (device === 'mobile') {
    return <div>APARTMEND BIG CARD</div>;
  } else {
    return (
      <Stack className="property-big-card-box" onClick={() => goJewelleryDetatilPage(jewellery?._id)}>
        <Box
          component={'div'}
          className={'card-img'}
          style={{ backgroundImage: `url(${REACT_APP_API_URL}/${jewellery?.jewelleryImages?.[0]})` }}
        >
          {jewellery && jewellery?.jewelleryRank >= topJewelleryRank && (
            <div className={'status'}>
              <img src="/img/icons/electricity.svg" alt="" />
              <span>top</span>
            </div>
          )}

          <div className={'price'}>${formatterStr(jewellery?.jewelleryPrice)}</div>
        </Box>
        <Box component={'div'} className={'info'}>
          <strong className={'title'}>{jewellery?.jewelleryTitle}</strong>
          <p className={'desc'}>{jewellery?.jewelleryAddress}</p>
          <div className={'options'}>
            {/* <div>
              <img src="/img/icons/bed.svg" alt="" />
              <span>{jewellery?.propertyBeds} bed</span>
            </div>
            <div>
              <img src="/img/icons/room.svg" alt="" />
              <span>{jewellery?.propertyRooms} rooms</span>
            </div> */}
            <div>
              <img src="/img/icons/expand.svg" alt="" />
              <span>{jewellery?.jewelleryGram} gram</span>
            </div>
          </div>
          <Divider sx={{ mt: '15px', mb: '17px' }} />
          <div className={'bott'}>
            {/* <div>
              {jewellery?.jewelleryRent ? <p>Rent</p> : <span>Rent</span>}
                {jewellery?.jewelleryBarter ? <p>Barter</p> : <span>Barter</span>}
            </div> */}
            <div className="buttons-box">
              <IconButton color={'default'}>
                <RemoveRedEyeIcon />
                <Typography className="view-cnt">{jewellery?.jewelleryViews}</Typography>
              </IconButton>
              <IconButton
                color={'default'}
                onClick={(e: any) => {
                  e.stopPropagation();
                  likeJewelleryHandler(user, jewellery?._id);
                }}
              >
                {jewellery?.meLiked && jewellery?.meLiked[0]?.myFavorite ? (
                  <FavoriteIcon style={{ color: 'red' }} />
                ) : (
                  <FavoriteIcon />
                )}
                <Typography className="view-cnt">{jewellery?.jewelleryLikes}</Typography>
              </IconButton>
              <IconButton color={'default'} onClick={() => likeJewelleryHandler('user', 'jskdnasknd')}>
                <AddShoppingCartIcon />
                <Typography className="view-cnt">{jewellery?.jewelleryLikes}</Typography>
              </IconButton>
            </div>
          </div>
        </Box>
      </Stack>
    );
  }
};

export default JewelleryBigCard;
