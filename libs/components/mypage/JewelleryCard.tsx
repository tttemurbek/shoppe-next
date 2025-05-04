import { Menu, MenuItem, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import IconButton from '@mui/material/IconButton';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';
import { Jewellery } from '../../types/jewellery/jewellery';
import { formatterStr } from '../../utils';
import Moment from 'react-moment';
import { useRouter } from 'next/router';
import { JewelleryStatus } from '../../enums/jewellery.enum';

interface PropertyCardProps {
  jewellery: Jewellery;
  deletePropertyHandler?: any;
  memberPage?: boolean;
  updatePropertyHandler?: any;
}

export const JewelleryCard = (props: PropertyCardProps) => {
  const { jewellery, deletePropertyHandler, memberPage, updatePropertyHandler } = props;
  const device = useDeviceDetect();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  /** HANDLERS **/
  const pushEditProperty = async (id: string) => {
    console.log('+pushEditProperty: ', id);
    await router.push({
      pathname: '/mypage',
      query: { category: 'addJewellery', jewelleryId: id },
    });
  };

  const pushPropertyDetail = async (id: string) => {
    if (memberPage)
      await router.push({
        pathname: '/jewellery/detail',
        query: { id: id },
      });
    else return;
  };

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (device === 'mobile') {
    return <div>MOBILE PROPERTY CARD</div>;
  } else
    return (
      <Stack className="property-card-box">
        <Stack className="image-box" onClick={() => pushPropertyDetail(jewellery?._id)}>
          <img src={`${process.env.REACT_APP_API_URL}/${jewellery.jewelleryImages[0]}`} alt="" />
        </Stack>
        <Stack className="information-box" onClick={() => pushPropertyDetail(jewellery?._id)}>
          <Typography className="name">{jewellery.jewelleryTitle}</Typography>
          <Typography className="address">{jewellery.jewelleryAddress}</Typography>
          <Typography className="price">
            <strong>${formatterStr(jewellery?.jewelleryPrice)}</strong>
          </Typography>
        </Stack>
        <Stack className="date-box">
          <Typography className="date">
            <Moment format="DD MMMM, YYYY">{jewellery.createdAt}</Moment>
          </Typography>
        </Stack>
        <Stack className="status-box">
          <Stack className="coloured-box" sx={{ background: '#E5F0FD' }} onClick={handleClick}>
            <Typography className="status" sx={{ color: '#3554d1' }}>
              {jewellery.jewelleryStatus}
            </Typography>
          </Stack>
        </Stack>
        {!memberPage && jewellery.jewelleryStatus !== 'RESERVED' && (
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                width: '70px',
                mt: 1,
                ml: '10px',
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              },
              style: {
                padding: 0,
                display: 'flex',
                justifyContent: 'center',
              },
            }}
          >
            {jewellery.jewelleryStatus === 'AVAILABLE' && (
              <>
                <MenuItem
                  disableRipple
                  onClick={() => {
                    handleClose();
                    updatePropertyHandler(JewelleryStatus.RESERVED, jewellery?._id);
                  }}
                >
                  Sold
                </MenuItem>
              </>
            )}
          </Menu>
        )}

        <Stack className="views-box">
          <Typography className="views">{jewellery.jewelleryViews.toLocaleString()}</Typography>
        </Stack>
        {!memberPage && jewellery.jewelleryStatus === JewelleryStatus.AVAILABLE && (
          <Stack className="action-box">
            <IconButton className="icon-button" onClick={() => pushEditProperty(jewellery._id)}>
              <ModeIcon className="buttons" />
            </IconButton>
            <IconButton className="icon-button" onClick={() => deletePropertyHandler(jewellery._id)}>
              <DeleteIcon className="buttons" />
            </IconButton>
          </Stack>
        )}
      </Stack>
    );
};
