import React from 'react';
import { Stack, Box, Divider, Typography, useTheme } from '@mui/material';
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
  const theme = useTheme();

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
          ) : null}

          <div className={'price'} style={{ color: theme.palette.text.primary }}>
            ${jewellery.jewelleryPrice}
          </div>
        </Box>
        <Box
          component={'div'}
          className={'info'}
          sx={{
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[1],
          }}
        >
          <strong
            className={'title'}
            onClick={() => {
              pushDetailHandler(jewellery._id);
            }}
            style={{ color: theme.palette.text.primary }}
          >
            {jewellery.jewelleryTitle}
          </strong>
          <p className={'desc'} style={{ color: theme.palette.text.secondary }}>
            {jewellery.jewelleryAddress}
          </p>
          <div className={'options'}>
            <div>
              <img src="/img/icons/bed.svg" alt="" />
              {/* <span style={{ color: theme.palette.text.primary }}>{jewellery?.propertyBeds} bed</span> */}
            </div>
            <div>
              <img src="/img/icons/room.svg" alt="" />
              {/* <span style={{ color: theme.palette.text.primary }}>{jewellery?.propertyRooms} rooms</span> */}
            </div>
            <div>
              <img src="/img/icons/expand.svg" alt="" />
              {/* <span style={{ color: theme.palette.text.primary }}>{jewellery?.propertySquare} m2</span> */}
            </div>
          </div>
          <Divider sx={{ mt: '15px', mb: '17px', borderColor: theme.palette.divider }} />
          <div className={'bott'}>
            <p style={{ color: theme.palette.text.secondary }}>{jewellery?.jewelleryRent ? 'rent' : 'sale'}</p>
            <div className="view-like-box">
              <IconButton color={'default'} sx={{ color: theme.palette.text.secondary }}>
                <RemoveRedEyeIcon />
              </IconButton>
              <Typography className="view-cnt" sx={{ color: theme.palette.text.secondary }}>
                {jewellery?.jewelleryViews}
              </Typography>
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
          ) : null}

          <div className={'price'} style={{ color: theme.palette.text.primary }}>
            ${jewellery.jewelleryPrice}
          </div>
        </Box>
        <Box
          component={'div'}
          className={'info'}
          sx={{
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[1],
          }}
        >
          <strong
            className={'title'}
            onClick={() => {
              pushDetailHandler(jewellery._id);
            }}
            style={{ color: theme.palette.text.primary }}
          >
            {jewellery.jewelleryTitle}
          </strong>
          <p className={'desc'} style={{ color: theme.palette.text.secondary }}>
            {jewellery.jewelleryAddress}
          </p>
          <p className="grams" style={{ color: theme.palette.error.main }}>
            {jewellery.jewelleryGram} grams
          </p>
          <Divider sx={{ mt: '15px', mb: '17px', borderColor: theme.palette.divider }} />
          <div className={'bott'}>
            <p style={{ color: theme.palette.text.secondary }}>{jewellery?.jewelleryRent ? 'rent' : 'sale'}</p>
            <div className="view-like-box">
              <IconButton color={'default'} sx={{ color: theme.palette.text.secondary }}>
                <RemoveRedEyeIcon />
              </IconButton>
              <Typography className="view-cnt" sx={{ color: theme.palette.text.secondary }}>
                {jewellery?.jewelleryViews}
              </Typography>
            </div>
          </div>
        </Box>
      </Stack>
    );
  }
};

export default PopularJewelleryCard;
