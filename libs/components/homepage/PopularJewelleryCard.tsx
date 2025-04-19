import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Jewellery } from '../../types/jewellery/jewellery';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL, topJewelleryRank } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface PopularJewelleryCardProps {
  jewellery: Jewellery;
}

const PopularJewelleryCard = (props: PopularJewelleryCardProps) => {
  const { jewellery } = props;
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
      <Stack className="popular-card-box">
        <Box
          component={'div'}
          className={'card-img'}
          style={{ backgroundImage: `url(${REACT_APP_API_URL}/${jewellery?.jewelleryImages[0]})` }}
          onClick={() => {
            pushDetailHandler(jewellery._id);
          }}
        >
          {jewellery && jewellery?.jewelleryRank >= topJewelleryRank ? (
            <div className={'status'}>
              <img src="/img/icons/electricity.svg" alt="" />
              <span>top</span>
            </div>
          ) : (
            ''
          )}

          <div className={'price'}>${jewellery.jewelleryPrice}</div>
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
          <p className={'desc'}>{jewellery.jewelleryAddress}</p>
          <div className={'options'}>
            <div>
              <img src="/img/icons/bed.svg" alt="" />
              <span>{jewellery?.propertyBeds} bed</span>
            </div>
            <div>
              <img src="/img/icons/room.svg" alt="" />
              <span>{jewellery?.propertyRooms} rooms</span>
            </div>
            <div>
              <img src="/img/icons/expand.svg" alt="" />
              <span>{jewellery?.propertySquare} m2</span>
            </div>
          </div>
          <Divider sx={{ mt: '15px', mb: '17px' }} />
          <div className={'bott'}>
            <p>{jewellery?.jewelleryRent ? 'rent' : 'sale'}</p>
            <div className="view-like-box">
              <IconButton color={'default'}>
                <RemoveRedEyeIcon />
              </IconButton>
              <Typography className="view-cnt">{jewellery?.jewelleryViews}</Typography>
            </div>
          </div>
        </Box>
      </Stack>
    );
  } else {
    return (
      <Stack className="popular-card-box">
        <Box
          component={'div'}
          className={'card-img'}
          style={{ backgroundImage: `url(${REACT_APP_API_URL}/${jewellery?.jewelleryImages[0]})` }}
          onClick={() => {
            pushDetailHandler(jewellery._id);
          }}
        >
          {jewellery && jewellery?.jewelleryRank >= topJewelleryRank ? (
            <div className={'status'}>
              <img src="/img/icons/electricity.svg" alt="" />
              <span>top</span>
            </div>
          ) : (
            ''
          )}

          <div className={'price'}>${jewellery.jewelleryPrice}</div>
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
          <p className={'desc'}>{jewellery.jewelleryAddress}</p>
          <p className="grams">{jewellery.jewelleryGram} grams</p>
          <Divider sx={{ mt: '15px', mb: '17px' }} />
          <div className={'bott'}>
            <p>{jewellery?.jewelleryRent ? 'rent' : 'sale'}</p>
            <div className="view-like-box">
              <IconButton color={'default'}>
                <RemoveRedEyeIcon />
              </IconButton>
              <Typography className="view-cnt">{jewellery?.jewelleryViews}</Typography>
            </div>
          </div>
        </Box>
      </Stack>
    );
  }
};

export default PopularJewelleryCard;
